// ========================================
// WEATHER FASHION CHATBOT - JavaScript
// ========================================

// Pobranie elementów DOM
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatBox = document.getElementById('chat-box');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

// ========================================
// KROK 1: POBRANIE DANYCH Z INPUTU
// ========================================

function sendMessage() {
    const input = document.getElementById('user-input').value.trim();
    
    // Sprawdzenie czy input nie jest pusty
    if (input === '') {
        return;
    }
    
    // Dodanie wiadomości użytkownika
    addMessage(input, 'user-message');
    
    // Czyszczenie inputu
    userInput.value = '';
    
    // Generowanie odpowiedzi bota
    setTimeout(() => {
        const botResponseText = botResponse(input);
        addMessage(botResponseText, 'bot-message');
        
        // Automatyczne przewinięcie do ostatniej wiadomości
        scrollToBottom();
    }, 500);
}

// ========================================
// KROK 2: DODANIE WIADOMOŚCI DO DOM
// ========================================

function addMessage(message, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;
    
    div.appendChild(messageContent);
    chatBox.appendChild(div);
    
    // Przewinięcie do ostatniej wiadomości
    scrollToBottom();
}

function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ========================================
// KROK 3: ANALIZA WIADOMOŚCI UŻYTKOWNIKA
// ========================================

function botResponse(userInput) {
    const lowerInput = userInput.toLowerCase();
    
    // Analiza temperatury i warunków pogodowych
    const temperatureData = analyzeTemperature(lowerInput);
    const weatherCondition = analyzeWeather(lowerInput);
    
    // Generowanie rekomendacji
    if (temperatureData || weatherCondition) {
        return generateClothingRecommendation(temperatureData, weatherCondition, lowerInput);
    }
    
    // Domyślna odpowiedź
    return handleDefaultResponse(lowerInput);
}

// ========================================
// ANALIZA TEMPERATURY
// ========================================

function analyzeTemperature(input) {
    // Sprawdzenie różnych wariantów temperatury
    if (input.includes('zimno') || input.includes('mróz') || input.includes('-') || input.includes('0') || input.includes('5') || input.includes('10')) {
        return 'zimno';
    }
    
    if (input.includes('chłodno') || input.includes('chłod')) {
        return 'chłodno';
    }
    
    if (input.includes('neutralnie') || input.includes('normalne') || input.includes('15') || input.includes('20')) {
        return 'neutralnie';
    }
    
    if (input.includes('ciepło') || input.includes('ciepłe')) {
        return 'ciepło';
    }
    
    if (input.includes('gorąco') || input.includes('gorące') || input.includes('25') || input.includes('30') || input.includes('35')) {
        return 'gorąco';
    }
    
    return null;
}

// ========================================
// ANALIZA WARUNKÓW POGODOWYCH
// ========================================

function analyzeWeather(input) {
    // Sprawdzenie warunków pogodowych za pomocą switch
    const weatherKeywords = extractWeatherKeywords(input);
    
    if (weatherKeywords.length === 0) {
        return null;
    }
    
    // Zwracanie najważniejszego warunku
    return weatherKeywords[0];
}

function extractWeatherKeywords(input) {
    const keywords = [];
    
    // Deszcz
    if (input.includes('deszcz') || input.includes('pada') || input.includes('mokro') || input.includes('wilgot')) {
        keywords.push('deszcz');
    }
    
    // Śnieg
    if (input.includes('śnieg') || input.includes('śniegu') || input.includes('zaspy')) {
        keywords.push('śnieg');
    }
    
    // Słońce
    if (input.includes('słonce') || input.includes('słoneczn') || input.includes('słonecz')) {
        keywords.push('słońce');
    }
    
    // Wiatr
    if (input.includes('wiatr') || input.includes('wietrzn') || input.includes('wieje')) {
        keywords.push('wiatr');
    }
    
    // Burza
    if (input.includes('burz') || input.includes('piorun') || input.includes('grzmot')) {
        keywords.push('burza');
    }
    
    // Mgła
    if (input.includes('mgł') || input.includes('mgła')) {
        keywords.push('mgła');
    }
    
    return keywords;
}

// ========================================
// GENEROWANIE REKOMENDACJI ODZIEŻY
// ========================================

function generateClothingRecommendation(temperature, weather, originalInput) {
    let recommendation = '👕 Oto moja rekomendacja odzieży:\n\n';
    
    // Rekomendacja na podstawie temperatury
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
    
    // Rekomendacja na podstawie warunków pogodowych
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

// ========================================
// OBSŁUGA DOMYŚLNYCH ODPOWIEDZI
// ========================================

function handleDefaultResponse(input) {
    // Powitanie
    if (input.includes('cześć') || input.includes('hi') || input.includes('hello') || input.includes('hej')) {
        return '👋 Cześć! Jestem Twoim asystentem mody. Powiedz mi o dzisiejszej pogodzie, a ja zasugeruję Ci idealny strój!';
    }
    
    // Dziękowanie
    if (input.includes('dzięki') || input.includes('dziękuję') || input.includes('thank')) {
        return '😊 Chętnie! Jakby potrzebowała Ci jeszcze jakieś porady dotyczącej odzieży, daj mi znać!';
    }
    
    // Pożegnanie
    if (input.includes('do widzenia') || input.includes('bye') || input.includes('do zobaczenia') || input.includes('pa')) {
        return '👋 Do widzenia! Mam nadzieję, że dobrze się ubierzesz. Powodzenia! 🎉';
    }
    
    // Pytania o funkcje
    if (input.includes('co możesz') || input.includes('co potrafisz') || input.includes('pomoc') || input.includes('help')) {
        return '🤖 Mogę Ci pomóc w wyborze odzieży! Opisz mi:\n• Temperaturę powietrza\n• Warunki pogodowe (deszcz, śnieg, słońce)\n• Ewentualnie: wilgotność, wiatr\n\nZasugeruję Ci idealne ubrania! 👕';
    }
    
    // Pytanie o pogodę bez informacji
    if (input.includes('jaka pogoda') || input.includes('jak się ubrać') || input.includes('co włożyć')) {
        return '😊 Aby Ci pomóc, potrzebuję więcej informacji! Powiedz mi:\n• Jaka jest temperatura?\n• Czy pada deszcz/śnieg?\n• Czy jest wietrznie?\n\nDaj mi szczegóły, a będę wiedzieć, co zasugerować! 👕';
    }
    
    // Ogólna odpowiedź
    return '💭 Ciekawe pytanie! Aby Ci lepiej pomóc w wyborze odzieży, opisz mi warunki pogodowe na zewnątrz. Na przykład:\n"Jest 15 stopni, pada deszcz i wieje wiatr"\n\nDzięki temu będę wiedział, co Ci zasugerować! 😊';
}

// ========================================
// FUNKCJE POMOCNICZE
// ========================================

function clearChat() {
    chatBox.innerHTML = '';
    const welcomeMessage = document.createElement('div');
    welcomeMessage.classList.add('welcome-message');
    welcomeMessage.innerHTML = `
        <h3>Witaj ponownie! 👋</h3>
        <p>Czyszczenie rozmowy zakończone. Możemy zacząć od nowa!</p>
    `;
    chatBox.appendChild(welcomeMessage);
}

// Usunięcie wiadomości powitalnej przy pierwszej wiadomości
document.addEventListener('DOMContentLoaded', () => {
    userInput.focus();
});
