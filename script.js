const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatBox = document.getElementById('chat-box');
const darkModeBtn = document.getElementById('dark-mode-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const exportHistoryBtn = document.getElementById('export-history-btn');

const API_KEY = '90037b458f941500ae305607ac1a392c';

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

async function sendMessage() {
    const input = document.getElementById('user-input');
    const userText = input.value.trim();
    
    if (userText === '' || isWaitingForResponse) {
        return;
    }

    isWaitingForResponse = true;
    sendBtn.disabled = true;
    
    addMessage(userText, 'user-message');
    input.value = '';
    
    showTypingIndicator();

    const response = await getBotResponse(userText);
    
    removeTypingIndicator();
    addMessage(response, 'bot-message');
    
    isWaitingForResponse = false;
    sendBtn.disabled = false;
    scrollToBottom();
    input.focus();
    
    saveChatHistory(userText, response);
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

async function getBotResponse(userInput) {
    const lowerInput = userInput.toLowerCase();

    const defaultReply = handleDefaultResponse(lowerInput);
    if (defaultReply) {
        return defaultReply;
    }

    const hasNumbers = /\d+/.test(userInput);
    const hasWeatherKeywords = lowerInput.includes('stopn') || lowerInput.includes('stopie') || 
                               lowerInput.includes('ciepło') || lowerInput.includes('zimno') || 
                               lowerInput.includes('chłodno') || lowerInput.includes('pada') || 
                               lowerInput.includes('deszcz') || lowerInput.includes('śnieg') || 
                               lowerInput.includes('słońce') || lowerInput.includes('wiatr');

    if (hasNumbers || hasWeatherKeywords) {
        return processLocalWeatherDescription(lowerInput);
    }

    const cityName = userInput.replace(/(pogoda w|pogoda|w|sprawdź|miasto)/gi, '').trim();

    if (cityName.length < 2) {
        return '🤖 Nie do końca zrozumiałem. Możesz opisać mi pogodę słownie (np. *"15 stopni i deszcz"*) lub podać samą nazwę miasta (np. *"Warszawa"*), żebym sprawdził ją w API!';
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=pl`);
        
        if (!response.ok) {
            if (response.status === 401) {
                return '🔑 Twój klucz API jest jeszcze nieaktywny w chmurze OpenWeather. Aktywacja nowego konta trwa zwykle do godziny. W międzyczasie możesz opisywać mi pogodę słownie, np. *"chłodno, 10 stopni i wiatr"*!';
            }
            if (response.status === 404) {
                return `😔 Przykro mi, ale nie znalazłem miasta lub opisu dla "${cityName}". Jeśli to nazwa miasta, upewnij się, że nie ma literówki. Jeśli to opis pogody, dodaj informację o temperaturze (np. "15 stopni").`;
            }
            throw new Error('Problem z API');
        }

        const data = await response.json();
        
        const temp = data.main.temp;
        const weatherDescription = data.weather[0].description;
        const weatherMain = data.weather[0].main.toLowerCase();
        const windSpeed = data.wind.speed * 3.6; // m/s na km/h

        const mappedTemp = mapTemperature(temp);
        const mappedWeather = mapWeatherCondition(weatherMain);

        let finalResponse = `🌍 **Pogoda z API dla miasta: ${data.name}**\n`;
        finalResponse += `🌡️ Temperatura: ${temp.toFixed(1)}°C | ☁️ Stan: ${weatherDescription}\n`;
        finalResponse += `💨 Wiatr: ${windSpeed.toFixed(1)} km/h\n\n`;
        finalResponse += generateClothingRecommendation(mappedTemp, mappedWeather, windSpeed > 22);

        return finalResponse;

    } catch (error) {
        console.error(error);
        return '⚠️ Wystąpił błąd podczas próby pobrania pogody z API. Możesz w tej chwili wpisać opis ręcznie, np.: *"12 stopni, wieje wiatr i pada deszcz"*.';
    }
}

function processLocalWeatherDescription(lowerInput) {
    let detectedTempCategory = 'neutralnie'; // domyślna
    let detectedWeatherCategory = null;
    let isWindy = lowerInput.includes('wiatr') || lowerInput.includes('wieje') || lowerInput.includes('mocno');

    const tempMatch = lowerInput.match(/(-?\d+)\s*(deg|stop|°)/);
    if (tempMatch) {
        const tempValue = parseInt(tempMatch[1]);
        detectedTempCategory = mapTemperature(tempValue);
    } else {
        if (lowerInput.includes('zimno') || lowerInput.includes('mróz') || lowerInput.includes('śnieg')) detectedTempCategory = 'zimno';
        else if (lowerInput.includes('chłodno') || lowerInput.includes('rześko')) detectedTempCategory = 'chłodno';
        else if (lowerInput.includes('ciepło') || lowerInput.includes('ładnie')) detectedTempCategory = 'ciepło';
        else if (lowerInput.includes('gorąco') || lowerInput.includes('upał') || lowerInput.includes('skwar')) detectedTempCategory = 'gorąco';
    }

    if (lowerInput.includes('deszcz') || lowerInput.includes('pada') || lowerInput.includes('ulewa') || lowerInput.includes('mży')) {
        detectedWeatherCategory = 'deszcz';
    } else if (lowerInput.includes('śnieg') || lowerInput.includes('sypie') || lowerInput.includes('zamieć')) {
        detectedWeatherCategory = 'śnieg';
    } else if (lowerInput.includes('słońce') || lowerInput.includes('słonecz') || lowerInput.includes('czyste niebo')) {
        detectedWeatherCategory = 'słońce';
    } else if (lowerInput.includes('burza') || lowerInput.includes('piorun')) {
        detectedWeatherCategory = 'burza';
    } else if (lowerInput.includes('mgła') || lowerInput.includes('pochmurno') || lowerInput.includes('chmury')) {
        detectedWeatherCategory = 'mgła';
    }

    let localHeader = `🤖 **Rozpoznałem Twój opis słowny:**\n`;
    if (tempMatch) {
        localHeader += `🌡️ Temperatura z opisu: ${tempMatch[1]}°C\n\n`;
    } else {
        localHeader += `📊 Dobieram ubiór na podstawie słów kluczowych...\n\n`;
    }

    return localHeader + generateClothingRecommendation(detectedTempCategory, detectedWeatherCategory, isWindy);
}

function mapTemperature(temp) {
    if (temp <= 5) return 'zimno';
    if (temp > 5 && temp <= 12) return 'chłodno';
    if (temp > 12 && temp <= 19) return 'neutralnie';
    if (temp > 19 && temp <= 25) return 'ciepło';
    return 'gorąco';
}

function mapWeatherCondition(mainCondition) {
    if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) return 'deszcz';
    if (mainCondition.includes('snow')) return 'śnieg';
    if (mainCondition.includes('clear')) return 'słońce';
    if (mainCondition.includes('thunderstorm')) return 'burza';
    if (mainCondition.includes('mist') || mainCondition.includes('fog') || mainCondition.includes('clouds')) return 'mgła';
    return null;
}

function generateClothingRecommendation(temperature, weather, isWindy) {
    let recommendation = '👕 **Oto moja rekomendacja odzieży:**\n\n';
    
    switch (temperature) {
        case 'zimno':
            recommendation += '❄️ **WARUNKI: Bardzo zimno**\n';
            recommendation += '• Kurtka zimowa lub puchowa parka\n';
            recommendation += '• Ciepłe spodnie (np. jeansy, grube legginsy)\n';
            recommendation += '• Gruby sweter, golf lub polar\n';
            recommendation += '• Czapka, szalik i rękawiczki\n';
            recommendation += '• Zimowe buty z grubą, izolującą podeszwą\n\n';
            break;
            
        case 'chłodno':
            recommendation += '🧥 **WARUNKI: Chłodno**\n';
            recommendation += '• Kurtka przejściowa (bomberka, softshell, katana)\n';
            recommendation += '• Długie spodnie / klasyczne jeansy\n';
            recommendation += '• Lekki sweter, bluza z kapturem lub longsleeve\n';
            recommendation += '• Zamknięte buty (np. adidasy, sneakersy, botki)\n\n';
            break;
            
        case 'neutralnie':
            recommendation += '😊 **WARUNKI: Miła, umiarkowana pogoda**\n';
            recommendation += '• Klasyczne spodnie, chinosy lub jeansy\n';
            recommendation += '• T-shirt i rozpinana bluza lub lekka katana na wierzch\n';
            recommendation += '• Wygodne buty sportowe lub casualowe\n\n';
            break;
            
        case 'ciepło':
            recommendation += '☀️ **WARUNKI: Ciepło**\n';
            recommendation += '• Krótkie spodenki, szorty, spódnica lub luźne spodnie\n';
            recommendation += '• Koszulka z krótkim rękawem lub top\n';
            recommendation += '• Okulary przeciwsłoneczne\n';
            recommendation += '• Lekkie obuwie (trampki, sandały)\n\n';
            break;
            
        case 'gorąco':
            recommendation += '🌡️ **WARUNKI: Bardzo gorąco (Upał)**\n';
            recommendation += '• Cienkie szorty, przewiewne ubrania (np. len, cienka bawełna)\n';
            recommendation += '• Koszulka bez rękawów / na ramiączkach\n';
            recommendation += '• Nakrycie głowy (czapka z daszkiem lub kapelusz słomkowy)\n';
            recommendation += '• Sandały lub lekkie klapki\n\n';
            break;
    }
    
    if (isWindy && temperature !== 'gorąco') {
        recommendation += '💨 **⚠️ UWAGA NA WIATR:** Wspominasz o wietrze / silnym podmuchu! Zastanów się nad kurtką przeciwwiatrową (windbreaker) lub dobrze dopasowaną bluzą z kapturem.\n\n';
    }
    
    if (weather) {
        switch (weather) {
            case 'deszcz':
                recommendation += '☔ **DODATKI NA DESZCZ:**\n';
                recommendation += '• Parasol lub nieprzemakalny płaszcz z kapturem\n';
                recommendation += '• Impregnowane, wodoodporne obuwie\n';
                recommendation += '• Unikaj długich nogawek dotykających ziemi\n';
                break;
                
            case 'śnieg':
                recommendation += '❄️ **DODATKI NA ŚNIEG:**\n';
                recommendation += '• Buty z wyraźnym bieżnikiem (zabezpieczenie przed poślizgiem)\n';
                recommendation += '• Nieprzemakalne, ciepłe rękawice\n';
                break;
                
            case 'słońce':
                recommendation += '🌞 **DODATKI NA SŁOŃCE:**\n';
                recommendation += '• Okulary z filtrem UV\n';
                recommendation += '• Krem ochronny z filtrem SPF na twarz\n';
                break;
                
            case 'burza':
                recommendation += '⚡ **DODATKI NA BURZĘ:**\n';
                recommendation += '• Kurtka przeciwdeszczowa\n';
                recommendation += '• **Bezpieczeństwo:** Jeśli możesz, przeczekaj najgorsze warunki w budynku!\n';
                break;
                
            case 'mgła':
                recommendation += '🌫️ **DODATKI NA MGŁĘ/CHMURY:**\n';
                recommendation += '• Załóż jasne elementy garderoby lub odblask, aby być dobrze widocznym\n';
                break;
        }
    }
    
    recommendation += '\n💡 Mam nadzieję, że moja rada ułatwi Ci dzisiejszy wybór! 😊';
    return recommendation;
}

function handleDefaultResponse(input) {
    if (input.includes('cześć') || input.includes('hi') || input.includes('hello') || 
        input.includes('hej') || input.includes('witaj')) {
        return '👋 Cześć! Jestem Twoim inteligentnym asystentem mody. Możesz opisać mi pogodę słownie (np. *\"15 stopni i deszcz\"*) lub podać nazwę miasta (np. *\"Gdynia\"*), a sprawdzę aktualne dane w API i dobiorę Ci outfit!';
    }
    
    if (input.includes('dzięki') || input.includes('dziękuję') || input.includes('thank')) {
        return '😊 Cieszę się, że mogłem pomóc! W razie potrzeby kolejnych porad dotyczących odzieży, po prostu opisz pogodę lub wpisz miasto!';
    }
    
    if (input.includes('do widzenia') || input.includes('bye') || input.includes('pa') || input.includes('żegnaj')) {
        return '👋 Do widzenia! Życzę świetnego stylu bez względu na warunki za oknem! 🎉';
    }
    
    if (input.includes('co możesz') || input.includes('co potrafisz') || input.includes('pomoc') || input.includes('co robisz')) {
        return '🤖 Działam dwutorowo! Przeanalizuję Twój słowny opis pogody ALBO połączę się z API OpenWeather dla wskazanego przez Ciebie miasta, aby dobrać idealny zestaw ubrań. 👕';
    }

    return null;
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
            <p class="hint">💡 Napisz np: "15 stopni i deszcz" lub podaj miasto: "Kraków"</p>
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
    
    alert(`Historia rozmów (${chatHistory.length} wiadomości) została wyeksportowana!`);
}

window.addEventListener('load', () => {
    userInput.focus();
});
