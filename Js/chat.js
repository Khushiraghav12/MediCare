// GARUN.ai Medical Chatbot Integration
let messages = [
    {
        id: 1,
        text: "Hello! I'm GARUN.ai, your personal health companion. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
    }
];

let isTyping = false;
let isRecording = false;
let chatHistory = [];

// Medical chatbot backend URL
const CHATBOT_API_URL = 'http://localhost:5001/api/chat';
const HEALTH_CHECK_URL = 'http://localhost:5001/api/health';

document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const messagesContainer = document.getElementById('messagesContainer');
    
    // Send message on button click
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    // Send message on Enter key
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Enable/disable send button based on input
        messageInput.addEventListener('input', function() {
            sendBtn.disabled = !this.value.trim();
        });
    }
    
    // Voice recording toggle
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleRecording);
    }
    
    // Load initial messages
    loadMessages();
    
    // Initialize medical chatbot
    initializeMedicalChatbot();
});

// Initialize medical chatbot backend connection
async function initializeMedicalChatbot() {
    try {
        const response = await fetch(HEALTH_CHECK_URL);
        const data = await response.json();
        console.log('Medical chatbot status:', data);
        
        if (data.ai_enabled) {
            console.log('✅ GARUN.ai Medical Chatbot backend connected successfully!');
            MedTechUtils.showNotification('Medical AI assistant ready!', 'success');
        } else {
            console.log('⚠️ Medical chatbot running in demo mode');
            MedTechUtils.showNotification('Medical chatbot in demo mode - API keys needed', 'warning');
        }
    } catch (error) {
        console.log('❌ Medical chatbot backend not available:', error);
        MedTechUtils.showNotification('Medical chatbot backend not available', 'error');
    }
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || isTyping) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    document.getElementById('sendBtn').disabled = true;
    
    // Show typing indicator
    showTypingIndicator();
    isTyping = true;

    try {
        // Check backend status first
        const backendAvailable = await checkBackendStatus();
        
        if (!backendAvailable) {
            // Fallback to demo mode
            setTimeout(() => {
                hideTypingIndicator();
                addMessage('I\'m GARUN.ai, your AI health assistant. The medical chatbot backend is not currently available. Please ensure the backend server is running on port 5001.', 'bot');
                isTyping = false;
            }, 1500);
            return;
        }

        // Send to medical chatbot API
        const response = await fetch(CHATBOT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();
        
        hideTypingIndicator();
        
        if (data.error) {
            addMessage(`Sorry, I encountered an error: ${data.error}`, 'bot');
        } else {
            addMessage(data.response, 'bot');
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        hideTypingIndicator();
        addMessage('Sorry, I\'m having trouble connecting to my medical knowledge base. Please try again or check if the backend server is running.', 'bot');
    }
    
    isTyping = false;
}

// Check if medical chatbot backend is available
async function checkBackendStatus() {
    try {
        const response = await fetch(HEALTH_CHECK_URL);
        const data = await response.json();
        return data.ai_enabled;
    } catch (error) {
        console.log('Medical chatbot backend not available:', error);
        return false;
    }
}

function sendQuickMessage(message) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = message;
    sendMessage();
}

function addMessage(text, sender) {
    const message = {
        id: Date.now(),
        text: text,
        sender: sender,
        timestamp: new Date(),
        type: 'text'
    };
    
    messages.push(message);
    chatHistory.push({sender, text, timestamp: message.timestamp});
    
    const messagesContainer = document.getElementById('messagesContainer');
    const messageElement = createMessageElement(message);
    messagesContainer.appendChild(messageElement);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender}-message`;
    
    const avatar = message.sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="${avatar}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${message.text}</div>
            <div class="message-time">${MedTechUtils.formatTime(message.timestamp)}</div>
        </div>
    `;
    
    return messageDiv;
}

function showTypingIndicator() {
    if (isTyping) return;
    
    isTyping = true;
    const messagesContainer = document.getElementById('messagesContainer');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
        <div class="typing-text">GARUN.ai is thinking...</div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

// Clear chat history (both frontend and backend)
async function clearChatHistory() {
    try {
        await fetch('http://localhost:5001/api/clear-history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.log('Could not clear backend history:', error);
    }
    
    // Clear frontend history
    messages = [
        {
            id: 1,
            text: "Hello! I'm GARUN.ai, your personal health companion. How can I help you today?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
        }
    ];
    chatHistory = [];
    
    loadMessages();
    MedTechUtils.showNotification('New chat started!', 'success');
}

function toggleRecording() {
    const voiceBtn = document.getElementById('voiceBtn');
    
    if (!isRecording) {
        startRecording();
        voiceBtn.classList.add('recording');
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
    } else {
        stopRecording();
        voiceBtn.classList.remove('recording');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
}

function startRecording() {
    isRecording = true;
    MedTechUtils.showNotification('Voice recording started', 'info');
    
    // Simulate recording
    setTimeout(() => {
        if (isRecording) {
            stopRecording();
        }
    }, 5000);
}

function stopRecording() {
    isRecording = false;
    MedTechUtils.showNotification('Voice recording stopped', 'info');
    
    // Simulate voice-to-text conversion
    setTimeout(() => {
        const simulatedText = "This is a simulated voice-to-text conversion. In the real implementation, this would use Web Speech API.";
        document.getElementById('messageInput').value = simulatedText;
        document.getElementById('sendBtn').disabled = false;
    }, 1000);
}

function loadMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    
    // Clear existing messages
    messagesContainer.innerHTML = '';
    
    // Load all messages
    messages.forEach(message => {
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Chat history functionality
function loadChatHistory() {
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            chatItems.forEach(chatItem => chatItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Load chat history (simulated)
            const chatName = this.querySelector('.chat-item-name').textContent;
            MedTechUtils.showNotification(`Loading ${chatName}...`, 'info');
        });
    });
}

// Initialize chat history
document.addEventListener('DOMContentLoaded', loadChatHistory);

// New chat functionality
document.addEventListener('DOMContentLoaded', function() {
    const newChatBtn = document.querySelector('.new-chat-btn');
    
    if (newChatBtn) {
        newChatBtn.addEventListener('click', function() {
            if (confirm('Start a new chat? Current conversation will be saved.')) {
                clearChatHistory();
            }
        });
    }
});

// Pro upgrade functionality
document.addEventListener('DOMContentLoaded', function() {
    const proBtn = document.querySelector('.pro-btn');
    
    if (proBtn) {
        proBtn.addEventListener('click', function() {
            MedTechUtils.showNotification('Pro upgrade would be implemented here', 'info');
            
            // Simulate pro upgrade
            setTimeout(() => {
                MedTechUtils.showNotification('Welcome to MedTech Pro! Enjoy unlimited AI conversations.', 'success');
            }, 1500);
        });
    }
});