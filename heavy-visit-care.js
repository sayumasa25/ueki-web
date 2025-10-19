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

    // microCMS連携機能
    loadCostLimitsFromMicroCMS();
});

// microCMS設定
const MICROCMS_CONFIG = {
    serviceDomain: 'solana-hiroshima',
    apiKey: 'bj79M3WN9aaimsX660YK3etnSoz53lvgXO4Y',
    endpoint: 'heavy-visit-care' // APIエンドポイント名
};

// microCMSから自己負担上限データを取得
async function loadCostLimitsFromMicroCMS() {
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
        renderCostLimits(data);
        
    } catch (error) {
        console.error('microCMSからのデータ取得に失敗しました:', error);
        // フォールバック: 既存のHTMLをそのまま使用
        console.log('既存のHTMLコンテンツを使用します');
    }
}

// 自己負担上限セクションを動的に生成
function renderCostLimits(data) {
    const limitCards = document.querySelector('.limit-cards');
    const noteElement = document.querySelector('.cost-limits .note');
    
    if (!limitCards) return;

    // 既存のコンテンツをクリア
    limitCards.innerHTML = '';

    // 3つのカードを生成
    const cardData = [
        {
            title: data.welfare || '生活保護・市民税非課税世帯',
            price: data.welfaremoney || '0円'
        },
        {
            title: data.municipaltax || '市民税課税（所得割16万円未満）',
            price: data.municipaltaxmoney || '9,300円'
        },
        {
            title: data.others || '上記以外',
            price: data.othersmoney || '37,200円'
        }
    ];

    // カードを生成
    cardData.forEach(card => {
        const limitCard = document.createElement('div');
        limitCard.className = 'limit-card';
        
        limitCard.innerHTML = `
            <h4>${card.title}</h4>
            <div class="price">${card.price}</div>
        `;
        
        limitCards.appendChild(limitCard);
    });

    // 補足説明を更新
    if (noteElement && data.supplement) {
        noteElement.innerHTML = data.supplement;
    }
}
