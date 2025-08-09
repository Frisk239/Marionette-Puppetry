/**
 * 移动端导航菜单控制
 * 解决汉堡菜单、导航栏错位、触摸交互等问题
 */

class MobileNavManager {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.checkScreenSize();
    }

    setupElements() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navOverlay = document.getElementById('navOverlay');
        this.body = document.body;
    }

    setupEventListeners() {
        // 汉堡菜单点击事件
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleMenu());
        }

        // 遮罩层点击事件
        if (this.navOverlay) {
            this.navOverlay.addEventListener('click', () => this.closeMenu());
        }

        // 窗口大小变化事件
        window.addEventListener('resize', () => this.handleResize());

        // 键盘事件（ESC关闭菜单）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // 导航链接点击事件（移动端点击后关闭菜单）
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        if (!this.navMenu || !this.navOverlay) return;

        this.isOpen = true;
        this.navMenu.classList.add('active');
        this.navOverlay.classList.add('active');
        this.menuToggle.classList.add('active');
        this.body.style.overflow = 'hidden';

        // 添加动画效果
        this.navMenu.style.transition = 'right 0.3s ease';
    }

    closeMenu() {
        if (!this.navMenu || !this.navOverlay) return;

        this.isOpen = false;
        this.navMenu.classList.remove('active');
        this.navOverlay.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.body.style.overflow = '';

        // 移除过渡效果
        setTimeout(() => {
            if (this.navMenu) {
                this.navMenu.style.transition = '';
            }
        }, 300);
    }

    handleResize() {
        // 当窗口大小超过768px时，关闭移动端菜单
        if (window.innerWidth > 768 && this.isOpen) {
            this.closeMenu();
        }
    }

    checkScreenSize() {
        // 初始化时检查屏幕大小
        if (window.innerWidth > 768) {
            // 隐藏汉堡菜单
            if (this.menuToggle) {
                this.menuToggle.style.display = 'none';
            }
        } else {
            // 显示汉堡菜单
            if (this.menuToggle) {
                this.menuToggle.style.display = 'block';
            }
        }
    }
}

// 防止iOS滚动穿透
function preventScroll() {
    let scrollTop = 0;
    
    return {
        disable() {
            scrollTop = window.pageYOffset;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollTop}px`;
            document.body.style.width = '100%';
        },
        enable() {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollTop);
        }
    };
}

// 触摸手势支持
class TouchGestureHandler {
    constructor(navManager) {
        this.navManager = navManager;
        this.startX = 0;
        this.startY = 0;
        this.init();
    }

    init() {
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }

    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        if (!this.navManager.isOpen) return;

        const currentX = e.touches[0].clientX;
        const diffX = this.startX - currentX;

        // 右滑关闭菜单
        if (diffX < -50) {
            e.preventDefault();
            this.navManager.closeMenu();
        }
    }

    handleTouchEnd(e) {
        // 触摸结束时的处理
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    const mobileNav = new MobileNavManager();
    const touchHandler = new TouchGestureHandler(mobileNav);
    
    // 暴露到全局，方便调试
    window.mobileNav = mobileNav;
});

// 修复iOS Safari底部工具栏问题
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    window.addEventListener('resize', function() {
        document.body.style.height = window.innerHeight + 'px';
    });
}

// 防止双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);
