// Инициализация статистики
const hellStats = {
    kills: "---",
    blood: "----",
    gates: "--",
    time: "--:--",
    level: "--",
    souls: "---"
};

// Обновление статистики
function updateStats() {
    document.getElementById('kills').textContent = hellStats.kills;
    document.getElementById('blood').textContent = hellStats.blood;
    document.getElementById('gates').textContent = hellStats.gates;
    document.getElementById('time').textContent = hellStats.time;
    document.getElementById('level').textContent = hellStats.level;
    document.getElementById('souls').textContent = hellStats.souls;
}

// Переключение статистики с анимациями
function setupStatsToggle() {
    const toggleBtn = document.getElementById('statsToggle');
    const statsSection = document.getElementById('statsSection');
    
    if (!toggleBtn || !statsSection) return;
    
    toggleBtn.addEventListener('click', function() {
        const isHidden = !statsSection.classList.contains('show');
        
        if (isHidden) {
            // Показываем статистику
            statsSection.style.display = 'block';
            statsSection.style.overflow = 'hidden';
            
            // Запускаем анимацию появления
            setTimeout(() => {
                statsSection.classList.remove('hiding');
                statsSection.classList.add('show');
                this.classList.add('active');
            }, 10);
            
        } else {
            // Скрываем статистику с анимацией
            statsSection.classList.remove('show');
            statsSection.classList.add('hiding');
            this.classList.remove('active');
            
            // После завершения анимации скрываем элемент
            setTimeout(() => {
                if (!statsSection.classList.contains('show')) {
                    statsSection.style.display = 'none';
                    statsSection.classList.remove('hiding');
                }
            }, 400); // Время должно совпадать с CSS transition
        }
    });
}

// Работающая кнопка Play
function setupPlayButton() {
    const playButton = document.querySelector('.play-button');
    if (!playButton) return;
    
    // Убираем preventDefault для реального перехода
    playButton.addEventListener('click', function(e) {
        // Эффект нажатия
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        // Анимация перехода
        document.body.style.opacity = '0.8';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            // В реальном приложении:
            window.location.href = this.getAttribute('href');
        }, 300);
    });
}

// Пиксельный эффект для текста
function applyPixelText() {
    const elements = document.querySelectorAll('.player-name, .stat-value, .stat-name');
    
    elements.forEach(el => {
        // Добавляем мерцание случайных символов
        if (Math.random() > 0.7) {
            setInterval(() => {
                if (Math.random() > 0.9) {
                    el.style.opacity = '0.8';
                    setTimeout(() => {
                        el.style.opacity = '1';
                    }, 50);
                }
            }, 1000);
        }
    });
}

// Анимация загрузки
function setupLoadingAnimations() {
    // Анимация появления всего меню
    const gameMenu = document.querySelector('.game-menu');
    gameMenu.style.opacity = '0';
    gameMenu.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        gameMenu.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        gameMenu.style.opacity = '1';
        gameMenu.style.transform = 'translateY(0)';
    }, 100);
    
    // Анимация появления кнопки Play
    const playSvg = document.querySelector('.play-svg');
    playSvg.style.opacity = '0';
    playSvg.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        playSvg.style.transition = 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s';
        playSvg.style.opacity = '1';
        playSvg.style.transform = 'scale(1)';
    }, 300);
}

// Адаптация для разных устройств
function adaptToDevice() {
    const isTouchDevice = 'ontouchstart' in window || 
                         navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        document.body.classList.add('touch');
        
        // Увеличиваем тап-зоны для мобильных
        document.querySelectorAll('button, a').forEach(el => {
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
        });
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Обновляем статистику
    updateStats();
    
    // Настраиваем переключение статистики
    setupStatsToggle();
    
    // Настраиваем кнопку Play
    setupPlayButton();
    
    // Анимации загрузки
    setupLoadingAnimations();
    
    // Адаптация
    adaptToDevice();
    
    // Пиксельные эффекты
    applyPixelText();
    
    // Автоматическое открытие статистики на больших экранах
    if (window.innerWidth > 768) {
        const toggleBtn = document.getElementById('statsToggle');
        const statsSection = document.getElementById('statsSection');
        
        if (toggleBtn && statsSection) {
            // Показываем с задержкой для анимации
            setTimeout(() => {
                statsSection.style.display = 'block';
                statsSection.classList.add('show');
                toggleBtn.classList.add('active');
            }, 1000);
        }
    }
    
    // Адаптация SVG при ресайзе
    window.addEventListener('resize', function() {
        const playSvg = document.querySelector('.play-svg');
        const menuCenter = document.querySelector('.menu-center');
        
        if (playSvg && menuCenter) {
            const containerWidth = menuCenter.offsetWidth;
            const containerHeight = menuCenter.offsetHeight;
            const size = Math.min(containerWidth, containerHeight) * 0.7;
            
            playSvg.style.width = `${Math.max(100, size)}px`;
            playSvg.style.height = `${Math.max(100, size)}px`;
        }
    });
});

// Hotkey для переключения статистики (Alt+S)
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 's') {
        const toggleBtn = document.getElementById('statsToggle');
        if (toggleBtn) toggleBtn.click();
    }
    
    // Enter для кнопки Play
    if (e.key === 'Enter' && document.activeElement !== document.querySelector('.toggle-btn')) {
        document.querySelector('.play-button')?.click();
    }
    
    // Escape для скрытия статистики
    if (e.key === 'Escape') {
        const statsSection = document.getElementById('statsSection');
        const toggleBtn = document.getElementById('statsToggle');
        
        if (statsSection && statsSection.classList.contains('show')) {
            toggleBtn.click();
        }
    }
});

// Обработка ошибок
window.addEventListener('error', function(e) {
    console.error('Error:', e);
    
    // Резервный стиль если CSS не загрузился
    if (!document.querySelector('.game-menu').style.backgroundColor) {
        document.body.style.backgroundColor = '#000';
        document.body.style.color = '#f00';
        document.body.style.fontFamily = 'monospace';
    }
});

// Предзагрузка game.html для быстрого перехода
function preloadGamePage() {
    if ('linkPrefetch' in document) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = 'game.html';
        link.as = 'document';
        document.head.appendChild(link);
    }
}

// Запускаем предзагрузку через 2 секунды после загрузки
setTimeout(preloadGamePage, 2000);