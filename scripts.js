    document.addEventListener('DOMContentLoaded', function() {
        const chatbotToggle = document.getElementById('chatbot-toggle');
        const chatbotContainer = document.getElementById('chatbot-container');
        const chatbotMessages = document.getElementById('chatbot-messages');
        const chatbotOptions = document.getElementById('chatbot-options');
        let toggleIcon = chatbotToggle.querySelector('.fa-comments');
        let closeIcon = chatbotToggle.querySelector('.fa-times');
        let patientOptionsAdded = false;

        
        let chatbotInitialized = false;
        let chatbotManuallyOpened = false;
        
        let isRendering = false;
        let scrollTimeout;

        function createChatbotSession() {
            return {
              serviceSelected: '',
              patientType: '',
              patientName: '',
              selectedTreatment: '',
              preferredDays: [],
              preferredTime: '',
              patientEmail: '',
              patientPhoneNo: null,
              patientDateOfBirth: null,
            //   patientSubmittedPhoto: null,
              patientEnquiry: '',
              dateOfSubmission: null,
            //   adviceSelected: '',
              
              reset() {
                // Reset all fields to their initial state
                Object.assign(this, createChatbotSession());
            },

              resetExceptService() {
                const currentService = this.serviceSelected;
                Object.assign(this, createChatbotSession());
                this.serviceSelected = currentService;
            },

            redoTreatment() {
                this.selectedTreatment = '';
                this.preferredDays = [];
                this.preferredTime = '';
                this.patientEmail = '';
                this.patientPhoneNo = null;
                this.patientDateOfBirth = null;
                this.patientSubmittedPhoto = null;
                this.patientEnquiry = '';
                this.dateOfSubmission = null;
                this.adviceSelected = '';
            },
            
            redoDays() {
                this.preferredDays = [];
                this.preferredTime = '';
                this.patientEmail = '';
                this.patientPhoneNo = null;
                this.patientDateOfBirth = null;
                this.patientSubmittedPhoto = null;
                this.patientEnquiry = '';
                this.dateOfSubmission = null;
            },
            
            redoTime() {
                this.preferredTime = '';
                this.patientEmail = '';
                this.patientPhoneNo = null;
                this.patientDateOfBirth = null;
                this.patientSubmittedPhoto = null;
                this.patientEnquiry = '';
                this.dateOfSubmission = null;
            },
            resetEmailAndBeyond() {
                this.patientEmail = '';
                this.patientPhoneNo = null;
                this.patientDateOfBirth = null;
                this.patientSubmittedPhoto = null;
                this.patientEnquiry = '';
                this.dateOfSubmission = null;
                this.adviceSelected = '';
            },
    
            resetPhoneAndBeyond() {
                this.patientPhoneNo = null;
                this.patientDateOfBirth = null;
                this.patientSubmittedPhoto = null;
                this.patientEnquiry = '';
                this.dateOfSubmission = null;
                this.adviceSelected = '';
            },
    
            resetDobAndBeyond() {
                this.patientDateOfBirth = null;
                this.patientSubmittedPhoto = null;
                this.patientEnquiry = '';
                this.dateOfSubmission = null;
                this.adviceSelected = '';
            },
            resetPhoto() {
                this.patientSubmittedPhoto = null;
            },
    
            resetEnquiry() {
                this.patientEnquiry = '';
            },
    
            resetPhotoAndEnquiry() {
                this.resetPhoto();
                this.resetEnquiry();
            },
            };
        }
          
        const patientData = createChatbotSession();

        
        const observer = new MutationObserver((mutations) => {
            if (mutations.some(mutation => mutation.type === 'childList' && mutation.addedNodes.length > 0)) {
                isRendering = true;
                scrollToBottom();
                
                // Set a timeout to allow for any additional rapid changes
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isRendering = false;
                }, 100); // Adjust this value as needed
            }
        });
        
        const config = { childList: true, subtree: true };
        observer.observe(chatbotContainer, config);
        
        function scrollToBottom() {
            if (isRendering) {
                chatbotContainer.scrollTop = chatbotContainer.scrollHeight;
            }
        }

        let userScrolling = false;
        chatbotContainer.addEventListener('scroll', () => {
            if (!isRendering) {
                userScrolling = true;
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    userScrolling = false;
                }, 150); // Adjust this value for responsiveness
            }
        });
        
        // Modify scrollToBottom to respect user scrolling
        function scrollToBottom() {
            if (isRendering && !userScrolling) {
                chatbotContainer.scrollTop = chatbotContainer.scrollHeight;
            }
            
        }
                // function addGreetMessage(message) {
        //     const messageElement = document.createElement('div');
        //     messageElement.classList.add('chatbot-message', 'bot');
        //     messageElement.innerHTML = `
        //         <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
        //         <div class="message-content"><strong>${message}</strong></div>
        //     `;
        //     chatbotMessages.appendChild(messageElement);
            
        // }
        




        const initialIntents = [
            "Book a Consultation",
            "Dental checkup",
            "Emergency appointment",
            "Composite Bonding",
            "Replace missing teeth",
            "Dental Hygiene",
            "Tooth Extraction",
            "Enquire about our treatments",
            "Send a general enquiry"
        ];

        const treatments = [
            { name: "children and family dentistry", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/Child-Dentistry.jpg" },
            { name: "crowns", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/crowns.jpg" },
            { name: "fillings", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/fillings.jpg" },
            { name: "dentures", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/dentures.jpg" },
            { name: "composite bonding", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/composite%20bonding.jpg" },
            { name: "cosmetic smile", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/cosmetic%20smile.jpg" },
            { name: "dental bridges", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/dental%20bridges.jpg" },
            { name: "dental checkups", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/dental%20checkups.jpg" },
            { name: "gum disease treatment", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/gum%20disease%20treatment.jpg" },
            { name: "dental hygienist", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/dental%20hygienist.jpg" },
            { name: "root canal treatment", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/rootcanal.jpg" },
            { name: "teeth whitening", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/teeth%20whitening.jpg" },
            { name: "tooth extractions", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/tooth%20extraction.jpg" },
            { name: "not sure, need advice", image: "https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/not%20sure%20need%20advice.jpg" }
        ];

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        let userName = '';
        let email = '';
        let phone_no = '';
        let selectedIntent = '';

        if (!chatbotToggle || !chatbotContainer) {
            console.error("Chatbot toggle button or container not found");
            return;
        }

        if (!toggleIcon) {
            toggleIcon = document.createElement('i');
            toggleIcon.className = 'fas fa-comments';
            chatbotToggle.appendChild(toggleIcon);
        }
    
        if (!closeIcon) {
            closeIcon = document.createElement('i');
            closeIcon.className = 'fas fa-times hidden';
            chatbotToggle.appendChild(closeIcon);
        }


        setTimeout(function() {
            chatbotToggle.classList.remove('hidden');
        }, 5000);
        
        // Automatically open the chatbot after 10 seconds
        setTimeout(function() {
            if (!chatbotInitialized && !chatbotManuallyOpened) {
                initializeChatbot();
                chatbotInitialized = true;
                chatbotContainer.classList.remove('hidden');
                toggleChatbotIcon();
            }
        }, 10000);  // 10000 milliseconds = 10 seconds


        function toggleChatbotIcon() {
            toggleIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        }
    
        function handleChatbotToggleAfterDisable() {
            chatbotContainer.classList.toggle('hidden');
            toggleChatbotIcon();
        }
    
        chatbotToggle.addEventListener('click', function() {
            if (chatbotContainer.classList.contains('disabled')) {
                handleChatbotToggleAfterDisable();
            } else {
                if (chatbotContainer.classList.contains('hidden') && !chatbotInitialized) {
                    initializeChatbot();
                    chatbotInitialized = true;
                }
                chatbotContainer.classList.toggle('hidden');
                toggleChatbotIcon();
                chatbotManuallyOpened = !chatbotContainer.classList.contains('hidden');
            }
        });
    

        const resetButton = document.getElementById('reset-button');

        // Add this function to show the reset button
        function showResetButton() {
            resetButton.classList.remove('hidden');
            resetButton.classList.add('visible');
        }

        // Add event listener for the reset button
        resetButton.addEventListener('click', () => {
            showConfirmationModal(redoIntentSelection, null);
        });


        function initializeChatbot() {
            chatbotMessages.innerHTML = '';
            chatbotOptions.innerHTML = '';
            
        
            // Reset scroll position
            chatbotMessages.scrollTop = 0;
        
            const greetingMessages = [
                "Good evening, Welcome to Kaa Dentals😀",
                "I'm Leah, here to help with your enquiry",
                "Which of our services are you interested in?"
            ];
        
            showMessagesSequentially(greetingMessages, chatbotMessages, () => {
                setTimeout(showIntents, 1000);
            });

            showResetButton()
        }

        function showLoadingAnimation(callback, container = chatbotMessages) {
            const loadingElement = document.createElement('div');
            loadingElement.classList.add('chatbot-message', 'bot');
            loadingElement.innerHTML = `
                <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                <div class="message-content">
                    <div class="loading">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            `;
            container.appendChild(loadingElement);
            

            setTimeout(() => {
                container.removeChild(loadingElement);
                callback();
            }, 1000);
        }



        function showIntents() {
            const intentsContainer = document.createElement('div');
            intentsContainer.id = 'chatbot-options';
            intentsContainer.classList.add('times-options-container', 'intents-options-container');
        
            initialIntents.forEach(intent => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('time-option-item', 'intent-option-item');
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.id = `intent-${intent.toLowerCase().replace(/\s+/g, '-')}`;
                radio.name = 'intent-choice';
                radio.value = intent;
        
                const label = document.createElement('label');
                label.htmlFor = radio.id;
                label.textContent = intent;
        
                optionElement.appendChild(radio);
                optionElement.appendChild(label);
                intentsContainer.appendChild(optionElement);
        
                optionElement.addEventListener('click', () => handleOptionClick(intent));
            });
        
            chatbotMessages.appendChild(intentsContainer);
            
            
        }

        function handleOptionClick(intent) {
            const intentsContainer = document.getElementById('chatbot-options');
            const options = intentsContainer.querySelectorAll('.intent-option-item');
            selectedIntent = intent;

            patientData.serviceSelected = intent;

            
            intentsContainer.classList.add('option-selected');
        
            options.forEach(option => {
                option.style.pointerEvents = 'none';
                option.style.cursor = 'default';
                
                if (option.querySelector('label').textContent === intent) {
                    option.classList.add('selected');
                    option.querySelector('input[type="radio"]').checked = true;
                } else {
                    option.classList.add('not-selected');
                }
            });
        
            // Add redo button
            if (!document.querySelector('.redo-button-intent')) {
                const redoButton = document.createElement('button');
                redoButton.innerHTML = '↻';
                redoButton.classList.add('redo-button-intent');
                redoButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showConfirmationModal(() => {
                        redoIntentSelection();
                    });
                });
        
                intentsContainer.appendChild(redoButton);
            }
        
            setTimeout(() => {
                if (intent === "Book a Consultation" || intent === "Dental checkup" || intent === "Send a general enquiry" || intent === "Enquire about our treatments" ||
                    intent === "Dental Hygiene" || intent === "Tooth Extraction" || intent === "Composite Bonding" || intent === "Replace missing teeth") {
                    proceedWithBooking();
                } else {
                    handleEmergencyAppointment();
                }
            }, 1000);
        }

        // Modify redoIntentSelection function
        function redoIntentSelection() {
            // Clear all content within the chatbot container
            chatbotMessages.innerHTML = '';
            chatbotOptions.innerHTML = '';

            // Remove any additional containers that might have been added
            const containersToRemove = chatbotContainer.querySelectorAll('div:not(#chatbot-messages):not(#chatbot-options)');
            containersToRemove.forEach(container => container.remove());

            patientData.reset();


            // Hide the reset button
            resetButton.classList.remove('visible');
            resetButton.classList.add('hidden');

            // Reinitialize the chatbot
            initializeChatbot();
        
        }

        function handleEmergencyAppointment() {
            const chatbotContainer = document.getElementById('chatbot-container');
            const chatbotOptions = document.getElementById('chatbot-options');
        
            const emergencyMessagesContainer = document.createElement('div');
            emergencyMessagesContainer.classList.add('emergency-messages-container');
        
            // Insert after the chatbot-options
            if (chatbotOptions && chatbotOptions.nextSibling) {
                chatbotContainer.insertBefore(emergencyMessagesContainer, chatbotOptions.nextSibling);
            } else {
                chatbotContainer.appendChild(emergencyMessagesContainer);
            }
        
            const emergencyMessages = [
                "We know how distressing, and often painful, a dental emergency can be, so we will try to see you as soon as we can",
                "But first...",
                "May I ask your full name so I know who I'm speaking with?"
            ];
        
            showMessagesSequentially(emergencyMessages, emergencyMessagesContainer, () => {
                setTimeout(addNameInputEmergency, 1000);
            });
        }

        function addNameInputEmergency() {
            const chatbotContainer = document.getElementById('chatbot-container');
            const emergencyMessagesContainer = document.querySelector('.emergency-messages-container');
        
            const nameInputContainer = document.createElement('div');
            nameInputContainer.classList.add('name-input-container-emergency');
        
            const nameInput = document.createElement('input');
            nameInput.id = 'user-name-input-emergency';
            nameInput.type = 'text';
            nameInput.placeholder = 'Enter your full name';

            // Add event listener for Enter key
            nameInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    handleNameSubmissionEmergency();
                }
            });
            nameInputContainer.appendChild(nameInput);
        
            const submitButton = document.createElement('button');
            submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
            submitButton.addEventListener('click', handleNameSubmissionEmergency);
            nameInputContainer.appendChild(submitButton);
        
            if (emergencyMessagesContainer && emergencyMessagesContainer.nextSibling) {
                chatbotContainer.insertBefore(nameInputContainer, emergencyMessagesContainer.nextSibling);
            } else {
                chatbotContainer.appendChild(nameInputContainer);
            }
            
        }
        
        function handleNameSubmissionEmergency() {
            const nameInput = document.getElementById('user-name-input-emergency');
            const name = nameInput.value.trim();
            if (name) {
                userName = name;
                patientData.patientName = name;

                const inputContainer = document.querySelector('.name-input-container-emergency');
                inputContainer.remove();
        
                const nameSubmissionContainer = document.createElement('div');
                nameSubmissionContainer.classList.add('name-submission-container-emergency');
        
                const redoButton = document.createElement('button');
                redoButton.innerHTML = '↻';
                redoButton.classList.add('redo-button-name-emergency');
                redoButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showConfirmationModal(() => {
                        redoEmergencyNameSelection();
                    });
                });
                nameSubmissionContainer.appendChild(redoButton);
        
                const userNameMessage = document.createElement('div');
                userNameMessage.classList.add('chatbot-message', 'user','submitted-message');
                userNameMessage.innerHTML = `
                    <div class="message-content">${userName}</div>
                `;
                nameSubmissionContainer.appendChild(userNameMessage);
        
                document.querySelector('.emergency-messages-container').insertAdjacentElement('afterend', nameSubmissionContainer);
        
                const followUpMessagesContainer = document.createElement('div');
                followUpMessagesContainer.classList.add('name-follow-messages-container-emergency');
                nameSubmissionContainer.insertAdjacentElement('afterend', followUpMessagesContainer);
        
                showInquiryMessages(followUpMessagesContainer);
            }
        }


        function redoEmergencyNameSelection() {
            // Remove all containers that were added after the initial emergency process
            const containersToRemove = [
                '.name-submission-container-emergency',
                '.name-follow-messages-container-emergency',
                '.inquiry-messages-container',
                '.privacy-options-container',
                '.email-follow-up-container',
                '.no-agreement-container'
            ];

            patientData.resetExceptService();

        
            containersToRemove.forEach(selector => {
                const containers = document.querySelectorAll(selector);
                containers.forEach(container => container.remove());
            });
            
            const enquiryOptionsContainer = document.querySelector('.enquiry-options-container');
            if (enquiryOptionsContainer) {
                enquiryOptionsContainer.remove();
            }
            const enquiryMessagesContainer = document.querySelector('.enquiry-messages-container');
            if (enquiryMessagesContainer) {
                enquiryMessagesContainer.remove();
            }
            const enquiryContainer = document.querySelector('.enquiry-container');
            if (enquiryContainer) {
                enquiryContainer.remove();
            }
        
            // Remove final messages container if it exists
            const finalMessagesContainer = document.querySelector('.final-messages-container');
            if (finalMessagesContainer) {
                finalMessagesContainer.remove();
            }
            const photoFollowContainer = document.querySelector('.photo-follow-container')
                if (photoFollowContainer) {
                    photoFollowContainer.remove();
                }

        
            // Call addNameInputEmergency to restart the name input process
            setTimeout(addNameInputEmergency,500);
        }

        function proceedWithBooking() {
    if (patientOptionsAdded) {
        console.log("Patient options already added. Skipping.");
        return;
    }

    const optionsElement = document.querySelector('#chatbot-options');

    const loadingContainer = document.createElement('div');
    loadingContainer.classList.add('loading-container');

    const loadingElement = document.createElement('div');
    loadingElement.classList.add('chatbot-message', 'bot', 'loading-message');
    loadingElement.innerHTML = `
        <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
        <div class="message-content">
            <div class="loading">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    loadingContainer.appendChild(loadingElement);

    optionsElement.insertAdjacentElement('afterend', loadingContainer);

    setTimeout(() => {
        loadingContainer.remove();

        const newMessageContainer = document.createElement('div');
        newMessageContainer.classList.add('chatbot-message', 'bot');
        newMessageContainer.innerHTML = `
            <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar" style="margin-top:20px">
            <div class="message-content" id="patient-ask-msg" style="margin-top:20px"><strong>Are you a new or existing patient?</strong></div>
        `;
        optionsElement.insertAdjacentElement('afterend', newMessageContainer);

        const patientOptionsContainer = document.createElement('div');
        patientOptionsContainer.classList.add('patient-options-container');
        patientOptionsContainer.innerHTML = `
            <button class="patient-option-button" onclick="handlePatientOption('new')">New Patient</button>
            <button class="redo-button-patient hidden" onclick="redoPatientSelection()">↻</button>
            <button class="patient-option-button" onclick="handlePatientOption('existing')">Existing Patient</button>
        `;
        newMessageContainer.insertAdjacentElement('afterend', patientOptionsContainer);

        patientOptionsAdded = true;
    }, 1500);
}

        window.handlePatientOption = function(patientType) {
            const options = document.querySelectorAll('.patient-option-button');
            const redoButton = document.querySelector('.redo-button-patient');
            
            options.forEach(option => {
                if (option.textContent.toLowerCase().includes(patientType)) {
                    option.classList.add('selected');
                } else {
                    option.classList.add('blurred');
                }
                option.disabled = true;
            });
        
            redoButton.style.display = 'inline-flex';
            patientData.patientType = patientType;

        
            const patientOptionsContainer = document.querySelector('.patient-options-container');
        
            const welcomeMessagesContainer = document.createElement('div');
            welcomeMessagesContainer.classList.add('welcome-messages-container');
            patientOptionsContainer.insertAdjacentElement('afterend', welcomeMessagesContainer);
        
            const welcomeMessages = patientType === 'new' ? [
                "Welcome 👋",
                "I'd be happy to assist",
                "May I ask your full name so I know who I'm speaking with?"
            ] : [
                "Welcome back👋",
                "I'd be happy to assist",
                "May I ask your full name so I know who I'm speaking with?"
            ];
        
            window.showMessagesSequentially(welcomeMessages, welcomeMessagesContainer, () => {
                    setTimeout(addNameInput, 1000);
            });
        };

        window.showMessagesSequentially = function(messages, container, callback) {
            messages.forEach((message, index) => {
                setTimeout(() => {
                    showLoadingAnimation(() => {
                        addMessage(container, message);
                        if (index === messages.length - 1 && callback) {
                            callback();
                        }
                    }, container);
                }, index * 2000);
            });
        };
        window.redoPatientSelection = function() {
            // Remove all containers that were added after the initial booking process
            showConfirmationModal(() => {
                const containersToRemove = [
                    '.patient-options-container',
                    '#days-selection-container',
                    '.days-follow-up-message-container',
                    '#times-selection-container',
                    '.inquiry-messages-container',
                    '.privacy-options-container',
                    '.email-follow-up-container',
                    '.no-agreement-container',
                    '.final-choice-follow-up-container',
                    '.welcome-messages-container',
                    '.name-input-container'
                ];
                
                patientData.resetExceptService();

                containersToRemove.forEach(selector => {
                    const containers = document.querySelectorAll(selector);
                    containers.forEach(container => container.remove());
                });
            
                // Remove treatment slider container if it exists
                const treatmentSliderContainer = document.querySelector('.treatment-slider-container');
                if (treatmentSliderContainer) {
                    treatmentSliderContainer.remove();
                }

                const nameSubmissionContainer = document.querySelector('.name-submission-container');
                if (nameSubmissionContainer) {
                    nameSubmissionContainer.remove();
                }
            
                // Remove follow-up messages container
                const followUpMessagesContainer = document.querySelector('.name-follow-messages-container');
                if (followUpMessagesContainer) {
                    followUpMessagesContainer.remove();
                }
            
                // Remove the "Are you a new or existing patient?" message
                const patientAskMsg = document.getElementById('patient-ask-msg');
                if (patientAskMsg) {
                    patientAskMsg.closest('.chatbot-message').remove();
                }


                const enquiryOptionsContainer = document.querySelector('.enquiry-options-container');
                if (enquiryOptionsContainer) {
                    enquiryOptionsContainer.remove();
                }
                const enquiryMessagesContainer = document.querySelector('.enquiry-messages-container');
                if (enquiryMessagesContainer) {
                    enquiryMessagesContainer.remove();
                }
                const enquiryContainer = document.querySelector('.enquiry-container');
                if (enquiryContainer) {
                    enquiryContainer.remove();
                }
            
                // Remove final messages container if it exists
                const finalMessagesContainer = document.querySelector('.final-messages-container');
                if (finalMessagesContainer) {
                    finalMessagesContainer.remove();
                }
                const photoFollowContainer = document.querySelector('.photo-follow-container')
                    if (photoFollowContainer) {
                        photoFollowContainer.remove();
                    }
            
                // Call proceedWithBooking to restart the booking process
                proceedWithBooking();
            })    
        };

        function addMessage(container, message) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chatbot-message', 'bot');
            messageElement.innerHTML = `
                <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                <div class="message-content"><strong>${message}</strong></div>
            `;
            container.appendChild(messageElement);

            
        }

        function addNameInput() {
            const welcomeMessagesContainer = document.querySelector('.welcome-messages-container');

        
            const nameInputContainer = document.createElement('div');
            nameInputContainer.classList.add('name-input-container');
        
            const nameInput = document.createElement('input');
            nameInput.id = 'user-name-input';
            nameInput.type = 'text';
            nameInput.placeholder = 'Enter your full name';


            // Add event listener for Enter key
            nameInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    handleNameSubmission();
                }
            });

            nameInputContainer.appendChild(nameInput);
        
            const submitButton = document.createElement('button');
            submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
            submitButton.addEventListener('click', handleNameSubmission);
            nameInputContainer.appendChild(submitButton);

        
            welcomeMessagesContainer.insertAdjacentElement('afterend', nameInputContainer);
        }

        function handleNameSubmission() {
            const nameInput = document.getElementById('user-name-input');
            const name = nameInput.value.trim();
            if (name) {
                userName = name;
                patientData.patientName = name;

                const inputContainer = document.querySelector('.name-input-container');
                inputContainer.remove();
        
                const nameSubmissionContainer = document.createElement('div');
                nameSubmissionContainer.classList.add('name-submission-container');
        
                const redoButton = document.createElement('button');
                redoButton.innerHTML = '↻';
                redoButton.classList.add('redo-button-name');
                redoButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    redoPatientSelection();
                });
                nameSubmissionContainer.appendChild(redoButton);
        
                const userNameMessage = document.createElement('div');
                userNameMessage.classList.add('chatbot-message', 'user','submitted-message');
                userNameMessage.innerHTML = `
                    <div class="message-content">${userName}</div>
                `;
                nameSubmissionContainer.appendChild(userNameMessage);
        
                document.querySelector('.welcome-messages-container').insertAdjacentElement('afterend', nameSubmissionContainer);
            
                const followUpMessagesContainer = document.createElement('div');
                followUpMessagesContainer.classList.add('name-follow-messages-container');
                nameSubmissionContainer.insertAdjacentElement('afterend', followUpMessagesContainer);
        
                // Use the stored selectedIntent instead of trying to find it in the DOM
                if (selectedIntent === "Send a general enquiry") {
                    const followUpMessages = [
                        `Thanks, ${userName}.`,
                        "Let's proceed with your general enquiry."
                    ];
        
                    showMessagesSequentially(followUpMessages, followUpMessagesContainer, () => {
            
                        setTimeout(() => showInquiryMessages(followUpMessagesContainer), 1000);
                    });
                } else if (selectedIntent === "Dental Hygiene" || selectedIntent === "Tooth Extraction" || selectedIntent === "Composite Bonding" || selectedIntent === "Replace missing teeth" || selectedIntent === "Dental checkup") {
                    const followUpMessages = [
                        `Thanks, ${userName}.`,
                        `What would you like to do, ${userName}?`
                    ];
        
                    showMessagesSequentially(followUpMessages, followUpMessagesContainer, () => {
            
                        setTimeout(() => showFinalChoices(followUpMessagesContainer), 1000);
                    });
                } else {
                    // This now handles both "Book a Consultation" and "Enquire about our treatments"
                    const followUpMessages = [
                        `Thanks, ${userName}.`,
                        "What treatment are you interested in?"
                    ];
                    showMessagesSequentially(followUpMessages, followUpMessagesContainer, () => {
            
                        setTimeout(() => addTreatMentSlider(followUpMessagesContainer, selectedIntent), 1000);
                    });
                }
            }
        }

        

        function addTreatMentSlider(container, selectedIntent) {

            const treatmentSliderContainer = document.createElement('div');
            treatmentSliderContainer.classList.add('treatment-slider-container');
            container.appendChild(treatmentSliderContainer);
        
            const leftArrow = document.createElement('button');
            leftArrow.classList.add('slider-arrow', 'left-arrow');
            leftArrow.innerHTML = '&lt;';
            treatmentSliderContainer.appendChild(leftArrow);
        
            const treatmentSlider = document.createElement('div');
            treatmentSlider.classList.add('treatment-slider');
            treatmentSliderContainer.appendChild(treatmentSlider);
        
            const rightArrow = document.createElement('button');
            rightArrow.classList.add('slider-arrow', 'right-arrow');
            rightArrow.innerHTML = '&gt;';
            treatmentSliderContainer.appendChild(rightArrow);
        
            treatments.forEach((treatment, index) => {
                const treatmentCard = document.createElement('div');
                treatmentCard.classList.add('treatment-card');
                treatmentCard.dataset.index = index;
        
                const article = document.createElement('article');
                
                const treatmentImage = document.createElement('img');
                treatmentImage.src = treatment.image;
                treatmentImage.alt = treatment.name;
        
                const treatmentName = document.createElement('div');
                treatmentName.textContent = treatment.name;
                treatmentName.classList.add('treatment-name');
        
                const selectButton = document.createElement('button');
                selectButton.textContent = 'Select';
                selectButton.classList.add('select-button');
        
                const tickMark = document.createElement('div');
                tickMark.classList.add('tick-mark');
                tickMark.innerHTML = '&#10004;';
                tickMark.style.display = 'none';
        
                article.appendChild(treatmentImage);
                article.appendChild(treatmentName);
                article.appendChild(selectButton);
                article.appendChild(tickMark);
        
                treatmentCard.appendChild(article);
                treatmentSlider.appendChild(treatmentCard);
        
                treatmentCard.addEventListener('click', () => handleTreatmentSelection(treatmentCard));
            });

            function handleTreatmentSelection(card) {
                const selectedCard = treatmentSlider.querySelector('.selected');
                if (selectedCard) {
                    selectedCard.classList.remove('selected');
                    selectedCard.querySelector('.tick-mark').style.display = 'none';
                    const existingRedoButton = selectedCard.querySelector('.redo-button-treatment');
                    if (existingRedoButton) existingRedoButton.remove();
                    removeOverlay();
                }
            
                card.classList.add('selected');
                card.querySelector('.tick-mark').style.display = 'block';
                disableArrows();
                disableCardClicks();
            
                // First, add the overlay
                addOverlay();
            
                // Then, after a short delay, add the redo button
                setTimeout(() => {
                    const redoButton = document.createElement('button');
                    redoButton.innerHTML = '↻';
                    redoButton.classList.add('redo-button-treatment');
                    redoButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showConfirmationModal(() => {
                            redoTreatmentSelection(card);
                        });
                    });
                    card.querySelector('article').appendChild(redoButton);
                
                    // Trigger a reflow before adding the 'visible' class
                    redoButton.offsetHeight;
                
                    // Add a 'visible' class to trigger the fade-in
                    redoButton.classList.add('visible');
                }, 300);
            

                setTimeout(() => {
                    const afterTreatmentMessagesContainer = document.createElement('div');
                    afterTreatmentMessagesContainer.classList.add('after-treatment-follow-messages-container');
        
                    treatmentSliderContainer.insertAdjacentElement('afterend', afterTreatmentMessagesContainer);
                    
        
                    const selectedTreatmentName = card.querySelector('.treatment-name').textContent.trim();
                    patientData.selectedTreatment = selectedTreatmentName;
        
                    if (selectedIntent === "Enquire about our treatments") {
                        const treatmentFollowMessages = [
                            `What would you like to do, ${userName}?`
                        ];
        
                        showMessagesSequentially(treatmentFollowMessages, afterTreatmentMessagesContainer, () => {
                                            setTimeout(() => showFinalChoices(afterTreatmentMessagesContainer), 1000);
                        });
                    }
                    else {
                        const treatmentFollowMessages = selectedTreatmentName !== "not sure, need advice" ? [
                            `What days work best for you, ${userName}?`,
                            "Feel free to select multiple options.",
                            "Someone from the team will be in touch to confirm the appointment with you."
                        ] : [
                            "No problem 👍",
                            "Our team would be happy to advise you",
                            `What would you like to do, ${userName}?`
                        ];
        
                        showMessagesSequentially(treatmentFollowMessages, afterTreatmentMessagesContainer, () => {
                            if (selectedTreatmentName !== "not sure, need advice") {
                                                    setTimeout(() => showDays(afterTreatmentMessagesContainer), 1000);
                            } else {
                                                    setTimeout(() => showFinalChoices(afterTreatmentMessagesContainer), 1000);
                            }
                        });
                    }
                }, 1000);
            }
            
            function disableArrows() {
                leftArrow.disabled = true;
                rightArrow.disabled = true;

                rightArrow.style.cursor = 'default';
                leftArrow.style.cursor = 'default';
            }
        
            function enableArrows() {
                leftArrow.disabled = false;
                rightArrow.style.cursor = 'pointer';
                leftArrow.style.cursor = 'pointer';
            }
        
            function disableCardClicks() {
                const cards = treatmentSlider.querySelectorAll('.treatment-card');
                cards.forEach(card => {
                    card.style.pointerEvents = 'none';
                    card.style.cursor = 'default';
                });
            }
        
            function enableCardClicks() {
                const cards = treatmentSlider.querySelectorAll('.treatment-card');
                cards.forEach(card => {
                    card.style.pointerEvents = 'auto';
                    card.style.cursor = 'pointer';
                });
            }

            function addOverlay() {
                const overlay = document.createElement('div');
                overlay.classList.add('treatment-slider-overlay');
                treatmentSliderContainer.appendChild(overlay);
            
                // Trigger a reflow before adding the 'visible' class
                overlay.offsetHeight;
            
                // Add a 'visible' class to trigger the transition
                overlay.classList.add('visible');
            }
            
            function removeOverlay() {
                const overlay = treatmentSliderContainer.querySelector('.treatment-slider-overlay');
                if (overlay) {
                    overlay.remove();
                }
            }
        
            function updateArrowVisibility() {
                const firstVisibleCardIndex = Math.round(treatmentSlider.scrollLeft / (treatmentSlider.children[0].offsetWidth + parseInt(getComputedStyle(treatmentSlider).gap)));
                const lastVisibleCardIndex = firstVisibleCardIndex + Math.floor(treatmentSlider.clientWidth / (treatmentSlider.children[0].offsetWidth + parseInt(getComputedStyle(treatmentSlider).gap))) - 1;
        
                leftArrow.style.visibility = firstVisibleCardIndex === 0 ? 'hidden' : 'visible';
                rightArrow.style.visibility = lastVisibleCardIndex >= treatments.length - 2 ? 'hidden' : 'visible';
            }
        
            leftArrow.addEventListener('click', () => {
                const cardWidth = treatmentSlider.children[0].offsetWidth + parseInt(getComputedStyle(treatmentSlider).gap);
                const currentScroll = treatmentSlider.scrollLeft;
                
                // Calculate the nearest card start position to the left
                const targetScroll = Math.floor(currentScroll / cardWidth) * cardWidth - cardWidth;
                
                // Ensure we don't scroll past the start
                const finalScroll = Math.max(0, targetScroll);
            
                treatmentSlider.scrollTo({ left: finalScroll, behavior: 'smooth' });
                setTimeout(updateArrowVisibility, 300);
            });
        
            rightArrow.addEventListener('click', () => {
                const cardWidth = treatmentSlider.children[0].offsetWidth + parseInt(getComputedStyle(treatmentSlider).gap);
                const currentScroll = treatmentSlider.scrollLeft;
                const targetScroll = Math.ceil(currentScroll / cardWidth) * cardWidth + cardWidth;
                treatmentSlider.scrollTo({ left: targetScroll, behavior: 'smooth' });
                setTimeout(updateArrowVisibility, 300);
            });
        
            updateArrowVisibility();
        }
        function redoTreatmentSelection(card) {
            // Remove selected state from the card
            card.classList.remove('selected');
            card.querySelector('.tick-mark').style.display = 'none';
            card.querySelector('.redo-button-treatment').remove();
            patientData.redoTreatment();

            // Remove subsequent containers
            const containersToRemove = [
                '.treatment-slider-container',
                '#days-selection-container',
                '.days-follow-up-message-container',
                '#times-selection-container',
                '.inquiry-messages-container',
                '.privacy-options-container',
                '.email-follow-up-container',
                '.no-agreement-container',
                '.final-choice-follow-up-container',
                '.after-treatment-follow-messages-container'
            ];
        
            containersToRemove.forEach(selector => {
                const containers = document.querySelectorAll(selector);
                containers.forEach(container => container.remove());
            });

            const photoContainer = document.querySelector('.photo-container');
            if (photoContainer) {
                photoContainer.remove();
            }
            const uploadedImageContainer = document.querySelector('.uploaded-image-container');
            if (uploadedImageContainer) {
                uploadedImageContainer.remove();
            }
        
            // Remove enquiry-related elements if they exist
            const enquiryOptionsContainer = document.querySelector('.enquiry-options-container');
            if (enquiryOptionsContainer) {
                enquiryOptionsContainer.remove();
            }
            const enquiryMessagesContainer = document.querySelector('.enquiry-messages-container');
            if (enquiryMessagesContainer) {
                enquiryMessagesContainer.remove();
            }
            const enquiryContainer = document.querySelector('.enquiry-container');
            if (enquiryContainer) {
                enquiryContainer.remove();
            }
        
            // Remove final messages container if it exists
            const finalMessagesContainer = document.querySelector('.final-messages-container');
            if (finalMessagesContainer) {
                finalMessagesContainer.remove();
            }
            const photoFollowContainer = document.querySelector('.photo-follow-container')
                if (photoFollowContainer) {
                    photoFollowContainer.remove();
                }
            
        
            // Show loading animation and recreate treatment slider
            const parentContainer = document.querySelector('.name-follow-messages-container');
            showLoadingAnimation(() => {
                addTreatMentSlider(parentContainer, selectedIntent);
            }, parentContainer);


        }

        function showDays(container) {
            const daysContainer = document.createElement('div');
            daysContainer.id = 'days-selection-container';
            daysContainer.classList.add('days-options-container');
        
            days.forEach(day => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('day-option-item');
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `day-${day.toLowerCase().replace("'", "").replace(" ", "-")}`;
                checkbox.name = 'day-choice';
                checkbox.value = day;
        
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = day;
        
                optionElement.appendChild(checkbox);
                optionElement.appendChild(label);
                daysContainer.appendChild(optionElement);
        
                optionElement.addEventListener('click', () => {
                    checkbox.checked = !checkbox.checked;
                    optionElement.classList.toggle('selected', checkbox.checked);
                });
            });
        
            const continueButton = document.createElement('button');
            continueButton.textContent = 'CONTINUE';
            continueButton.classList.add('days-continue-button');
            continueButton.addEventListener('click', handleDaysContinue);
        
            daysContainer.appendChild(continueButton);
        
            if (container) {
                container.appendChild(daysContainer);
            } else {
                const afterTreatmentMessagesContainer = document.querySelector('.after-treatment-follow-messages-container');
                if (afterTreatmentMessagesContainer) {
                    afterTreatmentMessagesContainer.appendChild(daysContainer);
                } else {
                    console.error('No suitable container found for days selection');
                    return;
                }
            }
        
            
        }
        
        function handleDaysContinue() {
            const selectedDays = Array.from(document.querySelectorAll('input[name="day-choice"]:checked'))
                .map(checkbox => checkbox.value);
            
            if (selectedDays.length > 0) {
                patientData.preferredDays = selectedDays;
                const daysContainer = document.getElementById('days-selection-container');
                daysContainer.classList.add('option-selected');
        
                // Disable all options to prevent further changes
                daysContainer.querySelectorAll('.day-option-item').forEach(item => {
                    item.style.pointerEvents = 'none';
                    item.style.cursor = 'default';
                });
        
                // Update styles for selected and not selected options
                daysContainer.querySelectorAll('.day-option-item').forEach(item => {
                    const checkbox = item.querySelector('input[type="checkbox"]');
                    if (checkbox.checked) {
                        item.classList.add('selected');
                    } else {
                        item.classList.add('not-selected');
                    }
                });
        
                // Remove continue button
                const continueButton = daysContainer.querySelector('.days-continue-button');
                if (continueButton) {
                    continueButton.remove();
                }
        
                // Add redo button
                if (!daysContainer.querySelector('.redo-button-day')) {
                    const redoButton = document.createElement('button');
                    redoButton.innerHTML = '↻';
                    redoButton.classList.add('redo-button-day');
                    redoButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showConfirmationModal(() => {
                            handleDaysRedo();
                        });
                    });
                    daysContainer.appendChild(redoButton);
                }
        
                // Process the selected days and show follow-up message
                const daysFollowUpMessageContainer = document.createElement('div');
                daysFollowUpMessageContainer.classList.add('days-follow-up-message-container');
        
                const daysFollowUpMessages = [
                    "Great! what time would be good for you?",
                ];
        
                daysContainer.insertAdjacentElement('afterend', daysFollowUpMessageContainer);
                
        
                // Show the time of day options
                showMessagesSequentially(daysFollowUpMessages, daysFollowUpMessageContainer, () => {
                            setTimeout(showTimesOfDay, 1000);
                });
            }
        }

        function handleDaysRedo() {
            const container = document.querySelector('.after-treatment-follow-messages-container') || document.querySelector('.final-choice-follow-up-container');
                              
            patientData.redoDays();
                              
            // Remove enquiry-related elements
            const enquiryOptionsContainer = document.querySelector('.enquiry-options-container');
            if (enquiryOptionsContainer) {
                enquiryOptionsContainer.remove();
            }
            const enquiryMessagesContainer = document.querySelector('.enquiry-messages-container');
            if (enquiryMessagesContainer) {
                enquiryMessagesContainer.remove();
            }
            const enquiryContainer = document.querySelector('.enquiry-container');
            if (enquiryContainer) {
                enquiryContainer.remove();
            }
            const uploadedImageContainer = document.querySelector('.uploaded-image-container');
            if (uploadedImageContainer) {
                uploadedImageContainer.remove();
            }
        
            // Remove final messages container
            const finalMessagesContainer = document.querySelector('.final-messages-container');
            if (finalMessagesContainer) {
                finalMessagesContainer.remove();
            }
            const photoFollowContainer = document.querySelector('.photo-follow-container');
            if (photoFollowContainer) {
                photoFollowContainer.remove();
            }                  
            if (container) {
                // Remove all day-related elements
                const daysContainer = container.querySelector('#days-selection-container');
                const daysFollowUpContainer = container.querySelector('.days-follow-up-message-container');
                const emailFollowUpContainer = container.querySelector('.email-follow-up-container');
        
                if (daysContainer) daysContainer.remove();
                if (daysFollowUpContainer) daysFollowUpContainer.remove();
                if (emailFollowUpContainer) emailFollowUpContainer.remove();
        
                // Remove any subsequent containers
                let nextElement = daysContainer ? daysContainer.nextElementSibling : null;
                while (nextElement) {
                    const elementToRemove = nextElement;
                    nextElement = nextElement.nextElementSibling;
                    elementToRemove.remove();
                }
        
                // Show loading animation
                showLoadingAnimation(() => {
                    // Recreate the days selection process
                    showDays(container);
                }, container);
            }            
        }



        function showTimesOfDay() {
            const timesContainer = document.createElement('div');
            timesContainer.id = 'times-selection-container';
            timesContainer.classList.add('times-options-container', 'final-choices-container');

        
            const times_of_day = [
                "Morning",
                "Midday",
                "Afternoon",
                "I Don't Mind"
            ];
        
            times_of_day.forEach(time => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('time-option-item', 'final-choice-item');
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.id = `time-${time.toLowerCase().replace("'", "").replace(" ", "-")}`;
                radio.name = 'time-choice';
                radio.value = time;
        
                const label = document.createElement('label');
                label.htmlFor = radio.id;
                label.textContent = time;
        
                optionElement.appendChild(radio);
                optionElement.appendChild(label);
                timesContainer.appendChild(optionElement);
        
                optionElement.addEventListener('click', handleTimeSelection);
            });
        
            // Find a suitable container to append the times options
            let container = document.querySelector('.days-follow-up-message-container') || 
                            document.querySelector('.final-choice-follow-up-container');
            
            if (!container) {
                container = document.createElement('div');
                container.classList.add('final-choice-follow-up-container');
                document.querySelector('.chatbot-container').appendChild(container);
            }
        
            container.appendChild(timesContainer);
            
        }
        
        function handleTimeSelection(event) {
            const clickedItem = event.currentTarget;
            const radio = clickedItem.querySelector('input[type="radio"]');
            const selectedTime = radio.value;
            patientData.preferredTime = selectedTime;
            const timesContainer = document.getElementById('times-selection-container');
            
            // If already selected, do nothing
            if (clickedItem.classList.contains('selected')) {
                return;
            }
        
            timesContainer.classList.add('option-selected');
        
            // Disable all options to prevent further changes
            timesContainer.querySelectorAll('.time-option-item').forEach(item => {
                item.style.pointerEvents = 'none';
                item.style.cursor = 'default';
            });
        
            // Update styles for selected and not selected options
            timesContainer.querySelectorAll('.time-option-item').forEach(item => {
                if (item === clickedItem) {
                    item.classList.add('selected');
                    item.querySelector('input[type="radio"]').checked = true;
                } else {
                    item.classList.add('not-selected');
                }
            });
        
            // Add redo button (if not already present)
            if (!document.querySelector('.redo-button-time')) {
                const redoButton = document.createElement('button');
                redoButton.innerHTML = '↻';
                redoButton.classList.add('redo-button-time');
                redoButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showConfirmationModal(() => {
                        handleTimeRedo();
                    });
                });
        
                timesContainer.appendChild(redoButton);
            }
        
            // Create and append the email follow-up messages
            const emailFollowUpContainer = document.createElement('div');
            emailFollowUpContainer.classList.add('email-follow-up-container');
        
            const emailFollowUpMessages = [
                `What's the best email address for you, ${userName}?`,
                "We take privacy and your data very seriously and do not share it. See our privacy policy"
            ];
        
            showMessagesSequentially(emailFollowUpMessages, emailFollowUpContainer, () => {
                    setTimeout(addEmailInput, 500);
            });
        
            timesContainer.insertAdjacentElement('afterend', emailFollowUpContainer);
        
            
        }

        function handleTimeRedo() {
            const container = document.querySelector('.final-choice-follow-up-container') || 
                              document.querySelector('.days-follow-up-message-container');
            
            patientData.redoTime();

            // Remove enquiry-related elements
            const enquiryOptionsContainer = document.querySelector('.enquiry-options-container');
            if (enquiryOptionsContainer) {
                enquiryOptionsContainer.remove();
            }
            const enquiryMessagesContainer = document.querySelector('.enquiry-messages-container');
            if (enquiryMessagesContainer) {
                enquiryMessagesContainer.remove();
            }
            const enquiryContainer = document.querySelector('.enquiry-container');
            if (enquiryContainer) {
                enquiryContainer.remove();
            }
            const uploadedImageContainer = document.querySelector('.uploaded-image-container');
            if (uploadedImageContainer) {
                uploadedImageContainer.remove();
            }
        
            // Remove final messages container
            const finalMessagesContainer = document.querySelector('.final-messages-container');
            if (finalMessagesContainer) {
                finalMessagesContainer.remove();
            }
            const photoFollowContainer = document.querySelector('.photo-follow-container');
            if (photoFollowContainer) {
                photoFollowContainer.remove();
            }
            if (container) {
                // Remove all time-related elements
                const timeMessage = container.querySelector('.time-message');
                const timesContainer = container.querySelector('#times-selection-container');
                const emailFollowUpContainer = container.querySelector('.email-follow-up-container');


                

                if (timeMessage) timeMessage.remove();
                if (timesContainer) timesContainer.remove();
                if (emailFollowUpContainer) emailFollowUpContainer.remove();
        
                // Remove any subsequent containers
                let nextElement = timesContainer ? timesContainer.nextElementSibling : null;
                while (nextElement) {
                    const elementToRemove = nextElement;
                    nextElement = nextElement.nextElementSibling;
                    elementToRemove.remove();
                }
        
                // Show loading animation
                showLoadingAnimation(() => {
                    // Recreate the time selection process without the message
                    showTimesOfDay(container);
                }, container);
            }            
        }

        function addEmailInput() {
            const emailInputContainer = document.createElement('div');

            emailInputContainer.classList.add('email-input-container');
        
            const emailInput = document.createElement('input');
            emailInput.type = 'email';
            emailInput.placeholder = 'Enter Email';
            emailInput.id = 'user-email-input';
        
            const submitButton = document.createElement('button');
            submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
            submitButton.addEventListener('click', handleEmailSubmission);
        
            emailInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    handleEmailSubmission();
                }
            });
        
            emailInputContainer.appendChild(emailInput);
            emailInputContainer.appendChild(submitButton);
        
            const emailFollowUpContainer = document.querySelector('.email-follow-up-container');
            emailFollowUpContainer.appendChild(emailInputContainer);
        
            
        }

        function handleEmailSubmission() {
            const emailInput = document.getElementById('user-email-input');
            const email_value = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Remove existing alert if present
            const existingAlert = document.querySelector('.email-alert');
            if (existingAlert) {
                existingAlert.remove();
            }
        
            if (!emailRegex.test(email_value)) {
                // Create and show alert
                const alertDiv = document.createElement('div');
                alertDiv.classList.add('email-alert');
                alertDiv.textContent = 'Please provide a valid email address';
                
                const emailInputContainer = document.querySelector('.email-input-container');
                emailInputContainer.insertAdjacentElement('beforebegin', alertDiv);
                
                // Show the alert
    
                alertDiv.style.display = 'block';
                
                // Set a timeout to remove the alert after 10 seconds
                setTimeout(() => {
                    alertDiv.style.opacity = '0';
                    alertDiv.style.transition = 'opacity 0.5s ease';
                    
                    // Remove the alert from the DOM after the fade-out transition
                    setTimeout(() => {
                        alertDiv.remove();
                    }, 500);
                }, 5000);
                
                return;
            }
        
            if (email_value) {
                patientData.patientEmail = email_value;
                email = email_value;
                console.log('email is:', email);
                
                // Remove the email input container
                const emailInputContainer = document.querySelector('.email-input-container');
                emailInputContainer.remove();
        
                // Create a container for the email and redo button
                const emailSubmissionContainer = document.createElement('div');
                emailSubmissionContainer.classList.add('email-submission-container');
        
                // Add redo button
                const redoButton = document.createElement('button');
                redoButton.innerHTML = '↻';
                redoButton.classList.add('redo-button-email');
                redoButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showConfirmationModal(() => {
                        handleEmailRedo();
                    });
                });
                emailSubmissionContainer.appendChild(redoButton);
        
                // Display the submitted email as a user message
                const userEmailMessage = document.createElement('div');
                
                userEmailMessage.classList.add('chatbot-message', 'user','submitted-message');
                userEmailMessage.innerHTML = `
                    <div class="message-content">${email}</div>
                `;
                    emailSubmissionContainer.appendChild(userEmailMessage);
        
                const emailFollowUpContainer = document.querySelector('.email-follow-up-container');
                emailFollowUpContainer.appendChild(emailSubmissionContainer);
        
                // Show the phone number request
                setTimeout(() => showPhoneNumberRequest(), 500);
            }
        }

        function handleEmailRedo() {
            const existingEmailFollowUpContainer = document.querySelector('.email-follow-up-container');
            patientData.resetEmailAndBeyond();

    
            if (existingEmailFollowUpContainer) {
                // Remove the existing container
                existingEmailFollowUpContainer.remove();
            }
            
            // Create a new email follow-up container
            const newEmailFollowUpContainer = document.createElement('div');
            newEmailFollowUpContainer.classList.add('email-follow-up-container');
            
             // Find the appropriate place to insert the new container
            let insertionPoint;
            const timesContainer = document.getElementById('times-selection-container');
            const privacyOptionsContainer = document.querySelector('.privacy-options-container');
            
            if (privacyOptionsContainer) {
                insertionPoint = privacyOptionsContainer;
            } else if (timesContainer) {
                insertionPoint = timesContainer;
            } else {
                console.error('Could not find appropriate insertion point for email follow-up container');
                return;
            }
    
            insertionPoint.insertAdjacentElement('afterend', newEmailFollowUpContainer);

            
            // Remove all content after and including the email-submission-container
            const emailSubmissionContainer = existingEmailFollowUpContainer.querySelector('.email-submission-container');
            let currentElement = emailSubmissionContainer;
            while (currentElement) {
                let nextElement = currentElement.nextElementSibling;
                currentElement.remove();
                currentElement = nextElement;
            }
        
            // Remove the email message
            const emailMessage = existingEmailFollowUpContainer.querySelector('.chatbot-message.bot:last-child');
            if (emailMessage) {
                emailMessage.remove();
            }
        
            const phoneSubmissionContainer = existingEmailFollowUpContainer.querySelector('.phone-submission-container');
            if (phoneSubmissionContainer) {
                phoneSubmissionContainer.remove();
            }
            const dobContainer = existingEmailFollowUpContainer.querySelector('.dob-container');
            if (dobContainer) {
                dobContainer.remove();
            }
            const dobInputContainer = existingEmailFollowUpContainer.querySelector('.dob-input-container');
            if (dobInputContainer) {
                dobInputContainer.remove();
            }


            const existingDobMessage = document.querySelector('.date-of-birth-message');
            if (existingDobMessage) {
                existingDobMessage.remove();
            }
            const existingphone = document.querySelector('.phone-number-message');
            if (existingphone) {
                existingphone.remove();
            }
            const phoneInputContainer = document.querySelector('.phone-input-container')
            if(phoneInputContainer){
                phoneInputContainer.remove();
            }
        
            // Remove photo-related elements
            let photoContainer = document.querySelector('.photo-container');
            if (photoContainer) {
                photoContainer.remove();
            }
        
            // Remove enquiry-related elements
            const enquiryOptionsContainer = document.querySelector('.enquiry-options-container');
            if (enquiryOptionsContainer) {
                enquiryOptionsContainer.remove();
            }
            const enquiryMessagesContainer = document.querySelector('.enquiry-messages-container');
            if (enquiryMessagesContainer) {
                enquiryMessagesContainer.remove();
            }
            const enquiryContainer = document.querySelector('.enquiry-container');
            if (enquiryContainer) {
                enquiryContainer.remove();
            }
            const uploadedImageContainer = document.querySelector('.uploaded-image-container');
            if (uploadedImageContainer) {
                uploadedImageContainer.remove();
            }
        
            // Remove final messages container
            const finalMessagesContainer = document.querySelector('.final-messages-container');
            if (finalMessagesContainer) {
                finalMessagesContainer.remove();
            }
            const photoFollowContainer = document.querySelector('.photo-follow-container');
            if (photoFollowContainer) {
                photoFollowContainer.remove();
            }
        
            // Show the email request messages again with loading animations
            const emailMessages = [
                `What's the best email address for you, ${userName}?`,
                "We take privacy and your data very seriously and do not share it. See our privacy policy"
            ];
        
            function showEmailMessageWithAnimation(index) {
                if (index < emailMessages.length) {
                            showLoadingAnimation(() => {
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('chatbot-message', 'bot');
                        messageElement.innerHTML = `
                            <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                            <div class="message-content"><strong>${emailMessages[index]}</strong></div>
                        `;
                        newEmailFollowUpContainer.appendChild(messageElement);
                        
                        
                        setTimeout(() => showEmailMessageWithAnimation(index + 1), 1000);
                    }, newEmailFollowUpContainer);
                } else {
                    // All messages shown, now display the email input
                            setTimeout(addEmailInput, 500);
                }
            }
        
            // Start showing email messages
            showEmailMessageWithAnimation(0);
        
            // Scroll to the bottom of the chat
            
        }


        function showPhoneNumberRequest() {
            showLoadingAnimation(() => {
                const phoneMessage = document.createElement('div');
                phoneMessage.classList.add('chatbot-message', 'bot', 'phone-number-message');
                phoneMessage.innerHTML = `
                    <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                    <div class="message-content"><strong>and the best number to reach you on?</strong></div>
                `;
        
                const phoneInputContainer = document.createElement('div');
                phoneInputContainer.classList.add('phone-input-container');
        
                const phoneInput = document.createElement('input');
                phoneInput.type = 'tel';
                phoneInput.placeholder = 'Enter Phone Number';
                phoneInput.id = 'user-phone-input';
        
                const submitButton = document.createElement('button');
                submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
                submitButton.addEventListener('click', handlePhoneSubmission);
        
                phoneInput.addEventListener('keypress', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        handlePhoneSubmission();
                    }
                });
        
                phoneInputContainer.appendChild(phoneInput);
                phoneInputContainer.appendChild(submitButton);
        
                const emailFollowUpContainer = document.querySelector('.email-follow-up-container');
                emailFollowUpContainer.appendChild(phoneMessage);
                emailFollowUpContainer.appendChild(phoneInputContainer);
                                
            }, document.querySelector('.email-follow-up-container'));
        }


        function handlePhoneRedo() {
            patientData.resetPhoneAndBeyond();


            const emailFollowUpContainer = document.querySelector('.email-follow-up-container');
        

            const phoneSubmissionContainer = emailFollowUpContainer.querySelector('.phone-submission-container');
            

            let currentElement = phoneSubmissionContainer;
            while (currentElement) {
                let nextElement = currentElement.nextElementSibling;
                currentElement.remove();
                currentElement = nextElement;
            }


            const dobContainer = emailFollowUpContainer.querySelector('.dob-container');
            if (dobContainer) {
                dobContainer.remove();
            }
            const dobInputContainer = emailFollowUpContainer.querySelector('.dob-input-container');
            if (dobInputContainer) {
                dobInputContainer.remove();
            }


            const existingDobMessage = document.querySelector('.date-of-birth-message');
            if (existingDobMessage) {
                existingDobMessage.remove();
            }
            const existingphone = document.querySelector('.phone-number-message');
            if (existingphone) {
                existingphone.remove();
            }
            const phoneInputContainer = document.querySelector('.phone-input-container')
            if(phoneInputContainer){
                phoneInputContainer.remove();
            }
        
            // Remove photo-related elements
            let photoContainer = document.querySelector('.photo-container');
            if (photoContainer) {
                photoContainer.remove();
            }
        
            // Remove enquiry-related elements
            const enquiryOptionsContainer = document.querySelector('.enquiry-options-container');
            if (enquiryOptionsContainer) {
                enquiryOptionsContainer.remove();
            }
            const enquiryMessagesContainer = document.querySelector('.enquiry-messages-container');
            if (enquiryMessagesContainer) {
                enquiryMessagesContainer.remove();
            }
            const enquiryContainer = document.querySelector('.enquiry-container');
            if (enquiryContainer) {
                enquiryContainer.remove();
            }
            const uploadedImageContainer = document.querySelector('.uploaded-image-container');
            if (uploadedImageContainer) {
                uploadedImageContainer.remove();
            }
        
            // Remove final messages container
            const finalMessagesContainer = document.querySelector('.final-messages-container');
            if (finalMessagesContainer) {
                finalMessagesContainer.remove();
            }
            const photoFollowContainer = document.querySelector('.photo-follow-container');
            if (photoFollowContainer) {
                photoFollowContainer.remove();
            }
            // Re-display the phone number request
            showPhoneNumberRequest();
        }

        function handlePhoneSubmission() {
            const phoneInput = document.getElementById('user-phone-input');
            const phoneNumber = phoneInput.value.trim();
            if (phoneNumber) {
                patientData.patientPhoneNo = phoneNumber;
                phone_no = phoneNumber;
                console.log(phone_no);
                
                const phoneInputContainer = document.querySelector('.phone-input-container');
                phoneInputContainer.remove();
        
                const phoneSubmissionContainer = document.createElement('div');
                phoneSubmissionContainer.classList.add('phone-submission-container');
        
                // Create redo button
                const redoButton = document.createElement('button');
                redoButton.innerHTML = '↻';
                redoButton.classList.add('redo-button-phone');
                redoButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showConfirmationModal(() => {
                        handlePhoneRedo();
                    });
                });
        
                const userPhoneMessage = document.createElement('div');
                userPhoneMessage.classList.add('chatbot-message', 'user', 'phone-submission','submitted-message');
                userPhoneMessage.innerHTML = `
                    <div class="message-content">${phoneNumber}</div>
                `;
                
                phoneSubmissionContainer.appendChild(redoButton);
                    phoneSubmissionContainer.appendChild(userPhoneMessage);
        
                const emailFollowUpContainer = document.querySelector('.email-follow-up-container');
                emailFollowUpContainer.appendChild(phoneSubmissionContainer);
        
                // Show the date of birth request
                setTimeout(() => showDateOfBirth(), 500);
            }
        }


        function showDateOfBirth() {
            showLoadingAnimation(() => {
                const dateOfBirth = document.createElement('div');
                dateOfBirth.classList.add('chatbot-message', 'bot', 'date-of-birth-message');
                dateOfBirth.innerHTML = `
                    <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                    <div class="message-content"><strong>What is your date of Birth?</strong></div>
                `;

                const dobInputContainer = document.createElement('div');
                dobInputContainer.classList.add('dob-input-container');

                const dobInput = document.createElement('input');
                dobInput.type = 'date';
                dobInput.placeholder = 'Enter Date of Birth';
                dobInput.id = 'user-dob-input';

                const submitButton = document.createElement('button');
                submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
                submitButton.addEventListener('click', handleDobSubmission);

                dobInput.addEventListener('keypress', function(event) {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                handleDobSubmission();
                            }
                });

                dobInputContainer.appendChild(dobInput);
                dobInputContainer.appendChild(submitButton);

                const emailFollowUpContainer = document.querySelector('.email-follow-up-container');
                emailFollowUpContainer.appendChild(dateOfBirth);
                emailFollowUpContainer.appendChild(dobInputContainer);                
            }, document.querySelector('.email-follow-up-container'));
    }


    function handleDobSubmission() {
        const dobInput = document.getElementById('user-dob-input');
        const dateOfBirth = dobInput.value.trim();
        if (dateOfBirth) {
            dob = dateOfBirth;
            patientData.patientDateOfBirth = dateOfBirth;
            console.log(dob);
            const dobInputContainer = document.querySelector('.dob-input-container');
            dobInputContainer.remove();
    
            const emailFollowUpContainer = document.querySelector('.email-follow-up-container');
            const dobContainer = document.createElement('div');
            dobContainer.classList.add('dob-container');
            emailFollowUpContainer.appendChild(dobContainer);
    
            const redoIcon = document.createElement('span');
            redoIcon.classList.add('redo-icon-dob');
            redoIcon.innerHTML = '↻';
            redoIcon.addEventListener('click', showDobRedoConfirmation);
    
            const userDob = document.createElement('div');
            userDob.classList.add('chatbot-message', 'user','submitted-message');
            userDob.innerHTML = `
                <div class="message-content">${dateOfBirth}</div>
            `;
    
            dobContainer.appendChild(redoIcon);
            dobContainer.appendChild(userDob);
    
            setTimeout(() => showEnquiryRequestMessages(), 500);
        }
    }

    function showDobRedoConfirmation() {
        showConfirmationModal(() => {
            handleDobRedo();
        });
    }
    function handleDobRedo() {
        // Remove all content after and including the dob-container
        const dobContainer = document.querySelector('.dob-container');
        patientData.resetDobAndBeyond();
        let currentElement = dobContainer;
        while (currentElement) {
            let nextElement = currentElement.nextElementSibling;
            currentElement.remove();
            currentElement = nextElement;
        }

        const existingDobMessage = document.querySelector('.date-of-birth-message');
        if (existingDobMessage) {
            existingDobMessage.remove();
        }
    
        // Remove photo-related elements if they exist
        const photoContainer = document.querySelector('.photo-container');
        if (photoContainer) {
            photoContainer.remove();
        }
        const uploadedImageContainer = document.querySelector('.uploaded-image-container');
        if (uploadedImageContainer) {
            uploadedImageContainer.remove();
        }
    
        // Remove enquiry-related elements if they exist
        const enquiryOptionsContainer = document.querySelector('.enquiry-options-container');
        if (enquiryOptionsContainer) {
            enquiryOptionsContainer.remove();
        }
        const enquiryMessagesContainer = document.querySelector('.enquiry-messages-container');
        if (enquiryMessagesContainer) {
            enquiryMessagesContainer.remove();
        }
        const enquiryContainer = document.querySelector('.enquiry-container');
        if (enquiryContainer) {
            enquiryContainer.remove();
        }
    
        // Remove final messages container if it exists
        const finalMessagesContainer = document.querySelector('.final-messages-container');
        if (finalMessagesContainer) {
            finalMessagesContainer.remove();
        }
        const photoFollowContainer = document.querySelector('.photo-follow-container')
            if (photoFollowContainer) {
                photoFollowContainer.remove();
            }
        
        // Re-display the DOB request message and input
        const emailFollowUpContainer = document.querySelector('.email-follow-up-container');
        setTimeout(() => showDateOfBirth(), 500);
    }

    function showPhotoRequestMessages() {
            console.log(patientData);

            const photoContainer = document.createElement('div');
            photoContainer.classList.add('photo-container');
            const emailFollowUpContainer = document.querySelector('.email-follow-up-container');
            emailFollowUpContainer.appendChild(photoContainer);
        
            const messages = [
                "To help us understand your issue or suitability for the treatment...",
                "Would you mind sending a photo of your current smile?"
            ];
        
            function showMessageWithAnimation(index) {

                if (index < messages.length) {
                            showLoadingAnimation(() => {
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('chatbot-message', 'bot');
                        messageElement.innerHTML = `
                            <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                            <div class="message-content"><strong>${messages[index]}</strong></div>
                        `;
                        photoContainer.appendChild(messageElement);
                        
                        if (index === messages.length - 1) {
                            setTimeout(() => showPhotoOptions(photoContainer), 500);
                        } else {
                            setTimeout(() => showMessageWithAnimation(index + 1), 1500);
                        }
                    }, photoContainer);
                }
            }
            // Start showing messages
            showMessageWithAnimation(0);
        }

    function showPhotoOptions(container) {
            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('photo-options-container');
        
            const options = ['Yes Please', 'No Thanks'];
            options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('photo-option-button');
                button.addEventListener('click', () => handlePhotoOption(option, container));
                optionsContainer.appendChild(button);
            });
            container.appendChild(optionsContainer);
        }

    function handlePhotoOption(option, container) {
            const buttons = container.querySelectorAll('.photo-option-button');
            buttons.forEach(button => {
                if (button.textContent === option) {
                    button.classList.add('selected');
                } else {
                    button.classList.add('not-selected');
                }
                button.disabled = true;
            });
        
            // Add redo button
            const redoButton = document.createElement('button');
            redoButton.innerHTML = '↻';
            redoButton.classList.add('redo-button-photos');
            redoButton.addEventListener('click', (e) => {
                e.stopPropagation();
                showConfirmationModal(() => {
                    resetPhotoOptions();
                });
            });
        
            const optionsContainer = container.querySelector('.photo-options-container');
            optionsContainer.insertBefore(redoButton, optionsContainer.lastElementChild);
        
            if (option === 'Yes Please') {
                showYesPhotoOption(container);
            } else {
                showNoPhotoOption();
            }
        }



    function resetPhotoOptions() {
            // Find the email follow-up container
            const emailFollowUpContainer = document.querySelector('.email-follow-up-container');
            patientData.resetPhotoAndEnquiry();

            
            if (emailFollowUpContainer) {
                // Remove enquiry-options-container if it exists
                const enquiryOptionsContainer = emailFollowUpContainer.querySelector('.enquiry-options-container');
                if (enquiryOptionsContainer) {
                    enquiryOptionsContainer.remove();
                }
        
                // Remove uploaded photo container if it exists
                const uploadedImageContainer = emailFollowUpContainer.querySelector('.uploaded-image-container');
                if (uploadedImageContainer) {
                    uploadedImageContainer.remove();
                }
        
                // Find the starting point of the photo request sequence
                let photoStartElement = emailFollowUpContainer.querySelector('.photo-container');
                if (!photoStartElement) {
                    photoStartElement = Array.from(emailFollowUpContainer.children).find(child => 
                        child.textContent.includes('To help us understand your issue or suitability for the treatment')
                    );
                }
        
                // If we found the starting point, remove everything from there onwards
                if (photoStartElement) {
                    let currentElement = photoStartElement;
                    while (currentElement) {
                        let nextElement = currentElement.nextElementSibling;
                        currentElement.remove();
                        currentElement = nextElement;
                    }
                }
        
                // Create a new photo container
                const newPhotoContainer = document.createElement('div');
                newPhotoContainer.classList.add('photo-container');
                emailFollowUpContainer.appendChild(newPhotoContainer);
                
                // Re-display the photo request messages
                showPhotoRequestMessages();
            } else {
                console.error('Email follow-up container not found');
            }
        
            // Remove any final messages container if it exists
            const finalMessagesContainer = document.querySelector('.final-messages-container');
            if (finalMessagesContainer) {
                finalMessagesContainer.remove();
            }

            const photoFollowContainer = document.querySelector('.photo-follow-container')
            if (photoFollowContainer) {
                photoFollowContainer.remove();
            }
        
            // Scroll to the bottom of the chat
            
        }
        

    function showYesPhotoOption(container) {
            const photoFollowContainer = document.createElement('div');
            photoFollowContainer.classList.add('photo-follow-container');
            container.appendChild(photoFollowContainer);
        
            setTimeout(() => {
                    showLoadingAnimation(() => {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('chatbot-message', 'bot');
                    messageElement.innerHTML = `
                        <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                        <div class="message-content"><strong>Please upload your pictures below</strong></div>
                    `;
                    photoFollowContainer.appendChild(messageElement);
                    
                    setTimeout(() => {
                        const uploadButton = document.createElement('button');
                        uploadButton.textContent = 'Upload';
                        uploadButton.classList.add('upload-button');
                        uploadButton.addEventListener('click', () => handleUpload(container));
                        photoFollowContainer.appendChild(uploadButton);
                    }, 500);
                }, photoFollowContainer);
            }, 1000);
        }       

    function showNoPhotoOption() {
            showEnquiryRequestMessages();
        }

    function handleUpload() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.multiple = false; // Change to true if you want to allow multiple uploads
        
            fileInput.click();
        
            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    displayUploadedImage(file);
                }
            });
        }

    function displayUploadedImage(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoFollowContainer = document.querySelector('.photo-follow-container');
                
                // Remove the upload button if it still exists
                const uploadButton = photoFollowContainer.querySelector('.upload-button');
                if (uploadButton) {
                    uploadButton.remove();
                }
                
                // Create image container
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('uploaded-image-container');
                
                // Create image element
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('uploaded-image');

                patientData.patientSubmittedPhoto = e.target.result;
                
                // Create redo button
                const redoButton = document.createElement('button');
                redoButton.innerHTML = '↻';
                redoButton.classList.add('redo-button-image');
                redoButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showConfirmationModal(() => {
                        resetPhotoOptions();
                    });
                });
                
                // Append elements
                    imageContainer.appendChild(img);
                imageContainer.appendChild(redoButton);
                photoFollowContainer.appendChild(imageContainer);
                
                // Show follow-up message
                setTimeout(() => showEnquiryRequestMessages(), 500);
            };
            reader.readAsDataURL(file);
        }

        function showEnquiryRequestMessages() {
            const emailFollowUpContainer = document.querySelector('.email-follow-up-container');
            
            // Create the photo-follow-container
            let photoFollowContainer = document.createElement('div');
            photoFollowContainer.classList.add('photo-follow-container');
            
            // Insert it after the email-follow-up-container
            emailFollowUpContainer.insertAdjacentElement('afterend', photoFollowContainer);
        
            // Now add the content to the photo-follow-container
            showLoadingAnimation(() => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('chatbot-message', 'bot');
                messageElement.innerHTML = `
                    <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                    <div class="message-content"><strong>Would you like to add any more details that can help us with your enquiry?</strong></div>
                `;
                photoFollowContainer.appendChild(messageElement);
                
                setTimeout(() => showEnquiryOptions(), 500);
            }, photoFollowContainer);
        }
        
    function showEnquiryOptions() {
            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('enquiry-options-container');

            const options = ['Yes Please', 'No Thanks'];
            options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('enquiry-option-button');
                button.addEventListener('click', () => handleEnquiryOption(option));
                optionsContainer.appendChild(button);
            });
        
            const photoFollowContainer = document.querySelector('.photo-follow-container');
            photoFollowContainer.appendChild(optionsContainer);
        }
        
    function handleEnquiryOption(option) {
            const buttons = document.querySelectorAll('.enquiry-option-button');
            buttons.forEach(button => {
                if (button.textContent === option) {
                    button.classList.add('selected');
                } else {
                    button.classList.add('not-selected');
                }
                button.disabled = true;
            });
        
            // Add redo button
            const redoButton = document.createElement('button');
            redoButton.innerHTML = '↻';
            redoButton.classList.add('redo-button-enquiry');
            redoButton.addEventListener('click', (e) => {
                e.stopPropagation();
                showConfirmationModal(() => {
                    resetEnquiryOptions();
                });
            });
        
            const optionsContainer = document.querySelector('.enquiry-options-container');
            optionsContainer.insertBefore(redoButton, optionsContainer.lastElementChild);
        
            if (option === 'Yes Please') {
                showEnquiryMessages();
            } else {
                showFinalMessage();
            }
        }
            
        
        function resetEnquiryOptions() {
            const photoFollowContainer = document.querySelector('.photo-follow-container');
            const uploadedImageContainer = photoFollowContainer.querySelector('.uploaded-image-container');

            patientData.resetEnquiry();

        
            // If there's an uploaded image, preserve it
            if (uploadedImageContainer) {
                // Remove all siblings of the uploaded image container
                while (photoFollowContainer.firstChild) {
                    if (photoFollowContainer.firstChild !== uploadedImageContainer) {
                        photoFollowContainer.removeChild(photoFollowContainer.firstChild);
                    } else {
                        break; // Stop when we reach the uploaded image container
                    }
                }
                // Remove all elements after the uploaded image container
                while (uploadedImageContainer.nextSibling) {
                    photoFollowContainer.removeChild(uploadedImageContainer.nextSibling);
                }
            } else {
                // If there's no uploaded image, remove all content
                while (photoFollowContainer.firstChild) {
                    photoFollowContainer.removeChild(photoFollowContainer.firstChild);
                }
            }
        
            // Show the enquiry request message with loading animation
            showLoadingAnimation(() => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('chatbot-message', 'bot');
                messageElement.innerHTML = `
                    <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                    <div class="message-content"><strong>Would you like to add any more details that can help us with your enquiry?</strong></div>
                `;
                photoFollowContainer.appendChild(messageElement);
                
                // Show enquiry options again
                setTimeout(() => showEnquiryOptions(), 1000);
            }, photoFollowContainer);

        }


        function showConfirmationModal(onConfirm, onCancel) {
            const chatbotContainer = document.getElementById('chatbot-container');

            const modalOverlay = document.createElement('div');
            modalOverlay.classList.add('modal-overlay');
        
            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');
            modalContent.innerHTML = `
                <h2>Confirm Re Do ?</h2>
                <p>Are you sure you want to re-do ?<br>Your previous steps will be deleted</p>
                <div class="modal-buttons">
                    <button class="confirm-button">Confirm</button>
                    <button class="cancel-button">Cancel</button>
                </div>
            `;
        
            modalOverlay.appendChild(modalContent);
            chatbotContainer.appendChild(modalOverlay);
        
            // Ensure the modal is visible by scrolling to the bottom
            chatbotContainer.scrollTop = chatbotContainer.scrollHeight;




            const confirmButton = modalContent.querySelector('.confirm-button');
            const cancelButton = modalContent.querySelector('.cancel-button');

            confirmButton.addEventListener('click', () => {
                chatbotContainer.removeChild(modalOverlay);
                onConfirm();
            });

            cancelButton.addEventListener('click', () => {
                chatbotContainer.removeChild(modalOverlay);
                if (onCancel) onCancel();
            });
        

        
        }

    function showEnquiryMessages() {
            const photoFollowContainer = document.querySelector('.photo-follow-container');
        
            const enquiryMessagesContainer = document.createElement('div');
            enquiryMessagesContainer.classList.add('enquiry-messages-container');
            
            const enquiryMessages = [
                "No problem at all 👍",
                "In the box below, please add any information that you'd like to submit with your enquiry"
            ];
        
            photoFollowContainer.appendChild(enquiryMessagesContainer);
        
            function showMessageWithAnimation(index) {
                if (index < enquiryMessages.length) {
        
                    showLoadingAnimation(() => {
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('chatbot-message', 'bot');
                        messageElement.innerHTML = `
                            <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                            <div class="message-content"><strong>${enquiryMessages[index]}</strong></div>
                        `;
                        enquiryMessagesContainer.appendChild(messageElement);
                        
                        // Show next message or text area
                        setTimeout(() => showMessageWithAnimation(index + 1), 1000);
                    }, enquiryMessagesContainer);
                } else {
        
                    // All messages shown, now display the text area
                    setTimeout(() => showEnquiryTextArea(), 500);
                }
            }
            // Start showing messages
            showMessageWithAnimation(0);
        }

        function showEnquiryTextArea() {
            const enquiryMessagesContainer = document.querySelector('.enquiry-messages-container');
            const textAreaContainer = document.createElement('div');
            textAreaContainer.classList.add('enquiry-text-area-container');

            const textArea = document.createElement('textarea');
            textArea.placeholder = 'Enter Text Here';
            textArea.id = 'enquiry-text-area';
            
            const submitButton = document.createElement('button');
            submitButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
            submitButton.addEventListener('click', handleEnquirySubmission);
            
            textAreaContainer.appendChild(textArea);
            textAreaContainer.appendChild(submitButton);
            enquiryMessagesContainer.appendChild(textAreaContainer);
        
            // Auto-resize textarea
            textArea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
        }
        

    function handleEnquirySubmission() {
            const textArea = document.getElementById('enquiry-text-area');
            const enquiryText = textArea.value.trim();
            if (enquiryText) {

                patientData.patientEnquiry = enquiryText;

                // Remove the text area container
                const textAreaContainer = document.querySelector('.enquiry-text-area-container');
                textAreaContainer.remove();
        
                // Create a container for the enquiry and redo button
                const enquiryContainer = document.createElement('div');
                enquiryContainer.classList.add('enquiry-container');
        
                // Add redo button first (it will appear on the left)
                const redoButton = document.createElement('button');
                redoButton.innerHTML = '↻';
                redoButton.classList.add('redo-button-enquiry');
                redoButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showConfirmationModal(() => {
                        resetEnquiryOptions();
                    });
                });
                enquiryContainer.appendChild(redoButton);
        
                // Display the submitted enquiry as a user message
                const userEnquiryMessage = document.createElement('div');
                userEnquiryMessage.classList.add('chatbot-message', 'user','submitted-message');
                userEnquiryMessage.innerHTML = `
                    <div class="message-content">${enquiryText}</div>
                `;
                enquiryContainer.appendChild(userEnquiryMessage);
        
                const photoFollowContainer = document.querySelector('.photo-follow-container');
                photoFollowContainer.appendChild(enquiryContainer);
        
                // Show the final message
                showFinalMessage();
            }
        }

    function showFinalMessage() {

            const finalMessagesContainer = document.createElement('div');
            finalMessagesContainer.classList.add('final-messages-container');
            
            const photoFollowContainer = document.querySelector('.photo-follow-container');
            photoFollowContainer.appendChild(finalMessagesContainer);
        
            const finalMessages = [
                `Thanks for your patience, ${userName}`,
                "I've personally delivered your enquiry",
                "A member of the team will be in touch with you to confirm the date and time for your consultation",
                "Before you go...",
                "A personal thank you from KaaDentals Team",
                "Have a nice day 😃"
            ];
        
            function showMessageWithAnimation(index) {
                if (index < finalMessages.length) {
                            showLoadingAnimation(() => {
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('chatbot-message', 'bot');
                        messageElement.innerHTML = `
                            <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                            <div class="message-content"><strong>${finalMessages[index]}</strong></div>
                        `;
                        finalMessagesContainer.appendChild(messageElement);
                        
                        // Scroll to the bottom of the chat
                        
                        
                        // Show next message
                        setTimeout(() => showMessageWithAnimation(index + 1), 1000);
                    }, finalMessagesContainer);
                } else {
                            // All messages shown, now display the done button
                    showDoneButton(finalMessagesContainer);
                }
            }
            // Start showing messages
            showMessageWithAnimation(0);
        }


        function showFinalChoices(container) {
            const final_choices = ["Book a consultation", "Send an inquiry", "Request a call back"];
            
            const finalChoicesContainer = document.createElement('div');
            finalChoicesContainer.id = 'final-choices-container';
            finalChoicesContainer.classList.add('final-choices-container');

            final_choices.forEach(choice => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('final-choice-item');
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.id = `choice-${choice.toLowerCase().replace(/\s+/g, '-')}`;
                radio.name = 'final-choice';
                radio.value = choice;
        
                const label = document.createElement('label');
                label.htmlFor = radio.id;
                label.textContent = choice;
        
                optionElement.appendChild(radio);
                optionElement.appendChild(label);
                finalChoicesContainer.appendChild(optionElement);
        
                optionElement.addEventListener('click', handleFinalChoiceSelection);
            });
        
            if (container) {
                container.appendChild(finalChoicesContainer);
            } else {
                const afterTreatmentMessagesContainer = document.querySelector('.after-treatment-follow-messages-container');
                if (afterTreatmentMessagesContainer) {
                    afterTreatmentMessagesContainer.appendChild(finalChoicesContainer);
                } else {
                    console.error('No suitable container found for final choices');
                    return;
                }
            }
        
            
        }
        
        function handleFinalChoiceSelection(event) {
            const clickedItem = event.currentTarget;
            const radio = clickedItem.querySelector('input[type="radio"]');
            const selectedChoice = radio.value;
            const finalChoicesContainer = document.getElementById('final-choices-container');
            
            // If already selected, do nothing
            if (clickedItem.classList.contains('selected')) {
                return;
            }
        
            finalChoicesContainer.classList.add('option-selected');
        
            // Update styles for selected and not selected options
            finalChoicesContainer.querySelectorAll('.final-choice-item').forEach(item => {
                if (item === clickedItem) {
                    item.classList.add('selected');
                    item.querySelector('input[type="radio"]').checked = true;
                } else {
                    item.classList.add('not-selected');
                }
            });
        
            // Add redo button (if not already present)
            if (!document.querySelector('.redo-button-final-choice')) {
                const redoButton = document.createElement('button');
                redoButton.innerHTML = '↻';
                redoButton.classList.add('redo-button-final-choice');
                redoButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showConfirmationModal(() => {
                        handleFinalChoiceRedo();
                    });
                });
        
                finalChoicesContainer.appendChild(redoButton);
            }
        
            // Create and append the follow-up content based on the selected choice
            const followUpContainer = document.createElement('div');
            followUpContainer.classList.add('final-choice-follow-up-container');
            finalChoicesContainer.insertAdjacentElement('afterend', followUpContainer);
        
            // Handle different choices
            if (selectedChoice === "Request a call back") {
    
                showLoadingAnimation(() => {
                    const callbackMessage = document.createElement('div');
                    callbackMessage.classList.add('chatbot-message', 'bot');
                    callbackMessage.innerHTML = `
                        <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar" id="rcbfollow">
                        <div class="message-content" id="rcbfollow"><strong>Great! Let's find a suitable time for your callback. What times would be good for you?</strong></div>
                    `;
                    
                    followUpContainer.appendChild(callbackMessage);
                    
        
                    setTimeout(() => {
                        showTimesOfDay();
                        
                    }, 1000);
                }, followUpContainer);
            } else if (selectedChoice === "Book a consultation") {
                setTimeout(() => {
        
                    const messages = [
                        "Excellent, let's get you started",
                        `What days work best for you, ${userName}?`,
                        "Feel free to select multiple options.",
                        "Someone from the team will be in touch to confirm the appointment with you."
                    ];
        
                    function showMessageWithAnimation(index) {
                        if (index < messages.length) {
                            showLoadingAnimation(() => {
                                const messageElement = document.createElement('div');
                                messageElement.classList.add('chatbot-message', 'bot');
                                messageElement.innerHTML = `
                                    <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                                    <div class="message-content"><strong>${messages[index]}</strong></div>
                                `;
                                followUpContainer.appendChild(messageElement);
                                
                                
                                setTimeout(() => showMessageWithAnimation(index + 1), 1000);
                            }, followUpContainer);
                        } else {
                            setTimeout(() => showDays(followUpContainer), 1000);
                        }
                    }
        
                    showMessageWithAnimation(0);
                }, 1000);
            } else if (selectedChoice === "Send an inquiry") {
    
                setTimeout(() => {
                    showInquiryMessages(followUpContainer);
                }, 1000);
            }
        }

        function handleFinalChoiceRedo() {
            // Find the container that holds the final-choices-container
            const parentContainer = document.querySelector('.after-treatment-follow-messages-container') || 
                                    document.querySelector('.name-follow-messages-container') ||
                                    document.querySelector('.final-choice-follow-up-container');
            
            const enquiryOptionsContainer = document.querySelector('.enquiry-options-container');
            if (enquiryOptionsContainer) {
                enquiryOptionsContainer.remove();
            }
            const enquiryMessagesContainer = document.querySelector('.enquiry-messages-container');
            if (enquiryMessagesContainer) {
                enquiryMessagesContainer.remove();
            }
            const enquiryContainer = document.querySelector('.enquiry-container');
            if (enquiryContainer) {
                enquiryContainer.remove();
            }
        
            // Remove final messages container if it exists
            const finalMessagesContainer = document.querySelector('.final-messages-container');
            if (finalMessagesContainer) {
                finalMessagesContainer.remove();
            }
            const photoFollowContainer = document.querySelector('.photo-follow-container')
                if (photoFollowContainer) {
                    photoFollowContainer.remove();
                }
                
            const finalFollowContainer = document.querySelector('.final-choice-follow-up-container')
                if (finalFollowContainer) {
                    finalFollowContainer.remove();
                }
                const containersToRemove = [
                    '.enquiry-options-container',
                    '.enquiry-messages-container',
                    '.enquiry-container',
                    '.final-messages-container',
                    '.photo-follow-container',
                    '.final-choice-follow-up-container',
                    '#final-choices-container',
                    '#days-selection-container',
                    '.days-follow-up-message-container',
                    '#times-selection-container',
                    '.inquiry-messages-container',
                    '.privacy-options-container',
                    '.email-follow-up-container',
                    '.no-agreement-container'
                ];
            
                // Remove specified containers
                containersToRemove.forEach(selector => {
                    const container = document.querySelector(selector);
                    if (container) {
                        container.remove();
                    }
                });

                // Determine the correct parent container for final choices
                let finalChoicesParent;
                if (["Dental Hygiene", "Tooth Extraction", "Composite Bonding", "Replace missing teeth", "Dental checkup"].includes(selectedIntent)) {
                    finalChoicesParent = document.querySelector('.name-follow-messages-container');
                } else {
                    finalChoicesParent = parentContainer;
                }

                // Recreate the final choices
                if (finalChoicesParent) {
                    setTimeout(() => {
                        showLoadingAnimation(() => {
                            showFinalChoices(finalChoicesParent);
                        }, finalChoicesParent);
                    }, 500);
                } else {
                    console.error('No suitable container found for final choices');
                }
            
        }



    function showInquiryMessages(container) {
            const inquiryMessagesContainer = document.createElement('div');
            inquiryMessagesContainer.classList.add('inquiry-messages-container');
            container.appendChild(inquiryMessagesContainer);
        
            const messages = [
                "Before we move ahead, I need to collect a few contact details so that our team can get back to you",
                "We take privacy and your data very seriously and do not share it. We'd like you to agree to our privacy policy"
            ];
        
            function showMessageWithAnimation(index) {
                if (index < messages.length) {
        
                    showLoadingAnimation(() => {
                        const messageElement = document.createElement('div');
                        messageElement.classList.add('chatbot-message', 'bot');
                        messageElement.innerHTML = `
                            <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                            <div class="message-content"><strong>${messages[index]}</strong></div>
                        `;
                        inquiryMessagesContainer.appendChild(messageElement);
                        
                        
                        // Show next message or privacy policy options
                        setTimeout(() => showMessageWithAnimation(index + 1), 1000);
                    }, inquiryMessagesContainer);
                } else {
        
                    // All messages shown, now display the privacy policy options
                    setTimeout(() => showPrivacyPolicyOptions(container), 1000);
                }
            }
        
            // Start showing messages
            showMessageWithAnimation(0);
        }

    function showPrivacyPolicyOptions(container) {
            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('privacy-options-container');
        
            const options = ['Yes, I agree', 'No, I don\'t'];
            options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.classList.add('privacy-option-button');
                button.addEventListener('click', () => handlePrivacyOption(option, container));
                optionsContainer.appendChild(button);
            });

            container.appendChild(optionsContainer);
            
        }

    function resetPrivacyOptions(container) {
            // Remove all content after the initial inquiry messages
            const inquiryMessagesContainer = container.querySelector('.inquiry-messages-container');
            let currentElement = inquiryMessagesContainer.nextElementSibling;
            while (currentElement) {
                const nextElement = currentElement.nextElementSibling;
                currentElement.remove();
                currentElement = nextElement;
            }
        
            // Clear the inquiry messages container
            inquiryMessagesContainer.innerHTML = '';
        
            // Re-display the inquiry messages
            showInquiryMessages(container);
        }
        
    function handlePrivacyOption(option, container) {
            const optionsContainer = container.querySelector('.privacy-options-container');
            const buttons = optionsContainer.querySelectorAll('.privacy-option-button');
            
            buttons.forEach(button => {
                if (button.textContent === option) {
                    button.classList.add('selected');
                } else {
                    button.classList.add('not-selected');
                }
                button.disabled = true;
            });
        
            // Add redo button between options
            const redoButton = document.createElement('button');
            redoButton.innerHTML = '↻';
            redoButton.classList.add('redo-button-privacy');
            redoButton.addEventListener('click', (e) => {
                e.stopPropagation();
                showConfirmationModal(() => {
                    resetPrivacyOptions(container);
                });
            });
        
            // Insert the redo button between the two option buttons
            optionsContainer.insertBefore(redoButton, buttons[1]);
        
            if (option === 'Yes, I agree') {
                // Create a new container for the email follow-up
                const emailFollowUpContainer = document.createElement('div');
                emailFollowUpContainer.classList.add('email-follow-up-container');
        
                // Insert the new container after the privacy options container
                optionsContainer.insertAdjacentElement('afterend', emailFollowUpContainer);
    
                // Show the email request message with loading animation
                showLoadingAnimation(() => {

                    const messageElement = document.createElement('div');
                    messageElement.classList.add('chatbot-message', 'bot');
                    messageElement.innerHTML = `
                        <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                        <div class="message-content"><strong>What's the best email address for you, ${userName}?</strong></div>
                    `;
                    emailFollowUpContainer.appendChild(messageElement);
                    
        
                    // Call addEmailInput after a short delay
                    setTimeout(addEmailInput, 1000);
                }, emailFollowUpContainer);
            } else {
    
                // Show messages when user doesn't agree
                const noAgreementContainer = document.createElement('div');
                noAgreementContainer.classList.add('no-agreement-container');
                container.appendChild(noAgreementContainer);
        
                const messages = [
                    "I understand.",
                    "Unfortunately, we can't proceed without your agreement to our privacy policy.",
                    "Please be rest assured the safety and security of your data is a top priority for us."
                ];
        
                function showMessageWithAnimation(index) {
                    if (index < messages.length) {
                        showLoadingAnimation(() => {
                            const messageElement = document.createElement('div');
                            messageElement.classList.add('chatbot-message', 'bot');
                            messageElement.innerHTML = `
                                <img src="https://cdn.jsdelivr.net/gh/bose9999/dently-bot/images/avatar.jpg" alt="Avatar" class="avatar">
                                <div class="message-content"><strong>${messages[index]}</strong></div>
                            `;
                            noAgreementContainer.appendChild(messageElement);
                            
                            
                            setTimeout(() => showMessageWithAnimation(index + 1), 1000);
                        }, noAgreementContainer);
                    } else {
            
                        // All messages shown, now display the done button
                        showDoneButton(noAgreementContainer);
                    }
                }
        
                showMessageWithAnimation(0);
            }
        }

        function showDoneButton(container) {
            const doneButton = document.createElement('button');
            doneButton.id = 'done-button';
            doneButton.textContent = 'Done';
            doneButton.classList.add('done-button');
            doneButton.addEventListener('click', disableChatbot);
            container.appendChild(doneButton);
            
            doneButton.offsetWidth;
            
            setTimeout(() => {
                doneButton.classList.add('show');
            }, 50);
            console.log(patientData);
        }
        
        function disableChatbot() {
            const doneButton = document.getElementById('done-button');
            doneButton.classList.remove('show');
            doneButton.classList.add('hide');
        
            patientData.dateOfSubmission = new Date().toISOString();
        
            // Send data to server
            sendDataToServer(patientData, () => {
                // This is the callback function that runs after successful data submission
                patientData.reset();
                console.log('Patient data has been reset after submission');
            });
        
            setTimeout(() => {
                chatbotContainer.classList.add('disabled');
                
                // Disable all interactive elements except for scrolling and reset button
                const interactiveElements = chatbotContainer.querySelectorAll('button, input, textarea, select');
                interactiveElements.forEach(element => {
                    if (element.id !== 'reset-button') {
                        element.disabled = true;
                    }
                });
        
                doneButton.remove();
                showResetButton();
            }, 300);
        
            console.log(patientData);
        }
        

        function handleChatbotToggleAfterDisable() {
            if (chatbotContainer.classList.contains('disabled')) {
                chatbotContainer.classList.toggle('hidden');
                toggleChatbotIcon();
            }
        }
    })

    const URL_google = 'https://script.google.com/macros/s/AKfycbxiBg26xWRJYOekhhjq_8dWS6BSQfUk-lKsFUEmkOBi0ziunpptMfR4ZqrftzuUP2Ukgg/exec'  
    
    function sendDataToServer(data, callback) {
        const dataToSend = {
          serviceSelected: data.serviceSelected,
          patientType: data.patientType,
          patientName: data.patientName,
          selectedTreatment: data.selectedTreatment,
          preferredDays: data.preferredDays,
          preferredTime: data.preferredTime,
          patientEmail: data.patientEmail,
          patientPhoneNo: data.patientPhoneNo,
          patientDateOfBirth: data.patientDateOfBirth,
          patientSubmittedPhoto: data.patientSubmittedPhoto,
          patientEnquiry: data.patientEnquiry,
          dateOfSubmission: data.dateOfSubmission,
        //   adviceSelected: data.adviceSelected
        };
      
        fetch(URL_google, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        })
        .then(() => {
          console.log('Data sent successfully');
          if (callback) callback();
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
