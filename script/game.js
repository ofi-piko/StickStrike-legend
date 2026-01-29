document.addEventListener('DOMContentLoaded', () => {
    // Элементы
    const player = document.getElementById('player');
    const joystickHandle = document.getElementById('joystickHandle');
    const joystickBase = document.querySelector('.joystick-base');
    const jumpBtn = document.getElementById('jumpBtn');
    const gameField = document.getElementById('gameField');
    
    // Статистика
    const posXElement = document.getElementById('posX');
    const speedElement = document.getElementById('speed');
    
    // Состояние игры
    const state = {
        x: 50, // позиция в процентах
        speed: 0,
        maxSpeed: 15,
        acceleration: 0.8,
        friction: 0.85,
        isJumping: false,
        jumpPower: 25,
        joystickActive: false,
        joystickDirection: 0, // -1 влево, 1 вправо, 0 стоп
        keys: {
            a: false,
            d: false
        },
        fieldScroll: 0
    };
    
    // Размеры джойстика
    const joystickRect = joystickBase.getBoundingClientRect();
    const joystickCenterX = joystickRect.left + joystickRect.width / 2;
    const joystickRadius = joystickRect.width / 2;
    
    // === УПРАВЛЕНИЕ ДЖОЙСТИКОМ ===
    let isDragging = false;
    
    // Начало перемещения джойстика
    joystickHandle.addEventListener('mousedown', startDrag);
    joystickHandle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrag(e.touches[0]);
    });
    
    // Перемещение джойстика
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (e.touches[0]) drag(e.touches[0]);
    }, { passive: false });
    
    // Окончание перемещения
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    document.addEventListener('touchcancel', endDrag);
    
    function startDrag(e) {
        isDragging = true;
        state.joystickActive = true;
        updateJoystick(e.clientX);
    }
    
    function drag(e) {
        if (!isDragging) return;
        updateJoystick(e.clientX);
    }
    
    function endDrag() {
        isDragging = false;
        state.joystickActive = false;
        state.joystickDirection = 0;
        
        // Возвращаем джойстик в центр
        joystickHandle.style.transform = `translate(-50%, -50%)`;
    }
    
    function updateJoystick(clientX) {
        // Вычисляем смещение относительно центра
        let deltaX = clientX - joystickCenterX;
        
        // Ограничиваем радиусом джойстика
        deltaX = Math.max(-joystickRadius, Math.min(joystickRadius, deltaX));
        
        // Определяем направление
        if (Math.abs(deltaX) > 10) {
            state.joystickDirection = deltaX > 0 ? 1 : -1;
        } else {
            state.joystickDirection = 0;
        }
        
        // Двигаем ручку джойстика
        const handleX = deltaX / joystickRadius * 20; // 20px максимум
        joystickHandle.style.transform = `translate(calc(-50% + ${handleX}px), -50%)`;
        
        // Визуальная обратная связь
        const intensity = Math.abs(deltaX) / joystickRadius;
        joystickHandle.style.background = `linear-gradient(145deg, 
            rgba(255, 69, 0, ${0.5 + intensity * 0.5}), 
            rgba(139, 0, 0, ${0.5 + intensity * 0.5}))`;
    }
    
    // === КНОПКА ПРЫЖКА ===
    jumpBtn.addEventListener('click', performJump);
    jumpBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        performJump();
    });
    
    // === УПРАВЛЕНИЕ КЛАВИАТУРОЙ (ИСПРАВЛЕНО) ===
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        
        if (key === 'a' || key === 'ф') { // русская и английская раскладки
            state.keys.a = true;
            state.joystickActive = false; // отключаем джойстик при использовании клавиатуры
        } else if (key === 'd' || key === 'в') {
            state.keys.d = true;
            state.joystickActive = false;
        } else if (key === ' ' || key === 'spacebar') {
            e.preventDefault();
            performJump();
        }
        
        // Блокируем прокрутку страницы
        if ([' ', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        
        if (key === 'a' || key === 'ф') {
            state.keys.a = false;
        } else if (key === 'd' || key === 'в') {
            state.keys.d = false;
        }
    });
    
    // Фокус на игре при клике
    document.addEventListener('click', () => {
        document.body.focus();
    });
    
    document.body.tabIndex = 0; // Делаем body фокусируемым
    document.body.style.outline = 'none';
    
    // === ЛОГИКА ПРЫЖКА ===
    function performJump() {
        if (state.isJumping) return;
        
        state.isJumping = true;
        player.classList.add('jumping');
        
        // Дополнительный импульс при движении
        if (Math.abs(state.speed) > 5) {
            state.speed *= 1.2;
        }
        
        // Завершение прыжка
        setTimeout(() => {
            player.classList.remove('jumping');
            state.isJumping = false;
        }, 600);
    }
    





    


    // === ИГРОВОЙ ЦИКЛ ===
    function gameLoop() {
        // Вычисляем движение на основе джойстика ИЛИ клавиатуры
        let targetSpeed = 0;
        
        if (state.joystickActive) {
            // Управление джойстиком
            targetSpeed = state.joystickDirection * state.maxSpeed;
        } else {
            // Управление клавиатурой
            if (state.keys.a && !state.keys.d) targetSpeed = -state.maxSpeed;
            if (state.keys.d && !state.keys.a) targetSpeed = state.maxSpeed;
        }
        
        // Плавное изменение скорости
        state.speed += (targetSpeed - state.speed) * state.acceleration * 0.1;
        
        if (targetSpeed === 0 && !state.joystickActive && !state.keys.a && !state.keys.d) {
            state.speed *= state.friction;
        }

        if (Math.abs(state.speed) < 0.1) {
            state.speed = 0;
        }
        
        state.x += state.speed * 0.1;
        
        state.x = Math.max(2, Math.min(98, state.x));

        player.style.left = `${state.x}%`;
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
    
    console.log('🎮 Управление готово!');
    console.log('←→ Джойстик или A/D - движение');
    console.log('🟢 Кнопка ПРЫЖОК или ПРОБЕЛ - прыжок');
    console.log('📱 Поддерживается сенсорное управление');
});
