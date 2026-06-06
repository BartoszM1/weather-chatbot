const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatBox = document.getElementById('chat-box');
const darkModeBtn = document.getElementById('dark-mode-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const exportHistoryBtn = document.getElementById('export-history-btn');

let isWaitingForResponse = false;
let chatHistory = [];
document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    loadChatHistory(); 
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isWaitingForResponse) {
            sendMessage();
        }
    });
    
    darkModeBtn.addEventListener('click', toggleDarkMode);
    clearHistoryBtn.addEventListener('click', clearChatHistory);
    exportHistoryBtn.addEventListener('click', exportChatHistory);  
    userInput.focus();
});
function initializeDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark');
        updateDarkModeIcon();
    }
}
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeIcon();
}

function updateDarkModeIcon() {
    const isDarkMode = document.body.classList.contains('dark');
    darkModeBtn.innerHTML = `<span class="btn-icon">${isDarkMode ? '☀️' : '🌙'}</span>`;
}
function sendMessage() {
    const input = document.getElementById('user-input');
    const userText = input.value.trim();
    if (userText === '') {
        return;
    }
    if (isWaitingForResponse) {
        return;
    }
    isWaitingForResponse = true;
    sendBtn.disabled = true;
    addMessage(userText, 'user-message');
    input.value = '';
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        
        const response = botResponse(userText);
        addMessage(response, 'bot-message');
        isWaitingForResponse = false;
        sendBtn.disabled = false;
        scrollToBottom();
        input.focus();
        saveChatHistory(userText, response);
    }, 800); // Opóźnienie 800ms
}
function addMessage(message, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.innerHTML = message.replace(/\n/g, '<br>');
    div.appendChild(messageContent);
    chatBox.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
}
function showTypingIndicator() {
    const div = document.createElement('div');
    div.classList.add('message', 'bot-message');
    div.id = 'typing-indicator';
    
    const typingContent = document.createElement('div');
    typingContent.classList.add('message-content', 'typing-indicator');
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.textContent = '●';
        typingContent.appendChild(dot);
    }
    
    div.appendChild(typingContent);
    chatBox.appendChild(div);
    
    scrollToBottom();
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function botResponse(userInput) {
    const lowerInput = userInput.toLowerCase();
    const temperatureData = analyzeTemperature(lowerInput);
    const weatherCondition = analyzeWeather(lowerInput);
    if (temperatureData || weatherCondition) {
        return generateClothingRecommendation(temperatureData, weatherCondition, lowerInput);
    }
    return handleDefaultResponse(lowerInput);
}

function analyzeTemperature(input) {
    if (input.includes('zimno') || input.includes('mróz') || input.includes('-') || 
        input.includes('0°') || input.includes('5°') || input.includes('10°')) {
        return 'zimno';
    }
    if (input.includes('chłodno') || input.includes('chłod')) {
        return 'chłodno';
    }
    if (input.includes('neutralnie') || input.includes('normalne') || 
        input.includes('15°') || input.includes('20°')) {
        return 'neutralnie';
    }
    if (input.includes('ciepło') || input.includes('ciepłe') || input.includes('przyjemnie')) {
        return 'ciepło';
    }
    if (input.includes('gorąco') || input.includes('gorące') || input.includes('upalnie') ||
        input.includes('25°') || input.includes('30°') || input.includes('35°')) {
        return 'gorąco';
    }
    
    return null;
}

function analyzeWeather(input) {
    const weatherKeywords = extractWeatherKeywords(input);
    
    if (weatherKeywords.length === 0) {
        return null;
    }
    return weatherKeywords[0];
}

function extractWeatherKeywords(input) {
    const keywords = [];
    
    if (input.includes('deszcz') || input.includes('pada') || input.includes('mokro') || 
        input.includes('wilgot') || input.includes('deszczowy')) {
        keywords.push('deszcz');
    }
    
    if (input.includes('śnieg') || input.includes('śniegu') || input.includes('zaspy') ||
        input.includes('śnieżny')) {
        keywords.push('śnieg');
    }
    
    if (input.includes('słonce') || input.includes('słoneczn') || input.includes('słonecz') ||
        input.includes('słoneczny')) {
        keywords.push('słońce');
    }
    
    if (input.includes('wiatr') || input.includes('wietrzn') || input.includes('wieje') ||
        input.includes('wietrzny')) {
        keywords.push('wiatr');
    }
    
    if (input.includes('burz') || input.includes('piorun') || input.includes('grzmot') ||
        input.includes('burza')) {
        keywords.push('burza');
    }
    
    if (input.includes('mgł') || input.includes('mgła') || input.includes('mglisty')) {
        keywords.push('mgła');
    }
    
    return keywords;
}

function generateClothingRecommendation(temperature, weather, originalInput) {
    let recommendation = '👕 Oto moja rekomendacja odzieży:\n\n';
    
    switch (temperature) {
        case 'zimno':
            recommendation += '❄️ TEMPERATURA: Bardzo zimno\n';
            recommendation += '• Kurtka zimowa lub parka\n';
            recommendation += '• Ciepłe spodnie (jeansy, legginsy)\n';
            recommendation += '• Sweter lub bluza\n';
            recommendation += '• Czapka, szalik, rękawiczki\n';
            recommendation += '• Ciepłe skarpety i buty zimowe\n\n';
            break;
            
        case 'chłodno':
            recommendation += '🧥 TEMPERATURA: Chłodno\n';
            recommendation += '• Kurtka przejściowa (bomber, windbreaker)\n';
            recommendation += '• Długie spodnie\n';
            recommendation += '• Lekki sweter lub bluza\n';
            recommendation += '• Opcjonalnie: czapka i szalik\n';
            recommendation += '• Buty zamknięte\n\n';
            break;
            
        case 'neutralnie':
            recommendation += '😊 TEMPERATURA: Miła pogoda\n';
            recommendation += '• Zwykłe spodnie lub jeansy\n';
            recommendation += '• Koszulka lub lekka bluza\n';
            recommendation += '• Lekka kurtka na wypadek\n';
            recommendation += '• Buty sportowe lub casualowe\n\n';
            break;
            
        case 'ciepło':
            recommendation += '☀️ TEMPERATURA: Ciepło\n';
            recommendation += '• Krótkie spodnie lub szorty\n';
            recommendation += '• Koszulka lub top\n';
            recommendation += '• Lekki kardigan na wypadek\n';
            recommendation += '• Okulary przeciwsłoneczne\n';
            recommendation += '• Lekkie buty (trampki, sandały)\n\n';
            break;
            
        case 'gorąco':
            recommendation += '🌡️ TEMPERATURA: Bardzo gorąco\n';
            recommendation += '• Krótkie spodenki\n';
            recommendation += '• Koszulka na ramiączkach lub bez rękawów\n';
            recommendation += '• Materiały oddychające\n';
            recommendation += '• Okulary i czapka z daszkiem\n';
            recommendation += '• Sandały lub klapki\n\n';
            break;
            
        default:
            recommendation += '• Normalna, wygodna odzież\n\n';
    }
    
    if (weather) {
        switch (weather) {
            case 'deszcz':
                recommendation += '☔ DODATKI NA DESZCZ:\n';
                recommendation += '• Parasol lub płaszcz przeciwdeszczowy\n';
                recommendation += '• Wodoodporne buty\n';
                recommendation += '• Ciemne kolory (mniej widoczne plamy)\n';
                break;
                
            case 'śnieg':
                recommendation += '❄️ DODATKI NA ŚNIEG:\n';
                recommendation += '• Ciepłe buty z dobrą przyczepnością\n';
                recommendation += '• Grube rękawiczki\n';
                recommendation += '• Czapka i szalik obowiązkowe\n';
                break;
                
            case 'słońce':
                recommendation += '🌞 DODATKI NA SŁOŃCE:\n';
                recommendation += '• Okulary przeciwsłoneczne\n';
                recommendation += '• Czapka z daszkiem\n';
                recommendation += '• Krem z filtrem SPF\n';
                break;
                
            case 'wiatr':
                recommendation += '💨 DODATKI NA WIATR:\n';
                recommendation += '• Szalik lub buff\n';
                recommendation += '• Czapka (aby jej nie uwiało)\n';
                recommendation += '• Ubrania słabiej się poruszają\n';
                break;
                
            case 'burza':
                recommendation += '⚡ DODATKI NA BURZĘ:\n';
                recommendation += '• Płaszcz przeciwdeszczowy\n';
                recommendation += '• Pozostań w domu jeśli to możliwe!\n';
                recommendation += '• Unikaj metalowych przedmiotów\n';
                break;
                
            case 'mgła':
                recommendation += '🌫️ DODATKI NA MGŁĘ:\n';
                recommendation += '• Jasne ubrania - widoczność\n';
                recommendation += '• Odblaskowe elementy\n';
                break;
        }
    }
    
    recommendation += '\n💡 Liczę, że się przydała moja rada! 😊';
    
    return recommendation;
}

function handleDefaultResponse(input) {
    if (input.includes('cześć') || input.includes('hi') || input.includes('hello') || 
        input.includes('hej') || input.includes('witaj')) {
        return '👋 Cześć! Jestem Twoim asystentem mody. Powiedz mi o dzisiejszej pogodzie, a ja zasugeruję Ci idealny strój!';
    }
    
    if (input.includes('dzięki') || input.includes('dziękuję') || input.includes('thank') ||
        input.includes('dzięn') || input.includes('spasibo')) {
        return '😊 Chętnie! Jakby potrzebowała Ci jeszcze jakieś porady dotyczącej odzieży, daj mi znać!';
    }
    
    if (input.includes('do widzenia') || input.includes('bye') || input.includes('do zobaczenia') || 
        input.includes('pa') || input.includes('żegnaj')) {
        return '👋 Do widzenia! Mam nadzieję, że dobrze się ubierzesz. Powodzenia! 🎉';
    }
    
    if (input.includes('co możesz') || input.includes('co potrafisz') || input.includes('pomoc') || 
        input.includes('help') || input.includes('co robisz')) {
        return '🤖 Mogę Ci pomóc w wyborze odzieży! Opisz mi:\n• Temperaturę powietrza\n• Warunki pogodowe (deszcz, śnieg, słońce)\n• Ewentualnie: wilgotność, wiatr\n\nZasugeruję Ci idealne ubrania! 👕';
    }
    
    if (input.includes('jaka pogoda') || input.includes('jak się ubrać') || input.includes('co włożyć') ||
        input.includes('co ubrac')) {
        return '😊 Aby Ci pomóc, potrzebuję więcej informacji! Powiedz mi:\n• Jaka jest temperatura?\n• Czy pada deszcz/śnieg?\n• Czy jest wietrznie?\n\nDaj mi szczegóły, a będę wiedzieć, co zasugerować! 👕';
    }
    
    if (input.includes('pogoda') || input.includes('weather')) {
        return '🌦️ Aby podać Ci rekomendacje, powiedz mi więcej o warunkach:\n• Temperatura w stopniach\n• Czy pada deszcz lub śnieg?\n• Czy jest słonecznie?\n• Czy wieje wiatr?\n\nWaż się swoim opisem! 😊';
    }
    
    return '💭 Ciekawe pytanie! Aby Ci lepiej pomóc w wyborze odzieży, opisz mi warunki pogodowe na zewnątrz. Na przykład:\n"Jest 15 stopni, pada deszcz i wieje wiatr"\n\nDzięki temu będę wiedział, co Ci zasugerować! 😊';
}

function saveChatHistory(userMessage, botResponse) {
    chatHistory.push({
        user: userMessage,
        bot: botResponse,
        timestamp: new Date().toLocaleString('pl-PL')
    });
    
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
        chatHistory = JSON.parse(saved);
    }
}

function clearChatHistory() {
    if (chatHistory.length === 0) {
        alert('Historia rozmów jest pusta!');
        return;
    }
    
    if (confirm('Czy na pewno chcesz usunąć całą historię rozmów?')) {
        chatHistory = [];
        localStorage.removeItem('chatHistory');
        chatBox.innerHTML = '';
        
        const welcomeMessage = document.createElement('div');
        welcomeMessage.classList.add('welcome-message');
        welcomeMessage.innerHTML = `
            <h3>Witaj ponownie! 👋</h3>
            <p>Historia rozmów została wyczyszczona. Możemy zacząć od nowa!</p>
            <p class="hint">💡 Napisz np: "Jest 15 stopni i pada deszcz" lub "Gorąco, 30 stopni, słoneczko"</p>
        `;
        chatBox.appendChild(welcomeMessage);
    }
}

function exportChatHistory() {
    if (chatHistory.length === 0) {
        alert('Brak historii rozmów do eksportu!');
        return;
    }
    
    let csvContent = 'Czas,Pytanie użytkownika,Odpowiedź bota\n';
    chatHistory.forEach(item => {
        const timestamp = item.timestamp;
        const userMsg = `"${item.user.replace(/"/g, '""')}"`;
        const botMsg = `"${item.bot.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
        csvContent += `${timestamp},${userMsg},${botMsg}\n`;
    });
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `chat-history-${new Date().getTime()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert(`Historia rozmów (${ chatHistory.length} wiadomości) została wyeksportowana!`);
}

window.addEventListener('load', () => {
    userInput.focus();
});
