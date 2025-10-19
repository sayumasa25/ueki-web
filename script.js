// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Header Background on Scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const animateElements = document.querySelectorAll('.section-header, .feature-card, .service-card, .news-item, .concept-content, .greeting-content, .about-content, .contact-content');
    
    animateElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });

    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('必須項目を入力してください。', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('有効なメールアドレスを入力してください。', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('お問い合わせを送信しています...', 'info');
            
            setTimeout(() => {
                showNotification('お問い合わせありがとうございます。後日担当者よりご連絡いたします。', 'success');
                this.reset();
            }, 2000);
        });
    }

    // Utility Functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '9999',
            maxWidth: '400px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = '#4a7c59';
                break;
            case 'error':
                notification.style.background = '#d32f2f';
                break;
            case 'info':
            default:
                notification.style.background = '#4a90a4';
                break;
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Add scroll-to-top functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    
    Object.assign(scrollToTopBtn.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'var(--primary-color)',
        color: 'white',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        opacity: '0',
        visibility: 'hidden',
        transition: 'all 0.3s ease',
        zIndex: '1000',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
    });
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add loading animation to page
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate hero section
        const heroElements = document.querySelectorAll('.hero-text > *');
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200 + 500);
        });
    });

    // Add CSS for mobile menu toggle
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 80px;
                right: -100%;
                width: 100%;
                height: calc(100vh - 80px);
                background: white;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding-top: 2rem;
                transition: right 0.3s ease;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .nav-menu.active {
                right: 0;
            }
            
            .nav-menu li {
                margin: 1rem 0;
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(-45deg) translate(-5px, 6px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(45deg) translate(-5px, -6px);
            }
            
            .header.scrolled {
                background: rgba(255, 255, 255, 0.98);
            }
        }
        
        .scroll-to-top:hover {
            background: #3a7a8a !important;
            transform: translateY(-2px);
        }
        
        .notification {
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Add some interactive features for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    const rippleButtons = document.querySelectorAll('.btn');
    rippleButtons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Add ripple CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // microCMS連携機能
    loadFeaturesFromMicroCMS();
});

// microCMS設定
const MICROCMS_CONFIG = {
    serviceDomain: 'solana-hiroshima',
    apiKey: 'bj79M3WN9aaimsX660YK3etnSoz53lvgXO4Y',
    endpoint: 'toppage' // APIエンドポイント名
};

// microCMSからFeatureデータを取得
async function loadFeaturesFromMicroCMS() {
    try {
        const response = await fetch(`https://${MICROCMS_CONFIG.serviceDomain}.microcms.io/api/v1/${MICROCMS_CONFIG.endpoint}`, {
            headers: {
                'X-MICROCMS-API-KEY': MICROCMS_CONFIG.apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        renderFeatures(data);
        
    } catch (error) {
        console.error('microCMSからのデータ取得に失敗しました:', error);
        // フォールバック: 既存のHTMLをそのまま使用
        console.log('既存のHTMLコンテンツを使用します');
    }
}

// Featureセクションを動的に生成
function renderFeatures(data) {
    const featuresGrid = document.querySelector('.features-grid');
    if (!featuresGrid) return;

    // 既存のコンテンツをクリア
    featuresGrid.innerHTML = '';

    // 3つのフィーチャーを生成
    for (let i = 1; i <= 3; i++) {
        const title = data[`featurestitle${i}`] || `フィーチャー${i}`;
        const description = data[`featuresdescription${i}`] || `フィーチャー${i}の説明`;
        const imageUrl = data[`featuresimage${i}`]?.url || '';
        
        // デフォルト画像のパス（フォールバック用）
        const defaultImages = [
            'images/一人一人にあったケア.png',
            'images/訪問介護だからこそできること.png',
            'images/安心のサポート体制.png'
        ];
        
        // デフォルトアイコン
        const defaultIcons = ['👤', '🏠', '💝'];
        
        const featureCard = document.createElement('div');
        featureCard.className = 'feature-card';
        
        featureCard.innerHTML = `
            <div class="feature-icon">
                <img src="${imageUrl || defaultImages[i-1]}" 
                     alt="${title}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="icon-placeholder" style="display: none;">
                    <span class="placeholder-icon">${defaultIcons[i-1]}</span>
                </div>
            </div>
            <h5 class="feature-title">${title}</h5>
            <p class="feature-description">${description}</p>
        `;
        
        featuresGrid.appendChild(featureCard);
    }
}
