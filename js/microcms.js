// microCMS設定
const MICROCMS_API_KEY = 'bj79M3WN9aaimsX660YK3etnSoz53lvgXO4Y';
const MICROCMS_SERVICE_DOMAIN = 'solana-hiroshima'; // ソラナ広島のサービスドメイン
const MICROCMS_API_URL = `https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/toppage`;

// microCMSからデータを取得する関数
async function fetchHomepageData() {
    try {
        const response = await fetch(MICROCMS_API_URL, {
            headers: {
                'X-MICROCMS-API-KEY': MICROCMS_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('microCMSからのデータ取得に失敗しました:', error);
        return null;
    }
}

// コンセプトセクションを更新する関数
function updateConceptSection(data) {
    // コンセプトタイトル
    const conceptHeading = document.querySelector('.concept-heading');
    if (conceptHeading && data.concepttitle) {
        conceptHeading.textContent = data.concepttitle;
    }

    // コンセプト説明文
    const conceptDescription = document.querySelector('.concept-description');
    if (conceptDescription && data.conceptdescription) {
        conceptDescription.textContent = data.conceptdescription;
    }

    // コンセプト画像
    const conceptImage = document.querySelector('.concept-image img');
    if (conceptImage && data.conceptimage) {
        conceptImage.src = data.conceptimage.url;
        conceptImage.alt = data.concepttitle || 'コンセプト画像';
    }
}

// グリーティングセクションを更新する関数
function updateGreetingSection(data) {
    // グリーティングタイトル
    const greetingTitle = document.querySelector('.greeting .section-title');
    if (greetingTitle && data.greetingtitle) {
        greetingTitle.textContent = data.greetingtitle;
    }

    // 管理者写真
    const managerPhoto = document.querySelector('.greeting-image img');
    if (managerPhoto && data.managerPhoto) {
        managerPhoto.src = data.managerPhoto.url;
        managerPhoto.alt = '管理者';
    }
}

// フィーチャーセクションを更新する関数
function updateFeaturesSection(data) {
    const featureCards = document.querySelectorAll('.feature-card');
    
    // フィーチャー1
    if (featureCards[0]) {
        const title1 = featureCards[0].querySelector('.feature-title');
        const description1 = featureCards[0].querySelector('.feature-description');
        const image1 = featureCards[0].querySelector('.feature-icon img');
        
        if (title1 && data.featuretitle1) title1.textContent = data.featuretitle1;
        if (description1 && data.featuredescription1) description1.textContent = data.featuredescription1;
        if (image1 && data.featureimage1) {
            image1.src = data.featureimage1.url;
            image1.alt = data.featuretitle1 || '特徴1';
        }
    }

    // フィーチャー2
    if (featureCards[1]) {
        const title2 = featureCards[1].querySelector('.feature-title');
        const description2 = featureCards[1].querySelector('.feature-description');
        const image2 = featureCards[1].querySelector('.feature-icon img');
        
        if (title2 && data.featuretitle2) title2.textContent = data.featuretitle2;
        if (description2 && data.featuredescription2) description2.textContent = data.featuredescription2;
        if (image2 && data.featureimage2) {
            image2.src = data.featureimage2.url;
            image2.alt = data.featuretitle2 || '特徴2';
        }
    }

    // フィーチャー3
    if (featureCards[2]) {
        const title3 = featureCards[2].querySelector('.feature-title');
        const description3 = featureCards[2].querySelector('.feature-description');
        const image3 = featureCards[2].querySelector('.feature-icon img');
        
        if (title3 && data.featuretitle3) title3.textContent = data.featuretitle3;
        if (description3 && data.featuredescription3) description3.textContent = data.featuredescription3;
        if (image3 && data.featureimage3) {
            image3.src = data.featureimage3.url;
            image3.alt = data.featuretitle3 || '特徴3';
        }
    }
}

// ページ読み込み時にmicroCMSからデータを取得して反映
document.addEventListener('DOMContentLoaded', async function() {
    console.log('microCMSからデータを取得中...');
    
    const homepageData = await fetchHomepageData();
    
    if (homepageData) {
        console.log('取得したデータ:', homepageData);
        
        // 各セクションを更新
        updateConceptSection(homepageData);
        updateGreetingSection(homepageData);
        updateFeaturesSection(homepageData);
        
        console.log('ページの更新が完了しました');
    } else {
        console.error('データの取得に失敗しました');
    }
});

// エラーハンドリング用の関数
function handleImageError(img, fallbackSrc) {
    img.onerror = function() {
        if (fallbackSrc) {
            this.src = fallbackSrc;
        } else {
            this.style.display = 'none';
        }
    };
}
