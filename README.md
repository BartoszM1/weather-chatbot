Dokumentacja


Bartosz Malczewski
Nr. albumu: 59552

OPIS ZADANIA

Zadanie projektowe — Inteligentny Agent AI na stronę WWW

Temat: Bot doradzający ubiór do pogody (HTML + CSS + JavaScript)

Cel projektu
Celem projektu jest zaprojektowanie nowoczesnego, dynamicznego chatbota webowego, który:
- działa bezpośrednio na stronie internetowej,
- komunikuje się z użytkownikiem przez interfejs czatu,
- analizuje dane wejściowe użytkownika,
- rekomenduje odpowiedni ubiór do pogody,
- posiada nowoczesny frontend z animacjami i responsywnością.

Technologie obowiązkowe

Student musi wykorzystać:
HTML5
CSS3
JavaScript (Vanilla JS)
Responsive Web Design

Dodatkowo (opcjonalnie):
OpenWeather API
LocalStorage
Fetch API
GitHub Pages / Azure Static Web Apps

Funkcjonalności wymagane

Bot powinien:
- przyjmować dane od użytkownika,
- analizować pogodę,
- odpowiadać dynamicznie,
- rekomendować:
- strój,
- dodatki,
- ochronę przed deszczem/zimnem,
- styl ubioru.

Scenariusz działania

Przykład:
Użytkownik wpisuje:
Jest 7 stopni i pada deszcz

Bot odpowiada:
Załóż ciepłą kurtkę przeciwdeszczową oraz wodoodporne buty. Zabierz parasol.

Architektura rozwiązania
Frontend (HTML/CSS)
 ↓
JavaScript Chat Engine
 ↓
Logika warunkowa
 ↓
Analiza danych użytkownika
 ↓
Generowanie odpowiedzi
 ↓
( opcjonalnie )
OpenWeather API

Struktura projektu
/project
│
├── index.html
├── style.css
├── script.js
├── assets/
│ ├── bot.png
│ ├── background.jpg
│
└── README.md

Techniczne kroki wykonania projektu

ETAP 1 — Utworzenie struktury projektu

Krok 1
Założyć folder projektu:
weather-chatbot

Krok 2
Utworzyć pliki:
- index.html
- style.css
- script.js

ETAP 2 — Budowa strony HTML

Krok 1 — Utworzenie layoutu
Student powinien stworzyć:
- nagłówek,
- sekcję główną,
- okno czatu,
- pole wpisywania wiadomości,
- przycisk wysyłania.

Przykładowa struktura HTML
<div class="chat-container">
 <div class="chat-header">
 Weather AI Assistant
 </div>
 <div id="chat-box"></div>
 <div class="chat-input">
 <input type="text" id="user-input">
 <button onclick="sendMessage()">Send</button>
 </div>
</div>

ETAP 3 — Stylowanie CSS

Wymagania UI/UX

Student musi zastosować:
- nowoczesny wygląd,
- responsywność,
- animacje,
- hover effects,
- glassmorphism lub gradienty.

Elementy wymagane w CSS
Responsywność
@media(max-width:768px)
Animacje
transition: 0.3s;
animation: fadeIn 0.5s;
Styl wiadomości
Oddzielne style:
dla użytkownika,
dla bota.
Przykład:
.user-message {
 background: #4CAF50;
}
.bot-message {
 background: #1E1E1E;
}
ETAP 4 — Mechanizm chatbota w JavaScript
Krok 1 — Pobranie danych z inputu
const input = document.getElementById("user-input").value;
Krok 2 — Dodanie wiadomości do DOM
function addMessage(message, sender) {
 const chatBox = document.getElementById("chat-box");
 const div = document.createElement("div");
 div.classList.add(sender);
 div.innerText = message;
 chatBox.appendChild(div);
}
Krok 3 — Analiza wiadomości użytkownika
Student musi użyć:
if/else,
switch,
funkcji,
manipulacji DOM.
Przykład logiki warunkowej
function botResponse(userInput) {
 if(userInput.includes("zimno")) {
 return "Załóż kurtkę zimową.";
 }
 else if(userInput.includes("deszcz")) {
 return "Nie zapomnij o parasolu.";
 }
 else {
 return "Sprawdź aktualną pogodę.";
 }
}
ETAP 5 — Dynamiczny chatbot
Funkcja wysyłania wiadomości
function sendMessage() {
 const input = document.getElementById("user-input");
 const userText = input.value;
 addMessage(userText, "user-message");
 const response = botResponse(userText);
 addMessage(response, "bot-message");
 input.value = "";
}
ETAP 6 — Integracja z API pogodowym (opcjonalnie)
Cel
Bot automatycznie pobiera pogodę dla miasta użytkownika.
API
Przykład:
OpenWeatherMap API
Krok 1 — Rejestracja API Key
Student zakłada konto:
OpenWeather
Krok 2 — Fetch API
fetch(apiURL)
.then(response => response.json())
.then(data => {
 console.log(data);
});
Krok 3 — Odczyt temperatury
const temperature = data.main.temp;
Krok 4 — Dynamiczna rekomendacja
if(temperature < 10) {
 recommendation = "Załóż kurtkę zimową";
}
ETAP 7 — Ulepszenia premium
Student może dodać:
Dark mode
document.body.classList.toggle("dark");
Typing animation
typing...
Scroll automatyczny
chatBox.scrollTop = chatBox.scrollHeight;
LocalStorage
Zapisywanie historii rozmów:
localStorage.setItem()
ETAP 8 — Responsywność
Bot musi działać:
desktop,
tablet,
mobile.
ETAP 9 — Deployment online
Student publikuje projekt:
Opcje:
GitHub Pages
Azure Static Web Apps
Netlify
ETAP 10 — Dokumentacja projektu
Student przygotowuje README.md zawierający:
opis projektu,
technologie,
sposób uruchomienia,
architekturę,
screenshoty,
przykładowe rozmowy.
Kryteria oceny
Kryterium
Punkty
HTML i struktura
15
CSS i UI/UX
20
JavaScript
25
Dynamiczne odpowiedzi
15
Responsywność
10
API pogodowe
10
Kreatywność
5
Wymagania dla oceny bardzo dobrej
Student powinien:
używać modularnego JS,
zadbać o accessibility (WCAG),
zastosować clean code,
używać fetch API,
dodać animacje,
wykonać deployment online.
Możliwe rozszerzenia projektu
Alternatywne tematy
Zamiast pogodowego agenta student może stworzyć:
agenta dietetycznego,
agenta fitness,
agenta cyberbezpieczeństwa,
agenta podróżniczego,
agenta HR,
agenta AI rekomendującego filmy.
Efekt końcowy
Student prezentuje:
działającą stronę,
dynamicznego chatbota,
architekturę rozwiązania,
kod źródłowy,
demo rozmowy,
deployment online.
Bonus dla ambitnych studentów
Dodatkowe punkty za:
integrację z Azure OpenAI,
Copilot Studio,
użycie AI,
historię rozmów,
panel administratora,
Progressive Web App (PWA),
mikroanimacje i nowoczesny design AI assistant.
wszystko musi byc realizowane w github
print screens z github
