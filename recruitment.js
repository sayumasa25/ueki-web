/**
 * 求人募集ページ - microCMS連携
 * APIエンドポイント: recruitment
 */

class RecruitmentManager {
    constructor() {
        this.apiKey = 'bj79M3WN9aaimsX660YK3etnSoz53lvgXO4Y';
        this.serviceId = 'solana-hiroshima';
        this.endpoint = 'recruitment';
        this.baseUrl = `https://${this.serviceId}.microcms.io/api/v1/${this.endpoint}`;
        
        console.log('RecruitmentManager初期化:', {
            serviceId: this.serviceId,
            endpoint: this.endpoint,
            baseUrl: this.baseUrl
        });
    }

    /**
     * microCMSから求人データを取得
     */
    async fetchRecruitmentData() {
        console.log('求人データ取得開始:', this.baseUrl);
        
        try {
            const response = await fetch(this.baseUrl, {
                headers: {
                    'X-MICROCMS-API-KEY': this.apiKey
                }
            });

            console.log('APIレスポンス:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('APIエラー詳細:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('求人データを取得しました:', data);
            return data.contents || [];
        } catch (error) {
            console.error('求人データの取得に失敗しました:', {
                error: error.message,
                stack: error.stack,
                url: this.baseUrl
            });
            return null;
        }
    }

    /**
     * 職種カードのHTMLを生成
     */
    generateJobCard(jobData) {
        // パートの場合
        if (jobData.part) {
            return `
                <div class="job-card">
                    <h3 class="job-title">パート</h3>
                    <div class="job-details">
                        <div class="job-item">
                            <h4>概要</h4>
                            <p>${jobData.partoverview || 'データなし'}</p>
                        </div>
                        <div class="job-item">
                            <h4>時給</h4>
                            <p>${jobData.partsalary || 'データなし'}</p>
                        </div>
                        <div class="job-item">
                            <h4>その他手当</h4>
                            <p>${jobData.partothers || 'データなし'}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // 正職員（フルタイム）の場合
        if (jobData.fulltime) {
            return `
                <div class="job-card">
                    <h3 class="job-title">正職員（フルタイム）</h3>
                    <div class="job-details">
                        <div class="job-item">
                            <h4>概要</h4>
                            <p>${jobData.fulltimeoverview || 'データなし'}</p>
                        </div>
                        <div class="job-item">
                            <h4>月給</h4>
                            <p>${jobData.fulltimesalary || 'データなし'}</p>
                        </div>
                        <div class="job-item">
                            <h4>その他待遇</h4>
                            <p>${jobData.fulltimeothers || 'データなし'}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // 正社員（サービス提供責任者）の場合
        if (jobData.responsible) {
            return `
                <div class="job-card">
                    <h3 class="job-title">正社員（サービス提供責任者）</h3>
                    <div class="job-details">
                        <div class="job-item">
                            <h4>概要</h4>
                            <p>${jobData.responsibleoverview || 'データなし'}</p>
                        </div>
                        <div class="job-item">
                            <h4>月給</h4>
                            <p>${jobData.responsiblesalary || 'データなし'}</p>
                        </div>
                        <div class="job-item">
                            <h4>その他待遇</h4>
                            <p>${jobData.responsibleothers || 'データなし'}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        return '';
    }

    /**
     * 求人職種セクションを更新
     */
    async updateJobPositions() {
        console.log('求人職種セクション更新開始');
        
        const jobPositionsContainer = document.querySelector('.job-positions');
        if (!jobPositionsContainer) {
            console.error('求人職種コンテナが見つかりません (.job-positions)');
            console.log('利用可能な要素:', document.querySelectorAll('[class*="job"]'));
            return;
        }

        console.log('求人職種コンテナが見つかりました:', jobPositionsContainer);

        // ローディング表示
        jobPositionsContainer.innerHTML = '<div class="loading" style="text-align: center; padding: 20px;">求人情報を読み込み中...</div>';

        try {
            const recruitmentData = await this.fetchRecruitmentData();
            
            console.log('取得したデータ:', recruitmentData);
            
            if (!recruitmentData || recruitmentData.length === 0) {
                console.log('データが空またはnullのため、フォールバックコンテンツを表示');
                // フォールバック: 静的データを表示
                this.showFallbackContent(jobPositionsContainer);
                return;
            }

            // 動的にコンテンツを生成
            let jobCardsHtml = '';
            recruitmentData.forEach((jobData, index) => {
                console.log(`求人データ ${index + 1}:`, jobData);
                const cardHtml = this.generateJobCard(jobData);
                console.log(`生成されたカードHTML ${index + 1}:`, cardHtml);
                jobCardsHtml += cardHtml;
            });

            if (jobCardsHtml) {
                console.log('動的コンテンツを表示');
                jobPositionsContainer.innerHTML = jobCardsHtml;
            } else {
                console.log('生成されたHTMLが空のため、フォールバックコンテンツを表示');
                this.showFallbackContent(jobPositionsContainer);
            }

        } catch (error) {
            console.error('求人情報の更新に失敗しました:', error);
            this.showFallbackContent(jobPositionsContainer);
        }
    }

    /**
     * フォールバック用の静的コンテンツを表示
     */
    showFallbackContent(container) {
        container.innerHTML = `
            <!-- パート -->
            <div class="job-card">
                <h3 class="job-title">パート</h3>
                <div class="job-details">
                    <div class="job-item">
                        <h4>概要</h4>
                        <p>試用期間あり<br>期間１ヶ月（状況によって前後あり）<br>試用期間中 時給1,050円</p>
                    </div>
                    <div class="job-item">
                        <h4>時給</h4>
                        <p><strong>1,320円〜</strong></p>
                        <ul>
                            <li>基本給：855円／1時間</li>
                            <li>処遇改善手当：465円／1時間</li>
                            <li>夜勤手当：3,000円／1回（別途処遇改善手当加算あり）</li>
                            <li>日祝勤務手当：100円／1時間（上限あり）</li>
                            <li>介護福祉士手当：30円／1時間（資格所持者）</li>
                        </ul>
                    </div>
                    <div class="job-item">
                        <h4>その他手当</h4>
                        <p>・誕生日手当あり<br>・訪問先への実距離手当を支給　20円／1ｋｍあたり<br>・通勤手当　実費支給（上限なし）</p>
                    </div>
                </div>
            </div>

            <!-- 正職員（フルタイム） -->
            <div class="job-card">
                <h3 class="job-title">正職員（フルタイム）</h3>
                <div class="job-details">
                    <div class="job-item">
                        <h4>概要</h4>
                        <p>試用期間あり<br>期間１ヶ月（状況によって前後あり）<br>試用期間中　時間給1,050円</p>
                    </div>
                    <div class="job-item">
                        <h4>月給</h4>
                        <p><strong>221,000円〜</strong></p>
                        <ul>
                            <li>基本給：150,000円〜175,000円</li>
                            <li>処遇改善手当：71,000円〜90,000円</li>
                            <li>夜勤手当：3,000円／1回（別途処遇改善手当加算あり）</li>
                            <li>日祝勤務手当：500円～1,000円／1回</li>
                            <li>介護福祉士手当：5,000円／月（介護福祉士資格所持者）</li>
                        </ul>
                    </div>
                    <div class="job-item">
                        <h4>その他待遇</h4>
                        <p>・誕生日手当あり<br>・訪問先への実距離手当を支給　20円／1ｋｍあたり<br>・休日　週休2日<br>・通勤手当　実費支給（上限なし）<br>・昇給制度あり<br>・賞与あり　計 2.00ヶ月分（前年度実績）</p>
                    </div>
                </div>
            </div>

            <!-- 正社員（サービス提供責任者） -->
            <div class="job-card">
                <h3 class="job-title">正社員（サービス提供責任者）</h3>
                <div class="job-details">
                    <div class="job-item">
                        <h4>概要</h4>
                        <p>試用期間あり<br>期間１ヶ月（状況によって前後あり）<br>試用期間中　時間給1,050円</p>
                    </div>
                    <div class="job-item">
                        <h4>月給</h4>
                        <p><strong>260,000円〜</strong></p>
                        <ul>
                            <li>基本給：160,000円</li>
                            <li>処遇改善手当：100,000円</li>
                            <li>夜勤手当：3,000円／1回（別途処遇改善手当加算あり）</li>
                            <li>日祝勤務手当：500円～1,000円／1回</li>
                            <li>介護福祉士手当：5,000円／月（介護福祉士資格所持者）</li>
                        </ul>
                    </div>
                    <div class="job-item">
                        <h4>その他待遇</h4>
                        <p>・誕生日手当あり<br>・訪問先への実距離手当を支給　20円／1ｋｍあたり<br>・休日　週休2日<br>・通勤手当　実費支給（上限なし）<br>・昇給制度あり<br>・賞与あり　計 2.00ヶ月分（前年度実績）</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 初期化
     */
    init() {
        // DOMが読み込まれた後に実行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.updateJobPositions();
            });
        } else {
            this.updateJobPositions();
        }
    }
}

// 求人管理システムを初期化
console.log('recruitment.js が読み込まれました');

try {
    const recruitmentManager = new RecruitmentManager();
    console.log('RecruitmentManager インスタンスを作成しました');
    recruitmentManager.init();
    console.log('RecruitmentManager を初期化しました');
} catch (error) {
    console.error('RecruitmentManager の初期化に失敗しました:', error);
}
