// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 导航选项卡切换功能
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // 移除所有激活状态
            navLinks.forEach(item => item.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // 添加激活状态到当前选中项
            this.classList.add('active');

            // 显示对应的内容区域
            const targetSection = this.getAttribute('data-section');
            document.getElementById(targetSection).classList.add('active');
        });
    });

    // 粒子效果函数（用于随机点名和刮刮乐中奖时的庆祝效果）
    window.createConfetti = function () {
        const confettiContainer = document.getElementById('confetti-container');
        confettiContainer.innerHTML = ''; // 清除之前的粒子

        // 创建粒子
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.borderRadius = '50%';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = -20 + 'px';
            confetti.style.opacity = Math.random() * 0.7 + 0.3;
            confetti.style.pointerEvents = 'none';
            confettiContainer.appendChild(confetti);

            // 使用CSS动画让粒子下落
            confetti.animate(
                [
                    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                    { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                ],
                {
                    duration: Math.random() * 2000 + 2000,
                    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
                }
            );

            // 动画结束后移除粒子
            setTimeout(() => {
                confetti.remove();
            }, Math.random() * 2000 + 2000);
        }
    };

    // 生成随机颜色
    function getRandomColor() {
        const colors = [
            '#3498db', // 蓝色
            '#2ecc71', // 绿色
            '#e74c3c', // 红色
            '#f1c40f', // 黄色
            '#9b59b6', // 紫色
            '#1abc9c', // 蓝绿色
            '#e67e22'  // 橙色
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // 本地存储功能
    window.saveToLocalStorage = function (key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    };

    window.getFromLocalStorage = function (key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    };
}); 