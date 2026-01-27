/* const loader = document.getElementById('loader');
const message = loader.querySelector('.orientation-message');

const mobileMessage = `
    <div class="phone-icon">📱</div>
    <h2>Поверните устройство</h2>
    <p>Для просмотра сайта используйте горизонтальную ориентацию</p>
    <div class="rotate-animation">↻</div>
`;

const pcMessage = `
    <div style="font-size: 70px; margin-bottom: 25px;">💻</div>
    <h2 style="color: #ff6b6b;">Используйте мобильное устройство</h2>
    <p>Этот контент оптимизирован для просмотра на телефонах и планшетах</p>
    <p style="margin-top: 15px; font-size: 14px; opacity: 0.7;">
        Или уменьшите размер окна браузера до мобильного размера
    </p>
`;

function checkDeviceAndOrientation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTabletDevice = /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent);
    
    console.log(`Размеры: ${width}x${height}, Мобильное: ${isMobileDevice}, Планшет: ${isTabletDevice}`);
    
    if (width > 1024 || (!isMobileDevice && !isTabletDevice)) {
        loader.classList.remove('hidden');
        message.innerHTML = pcMessage;
        message.classList.add('pc-message');
        console.log('ПК устройство');
        return;
    }
    
    if (width >= 768 || isTabletDevice) {
        if (width > height) {
            loader.classList.add('hidden');
            console.log('Планшет в альбомной ориентации ✓');
        } else {
            loader.classList.remove('hidden');
            message.innerHTML = mobileMessage;
            message.classList.remove('pc-message');
            console.log('Планшет в портретной ориентации - нужно повернуть');
        }
        return;
    }
    
    if (width > height) {
        loader.classList.add('hidden');
        console.log('Телефон в альбомной ориентации ✓');
    } else {
        loader.classList.remove('hidden');
        message.innerHTML = mobileMessage;
        message.classList.remove('pc-message');
        console.log('Телефон в портретной ориентации - нужно повернуть');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена, проверяем устройство...');
    checkDeviceAndOrientation();
    
    if (navigator.vibrate && !loader.classList.contains('hidden')) {
        navigator.vibrate([100, 50, 100]);
    }
});

let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        console.log('Размер окна изменен, проверяем...');
        checkDeviceAndOrientation();
    }, 250);
});

window.addEventListener('orientationchange', function() {
    console.log('Ориентация устройства изменена');
    setTimeout(checkDeviceAndOrientation, 300);
});

if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    window.addEventListener('pageshow', checkDeviceAndOrientation);
}

loader.addEventListener('click', function(e) {
    if (e.target === loader || e.target.classList.contains('orientation-message')) {
        if (!message.classList.contains('pc-message')) {
            loader.classList.add('hidden');
            console.log('Оверлей закрыт пользователем');
        }
    }
});

 */