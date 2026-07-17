// ============================================
// 页面导航系统
// ============================================

const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

// 切换页面
function switchPage(pageName) {
    // 更新导航
    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageName);
    });

    // 更新页面显示
    pages.forEach(page => {
        const isActive = page.id === `page-${pageName}`;
        page.classList.toggle('active', isActive);
    });
}

// 点击导航
navLinks.forEach(link => {
    link.addEventListener('click', () => switchPage(link.dataset.page));
});

// ============================================
// 键盘导航 (数字键 1-5 切换)
// ============================================

document.addEventListener('keydown', (e) => {
    const pageMap = ['home', 'about', 'skills', 'projects', 'contact'];
    const idx = parseInt(e.key) - 1;
    if (idx >= 0 && idx < pageMap.length) {
        switchPage(pageMap[idx]);
    }
});

// ============================================
// 卡片 hover 3D 微倾
// ============================================

document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -3;
        const rotateY = (x - centerX) / centerX * 3;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ============================================
// Email 弹窗
// ============================================

function showEmailModal() {
    document.getElementById('email-modal').classList.add('show');
}

function closeEmailModal(e) {
    if (e && e.target !== document.getElementById('email-modal')) return;
    document.getElementById('email-modal').classList.remove('show');
}

function copyEmail() {
    navigator.clipboard.writeText('ye33445200@qq.com').then(() => {
        const btn = document.getElementById('copy-text');
        btn.textContent = '✅ 已复制';
        setTimeout(() => { btn.textContent = '📋 复制邮箱'; }, 2000);
    });
}

// ESC 关闭弹窗
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('email-modal').classList.remove('show');
    }
});

// ============================================
// 标签页标题彩蛋
// ============================================
let originalTitle = document.title;
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        originalTitle = document.title;
        document.title = '(oﾟvﾟ)ノ 别走呀~';
    } else {
        document.title = '(◕‿◕)♪ 你回来啦！';
        setTimeout(() => { document.title = originalTitle; }, 2000);
    }
});
