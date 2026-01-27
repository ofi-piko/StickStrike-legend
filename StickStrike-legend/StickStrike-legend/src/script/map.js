// ========== КАРТА УРОВНЕЙ ==========
const waveTrack = document.getElementById("waveTrack");
const levelMenu = document.getElementById("levelMenu");

const LEVELS_COUNT = 12;
let WIDTH = window.innerWidth;
const HEIGHT = 350;
const CENTER_Y = 175;
const AMPLITUDE = 90;

let levelsData = JSON.parse(localStorage.getItem("levels"));

if (!levelsData) {
    levelsData = [];
    for (let i = 0; i < LEVELS_COUNT; i++) {
        levelsData.push({
            unlocked: i === 0,    
            completed: false,
            time: null,
            difficulty: "normal"
        });
    }
    localStorage.setItem("levels", JSON.stringify(levelsData));
}

function clearMap() {
    waveTrack.innerHTML = "";
    if (levelMenu) levelMenu.innerHTML = "";
}

function getYPosition(x) {
    return CENTER_Y + Math.sin(x * 0.012) * AMPLITUDE;
}

function updateLevelPositions() {
    const levels = document.querySelectorAll('.level');
    const progressStep = 1 / (LEVELS_COUNT - 1);
    
    levels.forEach((level, index) => {
        const progress = index * progressStep;
        const x = progress * waveTrack.offsetWidth;
        const y = getYPosition(x);
        
        level.style.left = `${x}px`;
        level.style.top = `${y}px`;
    });
}

function renderMap() {
    clearMap();
    WIDTH = waveTrack.offsetWidth || window.innerWidth;

    const mapContainer = document.createElement('div');
    mapContainer.className = 'map-container';
    mapContainer.style.position = 'relative';
    mapContainer.style.width = `${WIDTH}px`;
    mapContainer.style.height = `${HEIGHT}px`;

    let path = "";
    for (let x = 0; x <= WIDTH; x += 20) {
        const y = getYPosition(x);
        path += x === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", WIDTH);
    svg.setAttribute("height", HEIGHT);
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";

    const wavePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    wavePath.setAttribute("d", path);
    wavePath.setAttribute("stroke", "#b00000");
    wavePath.setAttribute("stroke-width", "6");
    wavePath.setAttribute("fill", "none");
    wavePath.setAttribute("stroke-linecap", "round");

    svg.appendChild(wavePath);
    mapContainer.appendChild(svg);

    for (let i = 1; i <= LEVELS_COUNT; i++) {
        const index = i - 1;
        const progress = index / (LEVELS_COUNT - 1);
        const x = progress * WIDTH;
        const y = getYPosition(x);

        const level = document.createElement("div");
        level.className = "level";
        level.style.position = "absolute";
        level.style.left = `${x}px`;
        level.style.top = `${y}px`;
        level.style.transform = "translate(-50%, -50%)";
        level.style.zIndex = "2";

        if (!levelsData[index].unlocked) {
            level.classList.add("locked");
        }

        if (levelsData[index].completed) {
            level.classList.add("active");
        }

        const link = document.createElement("a");
        link.href = "level.html";
        link.textContent = String(i).padStart(2, "0");
        link.setAttribute("data-level", i);

        level.appendChild(link);

        if (i === 8 || i === 12) {
            const skull = document.createElement("div");
            skull.className = "skull";
            skull.textContent = "💀";
            level.appendChild(skull);
        }

        for (let f = 0; f < 3; f++) {
            const fire = document.createElement("div");
            fire.className = "fire";
            fire.style.left = Math.random() * 40 + "px";
            fire.style.animationDelay = Math.random() * 2 + "s";
            level.appendChild(fire);
        }

        mapContainer.appendChild(level);
        
        if (levelMenu) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.setAttribute("data-level", i);

            if (!levelsData[index].unlocked) {
                btn.disabled = true;
                btn.style.opacity = "0.4";
            }

            btn.addEventListener("click", () => {
                const targetLevel = document.querySelector(`.level a[data-level="${i}"]`).parentElement;
                const containerRect = waveTrack.getBoundingClientRect();
                const levelRect = targetLevel.getBoundingClientRect();
                
                waveTrack.scrollLeft = waveTrack.scrollLeft + (levelRect.left - containerRect.left) - (containerRect.width / 2) + 30;
            });

            levelMenu.appendChild(btn);
        }
    }

    waveTrack.appendChild(mapContainer);
}

window.addEventListener("resize", () => {
    renderMap();
});

let resizeObserver;
if (waveTrack) {
    resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
            renderMap();
        });
    });
    resizeObserver.observe(waveTrack);
}

// ========== СЛАЙДЕР ФОНОВ ==========

const backgrounds = {
    default: {
        url: "https://i.pinimg.com/736x/c6/63/72/c66372462582b22b1e2aee85b353e589.jpg",
        title: "🔥 Адские врата"
    },
    forest: {
        url: "./public/background/Огненныйлес.jpg",
        title: "🌲 Огненный лес"
    },
    ruins: {
        url: "./public/background/Пылающиеруины.jpg",
        title: "🏚️ Пылающие руины"
    },
    lava: {
        url: "./public/background/Лавовыепотоки.jpg",
        title: "🌋 Лавовые потоки"
    },
    canyon: {
        url: "./public/background/Адскийканьон.jpg",
        title: "⛰️ Адский каньон"
    }
};

function initBackgroundSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    const savedBg = localStorage.getItem('hellBackground') || 'default';
    const bgKeys = Object.keys(backgrounds);
    currentIndex = bgKeys.indexOf(savedBg);
    if (currentIndex === -1) currentIndex = 0;
    
    updateSlider();
    setBackground(bgKeys[currentIndex]);
    
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
            const bgKey = slide.getAttribute('data-bg');
            setBackground(bgKey);
            localStorage.setItem('hellBackground', bgKey);
        });
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
            const bgKey = slides[index].getAttribute('data-bg');
            setBackground(bgKey);
            localStorage.setItem('hellBackground', bgKey);
        });
    });
    
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
        const bgKey = slides[currentIndex].getAttribute('data-bg');
        setBackground(bgKey);
        localStorage.setItem('hellBackground', bgKey);
    });
    
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
        const bgKey = slides[currentIndex].getAttribute('data-bg');
        setBackground(bgKey);
        localStorage.setItem('hellBackground', bgKey);
    });
    
    function updateSlider() {
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        const sliderContainer = document.querySelector('.slider-container');
        const activeSlide = slides[currentIndex];
        const containerWidth = sliderContainer.offsetWidth;
        const slideWidth = activeSlide.offsetWidth + 10;
        
        sliderContainer.scrollTo({
            left: (slideWidth * currentIndex) - (containerWidth / 2) + (slideWidth / 2),
            behavior: 'smooth'
        });
    }
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    const sliderContainer = document.querySelector('.slider-container');
    
    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextBtn.click();
            } else {
                prevBtn.click();
            }
        }
    }
}

function setBackground(bgKey) {
    const bgConfig = backgrounds[bgKey];
    if (bgConfig && bgConfig.url) {
        document.body.style.background = `
            url("${bgConfig.url}")
            center / cover no-repeat fixed
        `;
        updateEnvironmentEffects(bgKey);
    }
}

function updateEnvironmentEffects(bgKey) {
    const waveTrack = document.querySelector('.wave-track');
    const existingEffects = waveTrack.querySelectorAll('.environment-effect');
    
    existingEffects.forEach(el => el.remove());
    
    const effect = document.createElement('div');
    effect.className = 'environment-effect';
    effect.style.position = 'absolute';
    effect.style.top = '0';
    effect.style.left = '0';
    effect.style.width = '100%';
    effect.style.height = '100%';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '0';
    
    switch(bgKey) {
        case 'forest':
            effect.style.background = 'radial-gradient(circle at 20% 50%, transparent 30%, rgba(255, 100, 0, 0.08) 50%, transparent 70%)';
            break;
        case 'ruins':
            effect.style.background = 'linear-gradient(135deg, transparent 40%, rgba(139, 0, 0, 0.1) 60%, transparent 80%)';
            break;
        case 'lava':
            effect.style.background = 'linear-gradient(0deg, rgba(255, 69, 0, 0.07) 0%, transparent 40%, transparent 60%, rgba(255, 140, 0, 0.07) 100%)';
            break;
        case 'canyon':
            effect.style.background = 'linear-gradient(90deg, rgba(101, 67, 33, 0.08) 0%, transparent 40%, transparent 60%, rgba(101, 67, 33, 0.08) 100%)';
            break;
        default:
            effect.style.background = 'none';
    }
    
    waveTrack.appendChild(effect);
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', () => {
    renderMap();
    initBackgroundSlider();
});