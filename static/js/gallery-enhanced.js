/**
 * 闽南木偶戏影像资料页面增强交互功能
 * 支持响应式设计、图片过滤、灯箱效果等
 */

class GalleryEnhanced {
    constructor() {
        this.currentFilter = 'all';
        this.currentView = 'grid';
        this.items = [];
        this.filteredItems = [];
        this.currentLightboxIndex = 0;
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupLazyLoading();
        this.setupTouchGestures();
        this.loadGalleryItems();
    }

    setupElements() {
        this.container = document.getElementById('galleryContainer');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.viewButtons = document.querySelectorAll('.view-btn');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxCaption = document.getElementById('lightboxCaption');
    }

    setupEventListeners() {
        // 筛选按钮事件
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // 视图切换事件
        this.viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleViewChange(e));
        });

        // 灯箱关闭事件
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target.classList.contains('lightbox-close')) {
                this.closeLightbox();
            }
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // 触摸手势
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
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
                rootMargin: '50px'
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupTouchGestures() {
        // 为移动设备添加触摸手势支持
        const hammer = new Hammer(this.container);
        hammer.on('swipeleft swiperight', (e) => {
            if (this.lightbox.style.display === 'block') {
                if (e.type === 'swipeleft') {
                    this.nextImage();
                } else {
                    this.prevImage();
                }
            }
        });
    }

    loadGalleryItems() {
        this.items = Array.from(document.querySelectorAll('.gallery-card'));
        this.filteredItems = [...this.items];
        this.animateItems();
    }

    handleFilter(e) {
        const filter = e.target.dataset.filter;
        
        // 更新按钮状态
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.currentFilter = filter;
        this.filterItems();
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

    handleViewChange(e) {
        const view = e.target.dataset.view;
        
        // 更新按钮状态
        this.viewButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        this.currentView = view;
        this.changeView(view);
    }

    changeView(view) {
        this.container.className = `gallery-${view}`;
        
        // 添加过渡动画
        this.container.classList.add('view-transition');
        setTimeout(() => {
            this.container.classList.remove('view-transition');
        }, 300);
    }

    openLightbox(element) {
        const img = element.querySelector('img') || element.closest('.gallery-card').querySelector('img');
        const caption = element.closest('.gallery-card').querySelector('.card-title').textContent;
        
        this.lightboxImage.src = img.src;
        this.lightboxImage.alt = img.alt;
        this.lightboxCaption.textContent = caption;
        
        // 找到当前图片在过滤后列表中的索引
        const card = element.closest('.gallery-card');
        this.currentLightboxIndex = this.filteredItems.indexOf(card);
        
        this.lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 添加动画
        this.lightbox.classList.add('lightbox-active');
    }

    closeLightbox() {
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
        const card = this.filteredItems[this.currentLightboxIndex];
        const img = card.querySelector('img');
        const caption = card.querySelector('.card-title').textContent;
        
        this.lightboxImage.src = img.src;
        this.lightboxImage.alt = img.alt;
        this.lightboxCaption.textContent = caption;
    }

    handleKeyboard(e) {
        if (this.lightbox.style.display === 'block') {
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
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextImage();
            } else {
                this.prevImage();
            }
        }
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.classList.add('loaded');
        }
    }

    animateItems() {
        this.items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // 搜索功能
    searchGallery(query) {
        const searchTerm = query.toLowerCase();
        
        this.items.forEach(item => {
            const title = item.querySelector('.card-title').textContent.toLowerCase();
            const description = item.querySelector('.card-description').textContent.toLowerCase();
            const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          tags.some(tag => tag.includes(searchTerm));
            
            item.style.display = matches ? 'block' : 'none';
        });
    }

    // 重置筛选
    resetFilters() {
        this.currentFilter = 'all';
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        this.filterButtons[0].classList.add('active');
        this.filterItems();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    window.galleryEnhanced = new GalleryEnhanced();
});

// 全局函数（向后兼容）
function filterGallery(category) {
    const event = new CustomEvent('filterGallery', { detail: { category } });
    document.dispatchEvent(event);
}

function changeView(view) {
    const event = new CustomEvent('changeView', { detail: { view } });
    document.dispatchEvent(event);
}

function openLightbox(element) {
    window.galleryEnhanced.openLightbox(element);
}

function closeLightbox() {
    window.galleryEnhanced.closeLightbox();
}

// 监听自定义事件
document.addEventListener('filterGallery', (e) => {
    const button = document.querySelector(`[data-filter="${e.detail.category}"]`);
    if (button) {
        button.click();
    }
});

document.addEventListener('changeView', (e) => {
    const button = document.querySelector(`[data-view="${e.detail.view}"]`);
    if (button) {
        button.click();
    }
});
