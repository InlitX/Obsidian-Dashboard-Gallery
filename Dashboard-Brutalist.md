%% [[Estudios-Dashboard]] %%
%% [[Proyectos-Dashboard]] %%
%% [[Gamificación-Dashboard]] %%
%% [[Gym-Dashboard]] %%
%% [[Dasy]] %%

```dataviewjs
// ============================================
// WEATHER - HOME FINAL
// ============================================

async function getWeather() {
  const savedApiKey = localStorage.getItem('weather-api-key');
  const apiKey = savedApiKey || '293307b09cdbd1639fb8f6f6dd99525c';
  const savedCity = localStorage.getItem('weather-city') || 'barcelona';
  const savedUnits = localStorage.getItem('weather-units') || 'metric';
  const savedLang = localStorage.getItem('weather-lang') || 'es';
  const useApiKey = savedApiKey || apiKey;
  const isFirstTime = !localStorage.getItem('weather-city') && !localStorage.getItem('weather-api-key');
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${savedCity}&units=${savedUnits}&lang=${savedLang}&appid=${useApiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error getting weather');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

function formatTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function renderWeather() {
  const savedCity = localStorage.getItem('weather-city') || 'barcelona';
  const savedUnits = localStorage.getItem('weather-units') || 'metric';
  const savedLang = localStorage.getItem('weather-lang') || 'es';
  const isFirstTime = !localStorage.getItem('weather-city') && !localStorage.getItem('weather-api-key');
  
  let weatherContainer = dv.container.createDiv();
  weatherContainer.className = 'home-final-weather-widget';
  
  // Settings button directly in the widget
  const buttonHtml = `
    <div class="home-final-weather-button-container">
      <button id="weather-settings-btn" class="home-final-weather-button">⚙️ SETTINGS</button>
    </div>
  `;
  
  if (isFirstTime) {
    weatherContainer.innerHTML = buttonHtml + `
      <div class="home-final-weather-setup-container">
        <div class="home-final-weather-setup-icon">🌤️</div>
        <div class="home-final-weather-setup-title">⚙️ CONFIGURE YOUR WEATHER</div>
        <div class="home-final-weather-setup-desc">Touch the settings button to customize your local weather</div>
        <div class="home-final-weather-warning">💡 You can use your own OpenWeatherMap API key for unlimited service</div>
      </div>
    `;
  } else {
    const data = await getWeather();
    if (!data) {
        weatherContainer.innerHTML = buttonHtml + '<div style="padding: 50px; text-align: center; color: white;">Could not get weather information</div>';
        setupWeatherButton();
        return;
    }

    const { main, weather, wind, sys } = data;
    const weatherIcon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    const temperature = Math.round(main.temp);
    const feelsLike = Math.round(main.feels_like);
    const tempMin = Math.round(main.temp_min);
    const tempMax = Math.round(main.temp_max);
    const humidity = main.humidity;
    const windSpeed = Math.round(wind.speed);
    const description = weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1);
    const sunrise = formatTime(sys.sunrise);
    const sunset = formatTime(sys.sunset);

    weatherContainer.innerHTML = buttonHtml + `
      <div class="home-final-weather-title">⛈️ CURRENT WEATHER</div>
      <div class="home-final-weather-main">
        <img src="${weatherIcon}" class="home-final-weather-icon"/>
        <div>
          <div class="home-final-weather-temp">${temperature}°C</div>
          <div class="home-final-weather-desc">${description}</div>
          <div class="home-final-weather-feels">Feels like: ${feelsLike}°</div>
        </div>
      </div>
      <div class="home-final-weather-grid">
        <div class="home-final-weather-grid-item">
          <div class="home-final-weather-grid-label">TEMP</div>
          <div class="home-final-weather-grid-value">${tempMin}° / ${tempMax}°</div>
        </div>
        <div class="home-final-weather-grid-item">
          <div class="home-final-weather-grid-label">HUMIDITY</div>
          <div class="home-final-weather-grid-value">${humidity}%</div>
        </div>
        <div class="home-final-weather-grid-item">
          <div class="home-final-weather-grid-label">WIND</div>
          <div class="home-final-weather-grid-value">${windSpeed} ${savedUnits === 'metric' ? 'm/s' : 'mph'}</div>
        </div>
        <div class="home-final-weather-grid-item">
          <div class="home-final-weather-grid-label">SUN</div>
          <div class="home-final-weather-grid-value">🌅 ${sunrise} | 🌇 ${sunset}</div>
        </div>
      </div>
    `;
  }
  
  setupWeatherButton();
}

function setupWeatherButton() {
    setTimeout(() => {
        const btn = document.getElementById('weather-settings-btn');
        if (btn) {
            // Force interactive styles
            btn.style.cssText += `
                pointer-events: auto !important;
                position: relative !important;
                z-index: 9999 !important;
                cursor: pointer !important;
                user-select: none !important;
            `;
            
            btn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.showWeatherSettingsModal();
            };
            
            btn.onmouseover = function() {
                this.style.background = 'rgba(255,255,255,0.3)';
                this.style.transform = 'scale(1.05)';
            };
            
            btn.onmouseout = function() {
                this.style.background = 'rgba(255,255,255,0.2)';
                this.style.transform = 'scale(1)';
            };
        }
    }, 100);
}

renderWeather();

```

<br>

```dataviewjs
// ============================================
// CLOCK - HOME FINAL
// ============================================

let clockContainer = dv.container.createDiv();
clockContainer.className = 'home-final-clock';
clockContainer.style.cssText = 'position: relative; z-index: 10; margin-bottom: 20px;';

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    const date = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    clockContainer.innerHTML = `
        <div class="home-final-clock-title">⏰ CURRENT TIME</div>
        <div class="home-final-clock-time">${time}</div>
        <div class="home-final-clock-date">${date}</div>
    `;
}

updateClock();
setInterval(updateClock, 1000);

```

<br>

```dataviewjs
// ============================================
// DASHBOARD - HOME FINAL
// ============================================

// Main container
let dashboardContainer = dv.container.createDiv();
dashboardContainer.className = 'home-final-dashboard';

// Title
let title = dashboardContainer.createDiv();
title.className = 'home-final-title';
title.textContent = 'DASHBOARD';

// Create button
let createButton = title.createDiv();
createButton.className = 'home-final-create-button';
createButton.innerHTML = `
    <div class="home-final-button-shine"></div>
    <div class="home-final-button-text">+</div>
`;

// Hover effects
createButton.onmouseover = () => {
    createButton.style.transform = 'rotate(-2deg) scale(1.15) translateY(-2px)';
    createButton.style.boxShadow = '12px 12px 0px #000000';
    const shine = createButton.querySelector('.home-final-button-shine');
    if (shine) shine.style.transform = 'rotate(45deg) translateX(100%)';
};

createButton.onmouseout = () => {
    createButton.style.transform = 'rotate(-2deg) scale(1) translateY(0)';
    createButton.style.boxShadow = '8px 8px 0px #000000';
    const shine = createButton.querySelector('.home-final-button-shine');
    if (shine) shine.style.transform = 'rotate(45deg) translateX(-100%)';
};

// Grid
let grid = dashboardContainer.createDiv();
grid.className = 'home-final-grid';

// Cards
const cards = [
    { name: "PROJECTS", path: "02-Proyectos/Proyectos-Dashboard", icon: "🚀", desc: "Create and innovate", image: "assets/proyectos.jpg", color: "#FF006E" },
    { name: "STUDIES", path: "estudios/Dashboard Estudios", icon: "📚", desc: "Learn and grow", image: "assets/estudio.jpg", color: "#8338EC" },
    { name: "GYM", path: "04-Gym/Gym-Dashboard", icon: "💪", desc: "Train and overcome", image: "assets/gym.jpg", color: "#3A86FF" },
    { name: "LEISURE", path: "05-Ocio/Ocio Dashboard", icon: "🎮", desc: "Enjoy and relax", image: "assets/ocio.png", color: "#06FFB4" }
];

// Global variable for cards
let brutalistCards = [...cards];

function renderMainCards() {
    grid.innerHTML = '';
    brutalistCards.forEach(card => {
        let cardDiv = grid.createDiv();
        cardDiv.className = 'home-final-card';
        
        let vault = app.vault;
        let imagePath = vault.getAbstractFileByPath(card.image);
        let imageUrl = imagePath ? vault.adapter.getResourcePath(card.image) : null;
        
        let imageContent = imageUrl ? 
            `<div class="home-final-card-image" style="background: url('${imageUrl}') center/cover no-repeat;"></div>` :
            `<div class="home-final-card-placeholder" style="background: ${card.color};">${card.icon}</div>`;
        
        cardDiv.innerHTML = `
            ${imageContent}
            <div class="home-final-card-title" style="color: ${card.color};">${card.name}</div>
            <div class="home-final-card-desc">${card.desc}</div>
        `;
        
        cardDiv.onclick = () => app.workspace.openLinkText(card.path, '', false);
        
        // Right click for context menu
        cardDiv.oncontextmenu = (event) => {
            event.preventDefault();
            window.showMainCardContextMenu(event, brutalistCards.indexOf(card));
        };
    });
}

renderMainCards();

// Widgets
let widgetsContainer = dashboardContainer.createDiv();
widgetsContainer.className = 'home-final-widgets-container';

// Spotify widget
let spotifyWidget = widgetsContainer.createDiv();
spotifyWidget.className = 'home-final-spotify-widget';

spotifyWidget.innerHTML = `
    <div class="home-final-spotify-title">🎵 SPOTIFY PLAYER</div>
    <iframe id="spotify-iframe" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0" 
            class="home-final-spotify-iframe"
            frameBorder="0" 
            allowfullscreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
    </iframe>
    <div style="margin-top: 15px; text-align: center;">
        <button onclick="window.showSpotifyPlaylistModal()" class="home-final-spotify-button">🎹 CHANGE PLAYLIST</button>
    </div>
    <div id="spotify-playlist-info" class="home-final-spotify-info">🎧 "Today's Top Hits" - Play and browse the list</div>
`;

// Reddit widget
let redditWidget = widgetsContainer.createDiv();
redditWidget.className = 'home-final-reddit-widget';

redditWidget.innerHTML = `
    <div class="home-final-reddit-title">💎 REDDIT PRODUCTIVITY</div>
    <div class="home-final-reddit-content">
        <div class="home-final-reddit-subtitle">🔥 SUBREDDITS</div>
        <div id="reddit-subs-container" style="color: #FFFFFF; font-size: 0.9rem; line-height: 1.6;"></div>
        <div style="text-align: center; margin-top: 15px;">
            <button onclick="window.showAddSubModal('reddit')" class="home-final-reddit-button">➕ ADD SUBREDDIT</button>
        </div>
    </div>
    <div class="home-final-reddit-info">💎 Reddit - Browse your communities</div>
`;

// Twitter widget
let twitterWidget = widgetsContainer.createDiv();
twitterWidget.className = 'home-final-twitter-widget';

twitterWidget.innerHTML = `
    <div class="home-final-twitter-title">𝕏 TECH TRENDS</div>
    <div class="home-final-twitter-content">
        <div class="home-final-twitter-subtitle">🔥 HASHTAGS</div>
        <div id="twitter-subs-container" style="color: #FFFFFF; font-size: 0.9rem; line-height: 1.6;"></div>
        <div style="text-align: center; margin-top: 15px;">
            <button onclick="window.showAddSubModal('twitter')" class="home-final-twitter-button">➕ ADD HASHTAG</button>
        </div>
    </div>
    <div class="home-final-twitter-info">𝕏 Trends - Follow your topics</div>
`;

// ============================================
// SUBS DATA
// ============================================

let redditSubs = [
    { name: "r/productivity", url: "https://www.reddit.com/r/productivity/", desc: "Productivity systems", posts: "15.2K" },
    { name: "r/GetStudying", url: "https://www.reddit.com/r/GetStudying/", desc: "Study techniques", posts: "89.5K" },
    { name: "r/obsidianmd", url: "https://www.reddit.com/r/ObsidianMD/", desc: "Obsidian community", posts: "24.8K" }
];

let twitterSubs = [
    { name: "#AI", url: "https://x.com/hashtag/AI", desc: "Artificial Intelligence", posts: "145.2K" },
    { name: "#WebDev", url: "https://x.com/hashtag/WebDev", desc: "Web development", posts: "89.7K" },
    { name: "#Productivity", url: "https://x.com/hashtag/Productivity", desc: "Productivity", posts: "67.3K" }
];

let currentEditSub = null;
let currentEditType = null;
let currentEditMainCard = null;

// ============================================
// RENDER SUB CARDS
// ============================================

function renderSubCards() {
    const redditContainer = document.getElementById('reddit-subs-container');
    if (redditContainer) {
        let html = '';
        redditSubs.forEach((sub, index) => {
            html += `
                <div class="home-final-subcard home-final-subcard-reddit" onclick="window.openSub('${sub.url}')" oncontextmenu="event.preventDefault(); window.showSubContextMenu(event, 'reddit', ${index})">
                    <div class="home-final-subcard-name home-final-subcard-name-reddit">${sub.name}</div>
                    <div class="home-final-subcard-desc">${sub.desc}</div>
                    <div class="home-final-subcard-posts">🔥 ${sub.posts} posts</div>
                </div>
            `;
        });
        redditContainer.innerHTML = html;
    }

    const twitterContainer = document.getElementById('twitter-subs-container');
    if (twitterContainer) {
        let html = '';
        twitterSubs.forEach((sub, index) => {
            html += `
                <div class="home-final-subcard home-final-subcard-twitter" onclick="window.openSub('${sub.url}')" oncontextmenu="event.preventDefault(); window.showSubContextMenu(event, 'twitter', ${index})">
                    <div class="home-final-subcard-name home-final-subcard-name-twitter">${sub.name}</div>
                    <div class="home-final-subcard-desc">${sub.desc}</div>
                    <div class="home-final-subcard-posts">🔥 ${sub.posts} posts</div>
                </div>
            `;
        });
        twitterContainer.innerHTML = html;
    }
}

window.openSub = (url) => {
    window.open(url, '_blank');
};

// ============================================
// CREATE CARD MODAL
// ============================================

createButton.onclick = () => {
    const modal = document.createElement('div');
    modal.className = 'home-final-modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) document.body.removeChild(modal); };
    
    const content = document.createElement('div');
    content.className = 'home-final-modal home-final-modal-create';
    content.innerHTML = `
        <div class="home-final-modal-title home-final-modal-title-create">✨ CREATE NEW CARD</div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-create">NAME:</label>
            <input type="text" id="cardName" placeholder="Ex: FINANCE" class="home-final-input" style="border-color: #06FFB4;">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-create">DESCRIPTION:</label>
            <input type="text" id="cardDesc" placeholder="Ex: Manage your money" class="home-final-input" style="border-color: #06FFB4;">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-create">PATH:</label>
            <input type="text" id="cardPath" placeholder="Ex: 06-Finance/Finance-Dashboard" class="home-final-input" style="border-color: #06FFB4;">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-create">ICON:</label>
            <input type="text" id="cardIcon" placeholder="Ex: 💰" maxlength="2" class="home-final-input" style="border-color: #06FFB4;">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-create">COLOR:</label>
            <input type="text" id="cardColor" placeholder="Ex: #FFD700" class="home-final-input" style="border-color: #06FFB4;">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-create">IMAGE (optional):</label>
            <input type="text" id="cardImage" placeholder="Ex: assets/finance.jpg" class="home-final-input" style="border-color: #06FFB4;">
        </div>
        <div class="home-final-modal-buttons">
            <button id="createCardBtn" class="home-final-button-save" style="background: #06FFB4; border: 3px solid #000000; color: #000000;">✨ CREATE CARD</button>
            <button id="cancelCreateBtn" class="home-final-button-cancel">❌ CANCEL</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    document.getElementById('cancelCreateBtn').onclick = () => document.body.removeChild(modal);
    
    document.getElementById('createCardBtn').onclick = () => {
        const name = document.getElementById('cardName').value.toUpperCase();
        const desc = document.getElementById('cardDesc').value;
        const path = document.getElementById('cardPath').value;
        const icon = document.getElementById('cardIcon').value || '📁';
        const color = document.getElementById('cardColor').value || '#06FFB4';
        const image = document.getElementById('cardImage').value;
        
        if (!name || !desc || !path) {
            window.showBrutalistAlert('⚠️ Required fields', 'Please complete name, description and path', '#FF006E');
            return;
        }
        
        const newCard = { name, desc, path, icon, color, image };
        brutalistCards.push(newCard);
        renderMainCards();
        document.body.removeChild(modal);
        window.showBrutalistAlert('✅ Card created', 'The new card has been added successfully', '#06FFB4');
    };
};

// ============================================
// MAIN CARDS CONTEXT MENU
// ============================================

window.showMainCardContextMenu = (event, index) => {
    event.stopPropagation();
    
    const existing = document.querySelector('.main-card-context-menu');
    if (existing) existing.remove();
    
    currentEditMainCard = brutalistCards[index];
    
    const menu = document.createElement('div');
    menu.className = 'main-card-context-menu';
    menu.style.cssText = `
        position: fixed;
        left: ${event.clientX + window.scrollX}px;
        top: ${event.clientY + window.scrollY}px;
        background: #000000;
        border: 3px solid #06FFB4;
        border-radius: 0px;
        box-shadow: 6px 6px 0px #06FFB4;
        z-index: 1001;
        min-width: 150px;
        font-family: 'Space Grotesk', monospace;
    `;
    
    const edit = menu.createEl('div', { text: '✏️ Edit Card' });
    edit.style.cssText = `
        padding: 10px 15px;
        color: #06FFB4;
        cursor: pointer;
        font-weight: 600;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    `;
    edit.onmouseover = () => edit.style.background = 'rgba(6,255,180,0.2)';
    edit.onmouseout = () => edit.style.background = 'transparent';
    edit.onclick = (e) => { e.stopPropagation(); window.editMainCard(); };
    
    const del = menu.createEl('div', { text: '🗑️ Delete Card' });
    del.style.cssText = `
        padding: 10px 15px;
        color: #FF006E;
        cursor: pointer;
        font-weight: 600;
    `;
    del.onmouseover = () => del.style.background = 'rgba(255,0,110,0.2)';
    del.onmouseout = () => del.style.background = 'transparent';
    del.onclick = (e) => { e.stopPropagation(); window.deleteMainCard(); };
    
    document.body.appendChild(menu);
    
    document.addEventListener('click', function close(e) {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', close);
        }
    });
};

// ============================================
// EDIT MAIN CARD
// ============================================

window.editMainCard = () => {
    if (!currentEditMainCard) return;
    
    const modal = document.createElement('div');
    modal.className = 'home-final-modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) document.body.removeChild(modal); };
    
    const content = document.createElement('div');
    content.className = 'home-final-modal home-final-modal-create';
    content.innerHTML = `
        <div class="home-final-modal-title home-final-modal-title-create">✏️ EDIT CARD</div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-create">NAME:</label>
            <input type="text" id="mainCardName" value="${currentEditMainCard.name}" class="home-final-input" style="border-color: #06FFB4;">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-create">DESCRIPTION:</label>
            <input type="text" id="mainCardDesc" value="${currentEditMainCard.desc}" class="home-final-input" style="border-color: #06FFB4;">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-create">PATH:</label>
            <input type="text" id="mainCardPath" value="${currentEditMainCard.path}" class="home-final-input" style="border-color: #06FFB4;">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-create">ICON:</label>
            <input type="text" id="mainCardIcon" value="${currentEditMainCard.icon}" maxlength="2" class="home-final-input" style="border-color: #06FFB4;">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-create">COLOR:</label>
            <input type="text" id="mainCardColor" value="${currentEditMainCard.color}" class="home-final-input" style="border-color: #06FFB4;">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-create">IMAGE (optional):</label>
            <input type="text" id="mainCardImage" value="${currentEditMainCard.image || ''}" class="home-final-input" style="border-color: #06FFB4;">
        </div>
        <div class="home-final-modal-buttons">
            <button id="saveMainCardBtn" class="home-final-button-save" style="background: #06FFB4; border: 3px solid #000000; color: #000000;">💾 SAVE</button>
            <button id="cancelMainCardBtn" class="home-final-button-cancel">❌ CANCEL</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    const existingMenu = document.querySelector('.main-card-context-menu');
    if (existingMenu) existingMenu.remove();
    
    document.getElementById('cancelMainCardBtn').onclick = () => document.body.removeChild(modal);
    
    document.getElementById('saveMainCardBtn').onclick = () => {
        const name = document.getElementById('mainCardName').value.toUpperCase();
        const desc = document.getElementById('mainCardDesc').value;
        const path = document.getElementById('mainCardPath').value;
        const icon = document.getElementById('mainCardIcon').value || '📁';
        const color = document.getElementById('mainCardColor').value || '#06FFB4';
        const image = document.getElementById('mainCardImage').value;
        
        if (!name || !desc || !path) {
            window.showBrutalistAlert('⚠️ Required fields', 'Please complete name, description and path', '#FF006E');
            return;
        }
        
        currentEditMainCard.name = name;
        currentEditMainCard.desc = desc;
        currentEditMainCard.path = path;
        currentEditMainCard.icon = icon;
        currentEditMainCard.color = color;
        currentEditMainCard.image = image;
        
        renderMainCards();
        document.body.removeChild(modal);
        currentEditMainCard = null;
        window.showBrutalistAlert('✅ Card updated', 'Changes have been saved successfully', '#06FFB4');
    };
};

// ============================================
// DELETE MAIN CARD
// ============================================

window.deleteMainCard = () => {
    if (!currentEditMainCard) return;
    
    const index = brutalistCards.indexOf(currentEditMainCard);
    
    if (index > -1) {
        brutalistCards.splice(index, 1);
        renderMainCards();
        
        const existingMenu = document.querySelector('.main-card-context-menu');
        if (existingMenu) existingMenu.remove();
        
        currentEditMainCard = null;
        window.showBrutalistAlert('🗑️ Card deleted', 'The card has been deleted successfully', '#FF006E');
    }
};

// ============================================
// SPOTIFY MODAL
// ============================================

window.showSpotifyPlaylistModal = () => {
    const modal = document.createElement('div');
    modal.className = 'home-final-modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) document.body.removeChild(modal); };
    
    const content = document.createElement('div');
    content.className = 'home-final-modal home-final-modal-spotify';
    content.innerHTML = `
        <div class="home-final-modal-title home-final-modal-title-spotify">🎹 CHANGE SPOTIFY PLAYLIST</div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-spotify">PLAYLIST LINK:</label>
            <input type="text" id="spotifyPlaylistUrl" placeholder="https://open.spotify.com/playlist/..." class="home-final-input home-final-input-spotify">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-spotify">NAME (optional):</label>
            <input type="text" id="spotifyPlaylistName" placeholder="Ex: My Favorites" class="home-final-input home-final-input-spotify">
        </div>
        <div class="home-final-info-box home-final-info-box-spotify">
            <div style="font-weight: 600; margin-bottom: 10px;">📖 How to get the link:</div>
            <div style="font-size: 0.9rem; line-height: 1.4; opacity: 0.9;">1. Open Spotify<br>2. Go to your playlist<br>3. Click "Share" → "Copy link"<br>4. Paste here</div>
        </div>
        <div class="home-final-modal-buttons">
            <button id="saveSpotifyBtn" class="home-final-button-save home-final-button-save-spotify">💾 SAVE</button>
            <button id="cancelSpotifyBtn" class="home-final-button-cancel">❌ CANCEL</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    document.getElementById('cancelSpotifyBtn').onclick = () => document.body.removeChild(modal);
    
    document.getElementById('saveSpotifyBtn').onclick = () => {
        const url = document.getElementById('spotifyPlaylistUrl').value;
        const name = document.getElementById('spotifyPlaylistName').value;
        
        if (!url) {
            window.showBrutalistAlert('⚠️ URL required', 'Please enter the link', '#FF006E');
            return;
        }
        
        let id = '';
        if (url.includes('spotify.com/playlist/')) id = url.split('playlist/')[1].split('?')[0];
        else if (url.includes('/track/')) id = url.split('track/')[1].split('?')[0];
        
        if (!id) {
            window.showBrutalistAlert('❌ Invalid URL', 'The link is not from Spotify', '#FF006E');
            return;
        }
        
        const iframe = document.getElementById('spotify-iframe');
        const info = document.getElementById('spotify-playlist-info');
        
        if (url.includes('/track/')) {
            iframe.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
            info.innerHTML = `🎵 Single song`;
        } else {
            iframe.src = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
            info.innerHTML = `🎧 "${name || 'Your Playlist'}"`;
        }
        
        localStorage.setItem('custom-spotify-playlist', url);
        localStorage.setItem('custom-spotify-name', name || '');
        
        document.body.removeChild(modal);
        window.showBrutalistAlert('✅ Playlist updated', 'Your playlist has been loaded', '#1DB954');
    };
};

// ============================================
// WEATHER MODAL
// ============================================

window.showWeatherSettingsModal = () => {
    const modal = document.createElement('div');
    modal.className = 'home-final-modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) document.body.removeChild(modal); };
    
    const savedCity = localStorage.getItem('weather-city') || 'barcelona';
    const savedUnits = localStorage.getItem('weather-units') || 'metric';
    const savedLang = localStorage.getItem('weather-lang') || 'es';
    const savedApiKey = localStorage.getItem('weather-api-key') || '';
    
    function maskApiKey(key) {
        if (!key || key.length <= 8) return key;
        return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
    }
    
    const content = document.createElement('div');
    content.className = 'home-final-modal home-final-modal-weather';
    content.innerHTML = `
        <div class="home-final-modal-title home-final-modal-title-weather">⚙️ WEATHER SETTINGS</div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-weather">API KEY (optional):</label>
            <input type="text" id="weatherApiKey" value="${maskApiKey(savedApiKey)}" placeholder="Your API key" class="home-final-input home-final-input-weather">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-weather">CITY:</label>
            <input type="text" id="weatherCity" value="${savedCity}" placeholder="Ex: paris" class="home-final-input home-final-input-weather">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-weather">UNITS:</label>
            <div class="home-final-select-wrapper">
                <div class="home-final-select-display">
                    <span id="weatherUnits-text">${savedUnits === 'metric' ? 'Metric (°C, m/s)' : 'Imperial (°F, mph)'}</span>
                    <select id="weatherUnits" class="home-final-select">
                        <option value="metric" ${savedUnits === 'metric' ? 'selected' : ''}>Metric (°C, m/s)</option>
                        <option value="imperial" ${savedUnits === 'imperial' ? 'selected' : ''}>Imperial (°F, mph)</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label home-final-label-weather">LANGUAGE:</label>
            <div class="home-final-select-wrapper">
                <div class="home-final-select-display">
                    <span id="weatherLang-text">${savedLang === 'es' ? 'Spanish' : savedLang === 'en' ? 'English' : savedLang === 'fr' ? 'French' : savedLang === 'de' ? 'German' : savedLang === 'it' ? 'Italian' : 'Portuguese'}</span>
                    <select id="weatherLang" class="home-final-select">
                        <option value="es" ${savedLang === 'es' ? 'selected' : ''}>Spanish</option>
                        <option value="en" ${savedLang === 'en' ? 'selected' : ''}>English</option>
                        <option value="fr" ${savedLang === 'fr' ? 'selected' : ''}>French</option>
                        <option value="de" ${savedLang === 'de' ? 'selected' : ''}>German</option>
                        <option value="it" ${savedLang === 'it' ? 'selected' : ''}>Italian</option>
                        <option value="pt" ${savedLang === 'pt' ? 'selected' : ''}>Portuguese</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="home-final-info-box home-final-info-box-weather">
            <div style="font-weight: 600; margin-bottom: 10px;">📍 Cities:</div>
            <div class="home-final-popular-cities">paris, london, new york, tokyo, berlin</div>
        </div>
        <div class="home-final-modal-buttons">
            <button id="saveWeatherBtn" class="home-final-button-save home-final-button-save-weather">💾 SAVE</button>
            <button id="cancelWeatherBtn" class="home-final-button-cancel">❌ CANCEL</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Sync selects
    const unitsSelect = document.getElementById('weatherUnits');
    const langSelect = document.getElementById('weatherLang');
    
    unitsSelect.onchange = () => document.getElementById('weatherUnits-text').textContent = unitsSelect.options[unitsSelect.selectedIndex].text;
    langSelect.onchange = () => document.getElementById('weatherLang-text').textContent = langSelect.options[langSelect.selectedIndex].text;
    
    document.getElementById('cancelWeatherBtn').onclick = () => document.body.removeChild(modal);
    
    document.getElementById('saveWeatherBtn').onclick = () => {
        const city = document.getElementById('weatherCity').value;
        const units = document.getElementById('weatherUnits').value;
        const lang = document.getElementById('weatherLang').value;
        const apiKeyInput = document.getElementById('weatherApiKey').value;
        
        if (!city) {
            window.showBrutalistAlert('⚠️ City required', 'Please enter a city', '#FF006E');
            return;
        }
        
        let finalApiKey = savedApiKey;
        if (apiKeyInput && !apiKeyInput.includes('*')) {
            finalApiKey = apiKeyInput.trim();
            localStorage.setItem('weather-api-key', finalApiKey);
        } else if (apiKeyInput === '') {
            localStorage.removeItem('weather-api-key');
            finalApiKey = '293307b09cdbd1639fb8f6f6dd99525c';
        }
        
        localStorage.setItem('weather-city', city);
        localStorage.setItem('weather-units', units);
        localStorage.setItem('weather-lang', lang);
        
        location.reload();
        document.body.removeChild(modal);
    };
};

// ============================================
// ADD SUBREDDIT/HASHTAG MODAL
// ============================================

window.showAddSubModal = (type) => {
    const modal = document.createElement('div');
    modal.className = 'home-final-modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) document.body.removeChild(modal); };
    
    const content = document.createElement('div');
    content.className = 'home-final-modal';
    if (type === 'reddit') content.classList.add('home-final-modal-reddit');
    if (type === 'twitter') content.classList.add('home-final-modal-twitter');
    
    content.innerHTML = `
        <div class="home-final-modal-title" style="color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">
            ➕ ADD ${type === 'reddit' ? 'SUBREDDIT' : 'HASHTAG'}
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label" style="color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">NAME:</label>
            <input type="text" id="subName" placeholder="${type === 'reddit' ? 'Ex: r/productivity' : 'Ex: #AI'}" class="home-final-input" style="border-color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label" style="color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">URL:</label>
            <input type="text" id="subUrl" placeholder="${type === 'reddit' ? 'https://www.reddit.com/r/productivity/' : 'https://x.com/hashtag/AI'}" class="home-final-input" style="border-color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label" style="color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">DESCRIPTION:</label>
            <input type="text" id="subDesc" placeholder="Ex: Productivity systems" class="home-final-input" style="border-color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label" style="color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">POSTS:</label>
            <input type="text" id="subPosts" placeholder="Ex: 15.2K" class="home-final-input" style="border-color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">
        </div>
        <div class="home-final-modal-buttons">
            <button id="createSubBtn" style="flex: 1; padding: 15px; background: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'}; border: 3px solid #000000; color: ${type === 'reddit' ? '#FFFFFF' : '#000000'}; font-weight: 700; font-size: 1.1rem; cursor: pointer; font-family: 'Space Grotesk', monospace;">✨ ADD</button>
            <button id="cancelSubBtn" class="home-final-button-cancel">❌ CANCEL</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    document.getElementById('cancelSubBtn').onclick = () => document.body.removeChild(modal);
    
    document.getElementById('createSubBtn').onclick = () => {
        const name = document.getElementById('subName').value;
        const url = document.getElementById('subUrl').value;
        const desc = document.getElementById('subDesc').value;
        const posts = document.getElementById('subPosts').value;
        
        if (!name || !url || !desc) {
            window.showBrutalistAlert('⚠️ Required fields', 'Please complete name, URL and description', '#FF006E');
            return;
        }
        
        const newSub = { name, url, desc, posts };
        
        if (type === 'reddit') {
            redditSubs.push(newSub);
        } else {
            twitterSubs.push(newSub);
        }
        
        renderSubCards();
        document.body.removeChild(modal);
        window.showBrutalistAlert('✅ Added', `The ${type === 'reddit' ? 'subreddit' : 'hashtag'} has been added successfully`, type === 'reddit' ? '#FF4500' : '#1DA1F2');
    };
};

// ============================================
// ALERTS
// ============================================

window.showBrutalistAlert = (title, message, color = '#FF006E') => {
    const existing = document.querySelector('.home-final-alert');
    if (existing) existing.remove();
    
    const alert = document.createElement('div');
    const isSuccess = color === '#06FFB4';
    const isSpotify = color === '#1DB954';
    const isWeather = color === '#3A86FF';
    const isReddit = color === '#FF4500';
    const isTwitter = color === '#1DA1F2';
    
    alert.className = 'home-final-alert';
    if (isSuccess) alert.classList.add('home-final-alert-success');
    if (isSpotify) alert.classList.add('home-final-alert-spotify');
    if (isWeather) alert.classList.add('home-final-alert-weather');
    if (isReddit) alert.classList.add('home-final-alert-reddit');
    if (isTwitter) alert.classList.add('home-final-alert-twitter');
    
    alert.innerHTML = `
        <div class="home-final-alert-title" style="color: ${color};">${title}</div>
        <div class="home-final-alert-message">${message}</div>
        <button class="home-final-alert-button" onclick="this.parentElement.remove()">❌ CERRAR</button>
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => { if (alert.parentElement) alert.remove(); }, 5000);
};

// ============================================
// SUBS CONTEXT MENU
// ============================================

window.showSubContextMenu = (event, type, index) => {
    event.stopPropagation();
    
    const existing = document.querySelector('.home-final-context-menu');
    if (existing) existing.remove();
    
    const subs = type === 'reddit' ? redditSubs : twitterSubs;
    currentEditSub = subs[index];
    currentEditType = type;
    
    const menu = document.createElement('div');
    menu.className = 'home-final-context-menu';
    if (type === 'reddit') menu.classList.add('home-final-context-menu-reddit');
    if (type === 'twitter') menu.classList.add('home-final-context-menu-twitter');
    
        const edit = menu.createEl('div', { text: '✏️ Edit' });
    edit.className = 'home-final-context-option';
    if (type === 'reddit') edit.classList.add('home-final-context-option-reddit');
    if (type === 'twitter') edit.classList.add('home-final-context-option-twitter');
    edit.onmouseover = () => edit.style.background = type === 'reddit' ? 'rgba(255,69,0,0.2)' : 'rgba(29,161,242,0.2)';
    edit.onmouseout = () => edit.style.background = 'transparent';
    edit.onclick = (e) => { e.stopPropagation(); window.editSub(); };
    
    const del = menu.createEl('div', { text: '🗑️ Delete' });
    del.className = 'home-final-context-option';
    del.style.color = '#FF006E';
    del.onmouseover = () => del.style.background = 'rgba(255,0,110,0.2)';
    del.onmouseout = () => del.style.background = 'transparent';
    del.onclick = (e) => { e.stopPropagation(); window.deleteSub(); };
    
    menu.style.left = event.clientX + window.scrollX + 'px';
    menu.style.top = event.clientY + window.scrollY + 'px';
    
    document.body.appendChild(menu);
    
    document.addEventListener('click', function close(e) {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', close);
        }
    });
};

// ============================================
// EDIT SUB
// ============================================

window.editSub = () => {
    if (!currentEditSub) return;
    
    const type = currentEditType;
    const modal = document.createElement('div');
    modal.className = 'home-final-modal-overlay';
    modal.onclick = (e) => { if (e.target === modal) document.body.removeChild(modal); };
    
    const content = document.createElement('div');
    content.className = 'home-final-modal';
    if (type === 'reddit') content.classList.add('home-final-modal-reddit');
    if (type === 'twitter') content.classList.add('home-final-modal-twitter');
    
    content.innerHTML = `
            <div class="home-final-modal-title" style="color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">
                ✏️ EDIT ${type === 'reddit' ? 'SUBREDDIT' : 'HASHTAG'}
            </div>
        <div class="home-final-form-group">
            <label class="home-final-label" style="color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">NOMBRE:</label>
            <input type="text" id="subName" value="${currentEditSub.name}" class="home-final-input" style="border-color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label" style="color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">URL:</label>
            <input type="text" id="subUrl" value="${currentEditSub.url}" class="home-final-input" style="border-color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label" style="color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">DESCRIPCIÓN:</label>
            <input type="text" id="subDesc" value="${currentEditSub.desc}" class="home-final-input" style="border-color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">
        </div>
        <div class="home-final-form-group">
            <label class="home-final-label" style="color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">POSTS:</label>
            <input type="text" id="subPosts" value="${currentEditSub.posts}" class="home-final-input" style="border-color: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'};">
        </div>
        <div class="home-final-modal-buttons">
            <button id="saveSubBtn" style="flex: 1; padding: 15px; background: ${type === 'reddit' ? '#FF4500' : '#1DA1F2'}; border: 3px solid #000000; color: ${type === 'reddit' ? '#FFFFFF' : '#000000'}; font-weight: 700; font-size: 1.1rem; cursor: pointer; font-family: 'Space Grotesk', monospace;">💾 SAVE</button>
            <button id="cancelSubBtn" class="home-final-button-cancel">❌ CANCELAR</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    const existingMenu = document.querySelector('.home-final-context-menu');
    if (existingMenu) existingMenu.remove();
    
    document.getElementById('cancelSubBtn').onclick = () => document.body.removeChild(modal);
    
    document.getElementById('saveSubBtn').onclick = () => {
        const name = document.getElementById('subName').value;
        const url = document.getElementById('subUrl').value;
        const desc = document.getElementById('subDesc').value;
        const posts = document.getElementById('subPosts').value;
        
        if (!name || !url || !desc) {
            window.showBrutalistAlert('⚠️ Required fields', 'Complete name, URL and description', '#FF006E');
            return;
        }
        
        currentEditSub.name = name;
        currentEditSub.url = url;
        currentEditSub.desc = desc;
        currentEditSub.posts = posts;
        
        renderSubCards();
        document.body.removeChild(modal);
        currentEditSub = null;
        currentEditType = null;
    };
};

// ============================================
// DELETE SUB
// ============================================

window.deleteSub = () => {
    if (!currentEditSub) return;
    
    const type = currentEditType;
    const subs = type === 'reddit' ? redditSubs : twitterSubs;
    const index = subs.indexOf(currentEditSub);
    
    if (index > -1) {
        subs.splice(index, 1);
        renderSubCards();
        
        const existingMenu = document.querySelector('.home-final-context-menu');
        if (existingMenu) existingMenu.remove();
        
        currentEditSub = null;
        currentEditType = null;
    }
};

// ============================================
// LOAD SAVED PLAYLIST
// ============================================

function loadCustomSpotifyPlaylist() {
    const url = localStorage.getItem('custom-spotify-playlist');
    const name = localStorage.getItem('custom-spotify-name');
    
    if (url) {
        const iframe = document.getElementById('spotify-iframe');
        const info = document.getElementById('spotify-playlist-info');
        
        if (url.includes('spotify.com/playlist/')) {
            const id = url.split('playlist/')[1].split('?')[0];
            iframe.src = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
            info.innerHTML = `🎧 "${name || 'Your Playlist'}"`;
        } else if (url.includes('/track/')) {
            const id = url.split('track/')[1].split('?')[0];
            iframe.src = `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
            info.innerHTML = `🎵 Canción personalizada`;
        }
    }
}

// ============================================
// INITIALIZE
// ============================================

setTimeout(() => {
    renderSubCards();
    loadCustomSpotifyPlaylist();
}, 100);
```
