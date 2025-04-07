// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 获取DOM元素
    const scratchCard = document.getElementById('scratch-card');
    const scratchCardResult = document.getElementById('scratch-card-result');
    const newCardBtn = document.getElementById('new-card-btn');
    const prizeContent = document.getElementById('prize-content');
    const prizeProbability = document.getElementById('prize-probability');
    const probabilityValue = document.getElementById('probability-value');
    const saveSettingsBtn = document.getElementById('save-settings');

    // Canvas相关变量
    const ctx = scratchCard.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let revealedPercentage = 0;
    let particleTimer = null;

    // 默认设置
    let settings = {
        prizeContent: '恭喜中奖！获得神秘奖品一份！',
        probability: 30, // 百分比
        noPrizeContent: '很遗憾，没有中奖，再接再厉！'
    };

    // 从本地存储加载设置
    function loadSettings() {
        const savedSettings = getFromLocalStorage('scratchCardSettings');

        if (savedSettings) {
            settings = savedSettings;
            prizeContent.value = settings.prizeContent;
            prizeProbability.value = settings.probability;
            probabilityValue.textContent = `${settings.probability}%`;
        }
    }

    // 保存设置
    function saveSettings() {
        settings.prizeContent = prizeContent.value.trim() || '恭喜中奖！获得神秘奖品一份！';
        settings.probability = parseInt(prizeProbability.value) || 30;

        saveToLocalStorage('scratchCardSettings', settings);
        alert('设置已保存');
    }

    // 更新概率显示
    function updateProbabilityDisplay() {
        probabilityValue.textContent = `${prizeProbability.value}%`;
    }

    // 初始化刮刮卡
    function initScratchCard() {
        // 停止任何正在运行的粒子动画
        if (particleTimer) {
            clearTimeout(particleTimer);
        }

        // 设置Canvas尺寸与父容器一致
        const cardWrapper = scratchCard.parentElement;
        scratchCard.width = cardWrapper.offsetWidth;
        scratchCard.height = cardWrapper.offsetHeight;

        // 决定是否中奖
        const isWinner = Math.random() * 100 < settings.probability;

        // 设置结果文本
        scratchCardResult.textContent = isWinner ? settings.prizeContent : settings.noPrizeContent;
        scratchCardResult.dataset.winner = isWinner ? 'true' : 'false';

        // 如果中奖，添加金色背景
        if (isWinner) {
            scratchCardResult.style.backgroundColor = '#fff9e6';
            scratchCardResult.style.borderColor = 'gold';
            scratchCardResult.style.color = '#e67e22';
        } else {
            scratchCardResult.style.backgroundColor = 'white';
            scratchCardResult.style.borderColor = '#ddd';
            scratchCardResult.style.color = '#777';
        }

        // 绘制刮刮层
        drawScratchLayer();

        // 重置已刮开百分比
        revealedPercentage = 0;
    }

    // 绘制刮刮层
    function drawScratchLayer() {
        ctx.fillStyle = '#8e44ad'; // 刮刮层底色（紫色）
        ctx.fillRect(0, 0, scratchCard.width, scratchCard.height);

        // 添加一些装饰图案
        ctx.fillStyle = '#9b59b6'; // 稍微淡一点的紫色

        // 绘制随机圆点图案
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * scratchCard.width;
            const y = Math.random() * scratchCard.height;
            const radius = Math.random() * 10 + 5;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // 添加提示文字
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('刮开查看结果', scratchCard.width / 2, scratchCard.height / 2);
    }

    // 刮开卡片的函数
    function scratch(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 40;
        ctx.lineCap = 'round';

        ctx.beginPath();

        // 如果是开始绘制，直接在点击位置画一个点
        if (!isDrawing) {
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // 否则画一条线连接上一个点和当前点
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        lastX = x;
        lastY = y;

        // 计算已刮开的百分比
        calculateRevealedPercentage();
    }

    // 计算已刮开的百分比
    function calculateRevealedPercentage() {
        const imageData = ctx.getImageData(0, 0, scratchCard.width, scratchCard.height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        // 每四个值代表一个像素点的RGBA
        for (let i = 3; i < pixels.length; i += 4) {
            // 如果Alpha通道接近透明，则认为该像素点已被刮开
            if (pixels[i] < 50) {
                transparentPixels++;
            }
        }

        // 计算百分比
        const totalPixels = scratchCard.width * scratchCard.height;
        revealedPercentage = (transparentPixels / totalPixels) * 100;

        // 如果刮开面积超过50%，自动显示全部
        if (revealedPercentage > 50 && scratchCardResult.dataset.winner === 'true') {
            revealAll();
        }
    }

    // 显示全部结果
    function revealAll() {
        ctx.clearRect(0, 0, scratchCard.width, scratchCard.height);

        // 如果中奖，触发庆祝效果
        if (scratchCardResult.dataset.winner === 'true') {
            // 延迟一点显示庆祝效果，这样用户可以先看到结果
            particleTimer = setTimeout(() => {
                createConfetti();

                // 播放中奖音效
                playWinSound();
            }, 300);
        }
    }

    // 播放中奖音效
    function playWinSound() {
        // 创建音频上下文
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // 创建振荡器
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // 设置音量
        gainNode.gain.value = 0.3;

        // 播放欢快的音效序列
        const notes = [
            { frequency: 523.25, duration: 100 }, // C
            { frequency: 587.33, duration: 100 }, // D
            { frequency: 659.25, duration: 100 }, // E
            { frequency: 698.46, duration: 100 }, // F
            { frequency: 783.99, duration: 100 }, // G
            { frequency: 880.00, duration: 100 }, // A
            { frequency: 987.77, duration: 200 }  // B
        ];

        let startTime = audioContext.currentTime;

        notes.forEach(note => {
            oscillator.frequency.setValueAtTime(note.frequency, startTime);
            startTime += note.duration / 1000;
        });

        oscillator.start();
        oscillator.stop(startTime);
    }

    // 事件监听：概率滑块变化
    prizeProbability.addEventListener('input', updateProbabilityDisplay);

    // 事件监听：保存设置
    saveSettingsBtn.addEventListener('click', saveSettings);

    // 事件监听：创建新卡片
    newCardBtn.addEventListener('click', initScratchCard);

    // 事件监听：鼠标按下
    scratchCard.addEventListener('mousedown', function (e) {
        isDrawing = true;

        // 获取鼠标位置相对于Canvas的坐标
        const rect = scratchCard.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;

        scratch(lastX, lastY);
    });

    // 事件监听：鼠标移动
    scratchCard.addEventListener('mousemove', function (e) {
        if (!isDrawing) return;

        const rect = scratchCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        scratch(x, y);
    });

    // 事件监听：鼠标松开或离开
    window.addEventListener('mouseup', function () {
        isDrawing = false;
    });

    scratchCard.addEventListener('mouseleave', function () {
        isDrawing = false;
    });

    // 触摸事件支持
    scratchCard.addEventListener('touchstart', function (e) {
        e.preventDefault(); // 防止默认行为（如滚动）
        isDrawing = true;

        const rect = scratchCard.getBoundingClientRect();
        const touch = e.touches[0];
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;

        scratch(lastX, lastY);
    });

    scratchCard.addEventListener('touchmove', function (e) {
        e.preventDefault();
        if (!isDrawing) return;

        const rect = scratchCard.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        scratch(x, y);
    });

    scratchCard.addEventListener('touchend', function () {
        isDrawing = false;
    });

    // 窗口大小改变时重新初始化
    window.addEventListener('resize', initScratchCard);

    // 初始加载
    loadSettings();
    initScratchCard();
}); 