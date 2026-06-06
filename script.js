// Weather Chatbot Script

const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messages');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addBotMessage('Hello! 👋 I\'m your Weather Chatbot. Ask me about the weather in any city!');
    
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

function sendMessage() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addUserMessage(message);
    userInput.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const response = generateResponse(message);
        addBotMessage(response);
    }, 500);
}

function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `<div class="message-content">${escapeHtml(message)}</div>`;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.innerHTML = `<div class="message-content">${escapeHtml(message)}</div>`;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple response logic
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return 'Hi there! 😊 How can I help you with the weather today?';
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('weather')) {
        return 'I can help you with weather information! 🌤️ Tell me which city you\'d like to know about.';
    }
    
    if (lowerMessage.includes('rain') || lowerMessage.includes('rainy')) {
        return 'It might rain soon. ☔ Don\'t forget your umbrella!';
    }
    
    if (lowerMessage.includes('sunny') || lowerMessage.includes('sun')) {
        return 'Great weather! ☀️ Perfect day to go outside!';
    }
    
    if (lowerMessage.includes('cold') || lowerMessage.includes('temperature')) {
        return 'Bundle up! 🧥 It\'s cold out there!';
    }
    
    if (lowerMessage.includes('hot') || lowerMessage.includes('warm')) {
        return 'It\'s quite warm! 🌡️ Stay hydrated!';
    }
    
    if (lowerMessage.includes('wind')) {
        return 'It\'s windy! 💨 Hold on to your hat!';
    }
    
    if (lowerMessage.includes('snow')) {
        return 'Looks like snow! ❄️ Bundle up and have fun!';
    }
    
    if (lowerMessage.includes('thank')) {
        return 'You\'re welcome! 😊 Anything else about the weather?';
    }
    
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
        return 'Goodbye! 👋 Have a great day!';
    }
    
    // Default response
    return 'I\'m here to help with weather information! 🌍 Ask me about the weather in your city or use keywords like "rain", "sunny", "cold", "hot", etc.';
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
