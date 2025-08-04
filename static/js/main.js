// 网站主要JavaScript功能

// 全局变量
const APP = {
    config: {
        apiBaseUrl: '/api',
        sessionId: 'session_' + Date.now()
    },
    
    utils: {
        // 工具函数
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // 平滑滚动到元素
        scrollToElement(element, offset = 0) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        },
        
        // 创建通知
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        },
        
        // 加载状态
        showLoading(container) {
            const loader = document.createElement('div');
            loader.className = 'loading-overlay';
            loader.innerHTML = '<div class="spinner"></div>';
            container.appendChild(loader);
            return loader;
        },
        
        hideLoading(loader) {
            if (loader && loader.parentNode) {
                loader.remove();
            }
        }
    },
    
    // 页面初始化
    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupResponsiveMenu();
        this.setupBackToTop();
        this.setupAnimations();
    },
    
    // 导航设置
    setupNavigation() {
        // 高亮当前页面
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
        
        // 平滑滚动到锚点
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    APP.utils.scrollToElement(target, 80);
                }
            });
        });
    },
    
    // 滚动效果
    setupScrollEffects() {
        // 滚动时添加阴影到导航栏
        const header = document.querySelector('.site-header');
        if (header) {
            window.addEventListener('scroll', APP.utils.throttle(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, 100));
        }
        
        // 滚动动画
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.feature-card, .culture-item, .master-card, .story-card').forEach(el => {
            observer.observe(el);
        });
    },
    
    // 响应式菜单
    setupResponsiveMenu() {
        const navToggle = document.createElement('button');
        navToggle.className = 'nav-toggle';
        navToggle.innerHTML = '☰';
        navToggle.setAttribute('aria-label', '切换导航菜单');
        
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            navContainer.appendChild(navToggle);
            
            navToggle.addEventListener('click', () => {
                const navMenu = document.querySelector('.nav-menu');
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    },
    
    // 返回顶部按钮
    setupBackToTop() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.setAttribute('aria-label', '返回顶部');
        document.body.appendChild(backToTopBtn);
        
        window.addEventListener('scroll', APP.utils.throttle(() => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100));
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },
    
    // 动画效果
    setupAnimations() {
        // 添加CSS动画类
        const style = document.createElement('style');
        style.textContent = `
            .scrolled {
                box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            }
            
            .nav-toggle {
                display: none;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: white;
            }
            
            .back-to-top {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: var(--primary-red);
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.5rem;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
            }
            
            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .back-to-top:hover {
                background: var(--secondary-red);
                transform: translateY(-2px);
            }
            
            .animate-in {
                animation: fadeInUp 0.6s ease-out forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 2rem;
                background: var(--primary-red);
                color: white;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 1001;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                background: #28a745;
            }
            
            .notification-error {
                background: #dc3545;
            }
            
            .loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255,255,255,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100;
            }
            
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid var(--light-gold);
                border-top: 4px solid var(--primary-red);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @media (max-width: 768px) {
                .nav-toggle {
                    display: block;
                }
                
                .nav-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: var(--primary-red);
                    flex-direction: column;
                    padding: 1rem;
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .nav-menu.active {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }
                
                .nav-menu li {
                    margin: 0.5rem 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    APP.init();
    
    // 添加页面加载完成提示
    console.log('闽南木偶戏网站已加载完成');
    
    // 添加欢迎消息
    if (window.location.pathname === '/') {
        setTimeout(() => {
            APP.utils.showNotification('欢迎来到闽南木偶戏数字博物馆！', 'success');
        }, 1000);
    }
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('JavaScript错误:', e.error);
    APP.utils.showNotification('页面加载出现问题，请刷新重试', 'error');
});

// 网络状态检测
window.addEventListener('online', () => {
    APP.utils.showNotification('网络已连接', 'success');
});

window.addEventListener('offline', () => {
    APP.utils.showNotification('网络已断开，部分功能可能无法使用', 'error');
});
