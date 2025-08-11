/**
 * 闽南木偶戏影像资料页面 - 兼容版JavaScript
 * 与现有网站风格完全统一的交互功能
 * 继承现有交互模式，优化移动端体验
 */

class GalleryCompatible {
    constructor() {
        this.currentFilter = 'all';
        this.currentView = 'grid';
        this.items = [];
        this.filteredItems = [];
        this.currentLightboxIndex = 0;
        this.isLoading = false;
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupLazyLoading();
        this.setupTouchGestures();
        this.setupScrollProgress();
        this.loadGalleryItems();
        this.animateOnScroll();
    }

    setupElements() {
        this.container = document.querySelector('.gallery-compatible-container');
        this.galleryContainer = document.getElementById('galleryContainer');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxCaption = document.getElementById('lightboxCaption');
        this.scrollProgress = document.querySelector('.scroll-progress');
    }

    setupEventListeners() {
        // 筛选按钮事件 - 与现有按钮样式统一
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // 视图切换事件
        this.viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewChange(e));
        });

        // 灯箱事件
        if (this.lightbox) {
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox || e.target.classList.contains('lightbox-close')) {
                    this.closeLightbox();
                }
            });
        }

        // 键盘导航
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // 窗口调整
        window.addEventListener('resize', () => this.handleResize());
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupTouchGestures() {
        // 简单的触摸手势支持
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!this.lightbox || this.lightbox.style.display !== 'block') return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            // 水平滑动检测
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.prevImage();
                } else {
                    this.nextImage();
                }
            }
        });
    }

    setupScrollProgress() {
        if (!this.scrollProgress) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            this.scrollProgress.style.transform = `scaleX(${scrollPercent})`;
        });
    }

    loadGalleryItems() {
        this.items = Array.from(document.querySelectorAll('.gallery-card'));
        this.filteredItems = [...this.items];
        this.animateItems();
    }

    animateItems() {
        this.items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    animateOnScroll() {
        if (!'IntersectionObserver' in window) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.items.forEach(item => {
            observer.observe(item);
        });
    }

    handleFilter(e) {
        const filter = e.target.dataset.filter;
        
        // 更新按钮状态
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.currentFilter = filter;
        this.filterItems();
        
        // 添加动画效果
        this.animateFilterTransition();
    }

    filterItems() {
        this.items.forEach(item => {
            const category = item.dataset.category;
            const shouldShow = this.currentFilter === 'all' || category === this.currentFilter;
            
            if (shouldShow) {
                item.style.display = 'block';
                item.classList.add('fade-in-up');
                setTimeout(() => item.classList.remove('fade-in-up'), 600);
            } else {
                item.style.display = 'none';
            }
        });
        
        this.filteredItems = this.items.filter(item => {
            const category = item.dataset.category;
            return this.currentFilter === 'all' || category === this.currentFilter;
        });
    }

    animateFilterTransition() {
        const container = this.galleryContainer;
        container.style.opacity = '0.7';
        setTimeout(() => {
            container.style.opacity = '1';
        }, 300);
    }

    handleViewChange(e) {
        const view = e.target.dataset.view;
        
        // 更新按钮状态
        this.viewButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.currentView = view;
        this.changeView(view);
    }

    changeView(view) {
        if (!this.galleryContainer) return;
        
        this.galleryContainer.className = `gallery-${view}`;
        
        // 添加过渡动画
        this.galleryContainer.classList.add('view-transition');
        setTimeout(() => {
            this.galleryContainer.classList.remove('view-transition');
        }, 300);
    }

    openLightbox(element) {
        if (!this.lightbox || !this.lightboxImage) return;
        
        const card = element.closest('.gallery-card');
        const img = card.querySelector('img') || card.querySelector('video');
        const title = card.querySelector('.card-title').textContent;
        
        this.lightboxImage.src = img.src;
        this.lightboxImage.alt = img.alt || title;
        
        if (this.lightboxCaption) {
            this.lightboxCaption.textContent = title;
        }
        
        // 找到当前图片在过滤后列表中的索引
        this.currentLightboxIndex = this.filteredItems.indexOf(card);
        
        this.lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 添加动画类
        setTimeout(() => {
            this.lightbox.classList.add('lightbox-active');
        }, 10);
    }

    closeLightbox() {
        if (!this.lightbox) return;
        
        this.lightbox.classList.remove('lightbox-active');
        setTimeout(() => {
            this.lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    nextImage() {
        if (this.currentLightboxIndex < this.filteredItems.length - 1) {
            this.currentLightboxIndex++;
            this.updateLightboxImage();
        }
    }

    prevImage() {
        if (this.currentLightboxIndex > 0) {
            this.currentLightboxIndex--;
            this.updateLightboxImage();
        }
    }

    updateLightboxImage() {
        if (!this.lightboxImage || !this.lightboxCaption) return;
        
        const card = this.filteredItems[this.currentLightboxIndex];
        const img = card.querySelector('img') || card.querySelector('video');
        const title = card.querySelector('.card-title').textContent;
        
        // 添加淡入淡出效果
        this.lightboxImage.style.opacity = '0';
        setTimeout(() => {
            this.lightboxImage.src = img.src;
            this.lightboxImage.alt = img.alt || title;
            this.lightboxCaption.textContent = title;
            this.lightboxImage.style.opacity = '1';
        }, 150);
    }

    handleKeyboard(e) {
        if (!this.lightbox || this.lightbox.style.display !== 'block') return;
        
        switch(e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.prevImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }

    handleResize() {
        // 响应窗口大小变化
        if (window.innerWidth <= 768) {
            this.galleryContainer.classList.remove('gallery-list');
            this.galleryContainer.classList.add('gallery-grid');
            
            // 更新视图按钮状态
            this.viewButtons.forEach(btn => {
                if (btn.dataset.view === 'grid') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.classList.add('loaded');
            img.classList.remove('lazy');
        }
    }

    // 搜索功能
    searchGallery(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (!searchTerm) {
            this.resetFilters();
            return;
        }
        
        this.items.forEach(item => {
            const title = item.querySelector('.card-title').textContent.toLowerCase();
            const description = item.querySelector('.card-description').textContent.toLowerCase();
            const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          tags.some(tag => tag.includes(searchTerm));
            
            item.style.display = matches ? 'block' : 'none';
            if (matches) {
                item.classList.add('fade-in-up');
                setTimeout(() => item.classList.remove('fade-in-up'), 600);
            }
        });
    }

    // 重置筛选
    resetFilters() {
        this.currentFilter = 'all';
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        this.filterButtons[0]?.classList.add('active');
        this.filterItems();
    }

    // 预加载下一张图片
    preloadNextImage() {
        if (this.currentLightboxIndex < this.filteredItems.length - 1) {
            const nextCard = this.filteredItems[this.currentLightboxIndex + 1];
            const nextImg = nextCard.querySelector('img');
            if (nextImg) {
                const img = new Image();
                img.src = nextImg.src;
            }
        }
    }

    // 性能优化：防抖函数
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
    }
}

// 全局函数（保持向后兼容）
function filterGallery(category) {
    if (window.galleryCompatible) {
        const button = document.querySelector(`[data-filter="${category}"]`);
        if (button) button.click();
    }
}

function changeView(view) {
    if (window.galleryCompatible) {
        const button = document.querySelector(`[data-view="${view}"]`);
        if (button) button.click();
    }
}

function openLightbox(element) {
    if (window.galleryCompatible) {
        window.galleryCompatible.openLightbox(element);
    }
}

function closeLightbox() {
    if (window.galleryCompatible) {
        window.galleryCompatible.closeLightbox();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    window.galleryCompatible = new GalleryCompatible();
});

// 搜索功能集成
function setupGallerySearch() {
    const searchInput = document.getElementById('gallerySearch');
    if (searchInput && window.galleryCompatible) {
        searchInput.addEventListener('input', 
            window.galleryCompatible.debounce((e) => {
                window.galleryCompatible.searchGallery(e.target.value);
            }, 300)
        );
    }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalleryCompatible;
}
