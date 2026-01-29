const charactersData = {
    zirko: {
        name: "ЗИРКО",
        type: "⚡ Ближний/Воздушный",
        unlocked: true,
        price: "FREE",
        stats: { defense: 65, attack: 80, speed: 90, magic: 75 }
    },
    toji: {
        name: "TOJI FUSHIGURO",
        type: "🖤 Антагонист/Ассасин",
        unlocked: true,
        price: "PROMO CODE",
        stats: { defense: 85, attack: 95, speed: 90, magic: 10 }
    },
    nevi: {
        name: "НЭВИ",
        type: "🛡️ Ближний боец/Танк",
        unlocked: false,
        price: "12000",
        stats: { defense: 95, attack: 65, speed: 40, magic: 30 }
    },
    eltor: {
        name: "ЭЛТОР",
        type: "🔥 Дальний боец/Маг",
        unlocked: false,
        price: "35000",
        stats: { defense: 45, attack: 85, speed: 60, magic: 90 }
    },
    skaira: {
        name: "СКАЙРА",
        type: "☁️ Дальний/Воздушный",
        unlocked: false,
        price: "580000",
        stats: { defense: 50, attack: 70, speed: 85, magic: 80 }
    },
    feyna: {
        name: "ФЕЙНА",
        type: "🎯 Дальний/Ассасин",
        unlocked: false,
        price: "PROMO CODE",
        stats: { defense: 55, attack: 90, speed: 75, magic: 60 }
    },
    mikasa: {
        name: "МИККАСА",
        type: "❄️ Ближний/Воздушный",
        unlocked: false,
        price: "PROMO CODE",
        stats: { defense: 70, attack: 85, speed: 80, magic: 65 }
    },
    aerion: {
        name: "АЭРИОН",
        type: "🌑 Ассасин/Маг поддержки",
        unlocked: false,
        price: "PROMO CODE",
        stats: { defense: 60, attack: 75, speed: 85, magic: 70 }
    }
};

const gameState = {
    coins: 5000000000,
    gems: 5000000000,
    selectedCharacter: "zirko",
    unlockedCharacters: ["zirko"],
    promoCodes: ["Toji", "FEYNA", "MIKASA", "AERION"]
};

function initCustomizePage() {
    updateCurrency();
    setupCharacterCards();
    setupPromoCode();
    setupBackButton();
    updateSelectedCharacter();

    setTimeout(() => {
        document.body.style.opacity = "1";
    }, 100);
}

function updateCurrency() {
    document.getElementById('coins').textContent =
        gameState.coins.toString().padStart(5, '0');
    document.getElementById('gems').textContent =
        gameState.gems.toString().padStart(3, '0');
}

function setupCharacterCards() {
    document.querySelectorAll('.character-card').forEach(card => {
        const character = card.dataset.character;
        const data = charactersData[character];

        if (!data) return;

        if (gameState.unlockedCharacters.includes(character)) {
            card.classList.add('unlocked');
            card.classList.remove('locked');

            const badge = card.querySelector('.character-badge');
            if (badge) {
                if (data.price === "FREE") {
                    badge.className = "character-badge free";
                    badge.textContent = "FREE";
                } else if (data.price === "PROMO CODE") {
                    badge.className = "character-badge promo";
                    badge.textContent = "PROMO";
                } else {
                    badge.className = "character-badge unlocked";
                    badge.textContent = "UNLOCKED";
                }
            }

            const btn = card.querySelector('button');
            if (btn) {
                btn.className = 'select-btn';
                btn.textContent = character === gameState.selectedCharacter ? 'SELECTED' : 'SELECT';

                btn.onclick = () => selectCharacter(character);
            }
        } else {
            const btn = card.querySelector('button');
            if (btn) {
                btn.onclick = () => attemptPurchase(character);
            }
        }
    });
}

function selectCharacter(character) {
    if (!gameState.unlockedCharacters.includes(character)) return;

    gameState.selectedCharacter = character;
    updateSelectedCharacter();
    setupCharacterCards();

    const card = document.querySelector(`[data-character="${character}"]`);
    if (card) {
        card.style.transform = 'scale(1.05)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);
    }

    localStorage.setItem('selectedCharacter', character);

    console.log(`Selected character: ${charactersData[character].name}`);
}

function updateSelectedCharacter() {
    const character = charactersData[gameState.selectedCharacter];
    if (!character) return;

    document.getElementById('currentCharacter').textContent = character.name;

    const statsElement = document.querySelector('.character-stats');
    if (statsElement) {
        statsElement.innerHTML = `
            <div class="stat">⚡ TYPE: <span>${character.type}</span></div>
            <div class="stat">🛡️ DEFENSE: <span>${character.stats.defense}</span></div>
            <div class="stat">⚔️ ATTACK: <span>${character.stats.attack}</span></div>
            <div class="stat">🏃 SPEED: <span>${character.stats.speed}</span></div>
            <div class="stat">✨ MAGIC: <span>${character.stats.magic}</span></div>
        `;
    }
}

function attemptPurchase(character) {
    const data = charactersData[character];
    if (!data || data.unlocked) return;

    const price = parseInt(data.price.replace(/,/g, ''));

    if (isNaN(price)) {
        showMessage('This character requires a promo code!', 'warning');
        return;
    }

    if (gameState.coins >= price) {
        gameState.coins -= price;
        gameState.unlockedCharacters.push(character);

        updateCurrency();
        setupCharacterCards();
        selectCharacter(character);

        showMessage(`${data.name} unlocked!`, 'success');

        localStorage.setItem('gameState', JSON.stringify(gameState));

    } else {
        showMessage('Not enough coins!', 'error');
    }
}

function setupPromoCode() {
    const input = document.querySelector('.promo-input');
    const button = document.querySelector('.promo-submit');

    if (!input || !button) return;

    button.addEventListener('click', activatePromoCode);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') activatePromoCode();
    });

    document.querySelector('.promo-hint').textContent = `Try code: Toji`;
}

function activatePromoCode() {
    const input = document.querySelector('.promo-input');
    if (!input) return;

    const code = input.value.trim().toUpperCase();

    if (!code) {
        showMessage('Enter a promo code!', 'warning');
        return;
    }

    if (gameState.promoCodes.includes(code)) {
        let unlockedCharacter = '';

        switch (code) {
            case 'TOJI2024':
                unlockedCharacter = 'toji';
                break;
            case 'FEYNA':
                unlockedCharacter = 'feyna';
                break;
            case 'MIKASA':
                unlockedCharacter = 'mikasa';
                break;
            case 'AERION':
                unlockedCharacter = 'aerion';
                break;
            case 'HELLWALKER':
                unlockedCharacter = ['toji', 'feyna', 'mikasa', 'aerion'][
                    Math.floor(Math.random() * 4)
                ];
                break;
        }

        if (unlockedCharacter && !gameState.unlockedCharacters.includes(unlockedCharacter)) {
            gameState.unlockedCharacters.push(unlockedCharacter);
            setupCharacterCards();

            const index = gameState.promoCodes.indexOf(code);
            if (index > -1) {
                gameState.promoCodes.splice(index, 1);
            }

            input.value = '';
            showMessage(`Promo code accepted! Unlocked: ${charactersData[unlockedCharacter].name}`, 'success');

            setTimeout(() => selectCharacter(unlockedCharacter), 500);

            localStorage.setItem('gameState', JSON.stringify(gameState));
        } else {
            showMessage('Character already unlocked!', 'info');
        }
    } else {
        showMessage('Invalid promo code!', 'error');

        input.style.borderColor = '#FF0000';
        setTimeout(() => {
            input.style.borderColor = '#8B0000';
        }, 1000);
    }
}

function setupBackButton() {
    const backLink = document.querySelector('.back-link');
    if (backLink) {
        backLink.addEventListener('click', (e) => {
            e.preventDefault();

            document.body.style.opacity = '0.7';
            document.body.style.transition = 'opacity 0.3s ease';

            setTimeout(() => {
                window.location.href = backLink.getAttribute('href');
            }, 300);
        });
    }
}

function showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 30px;
        background: ${type === 'success' ? '#006400' : type === 'error' ? '#8B0000' : type === 'warning' ? '#8B4513' : '#333'};
        border: 2px solid ${type === 'success' ? '#00FF00' : type === 'error' ? '#FF0000' : type === 'warning' ? '#FFA500' : '#FF4500'};
        color: white;
        font-family: 'Courier New', monospace;
        font-weight: bold;
        z-index: 1000;
        text-align: center;
        min-width: 300px;
        max-width: 90vw;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        animation: messageSlideIn 0.3s ease;
    `;

    document.body.appendChild(message);

    setTimeout(() => {
        message.style.animation = 'messageSlideOut 0.3s ease';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 3000);

    if (!document.querySelector('#messageStyles')) {
        const style = document.createElement('style');
        style.id = 'messageStyles';
        style.textContent = `
            @keyframes messageSlideIn {
                from {
                    transform: translateX(-50%) translateY(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
            @keyframes messageSlideOut {
                from {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(-50%) translateY(-100px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function loadSavedData() {
    const saved = localStorage.getItem('gameState');
    if (saved) {
        try {
            const savedState = JSON.parse(saved);
            Object.assign(gameState, savedState);
        } catch (e) {
            console.log('Error loading saved data:', e);
        }
    }

    const savedCharacter = localStorage.getItem('selectedCharacter');
    if (savedCharacter && charactersData[savedCharacter]) {
        gameState.selectedCharacter = savedCharacter;
    }
}

function setupHotkeys() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const backLink = document.querySelector('.back-link');
            if (backLink) {
                e.preventDefault();
                backLink.click();
            }
        }

        if (e.key >= '1' && e.key <= '8') {
            const index = parseInt(e.key) - 1;
            const cards = document.querySelectorAll('.character-card.unlocked');
            if (cards[index]) {
                const character = cards[index].dataset.character;
                if (character) {
                    selectCharacter(character);
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    initCustomizePage();
    setupHotkeys();
    preloadImages();

    if ('ontouchstart' in window) {
        document.body.classList.add('touch');
    }
});

function preloadImages() {
    const images = [
        'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/2a5de080-6ccd-4f7e-b93f-90c08f66bff3/dg67r73-fa25c01b-ae44-44ee-a1f3-57c2d3564941.png'
    ];

    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

window.addEventListener('error', (e) => {
    console.error('Error:', e);

    if (!document.querySelector('.customize-menu').style.backgroundColor) {
        document.body.style.backgroundColor = '#000';
        document.body.style.color = '#f00';
        document.body.style.fontFamily = 'monospace';
    }
});