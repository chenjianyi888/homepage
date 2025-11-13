// 图片轮播功能
let currentSlide = 0;
const galleryImages = [
    {
        src: 'images/ICSPS 2023 Xian China.jpg',
        location: '中国 · 西安',
        place: 'ICSPS 2023.11'
    },
    {
        src: 'images/IVSP 2024 Ikuta Japan.jpg',
        location: '日本 · 生田',
        place: 'IVSP 2024.03'
    },
    {
        src: 'images/International Workshop on Applied Geometry and Related Topics 2025年7月14日to7月18日 IWAGRT会议 .jpg',
        location: '日本 · 川崎',
        place: 'IWAGRT 2025.07'
    },
    {
        src: 'images/Beijing202507.jpg',
        location: '中国 · 北京',
        place: 'Applied Math Workshop 2025.07'
    },
    {
        src: 'images/GlobalNetWorkshop202509.JPG',
        location: '日本 · 冈山',
        place: 'GNW 2025.09'
    }
];

// 初始化图片轮播
function initGallery() {
    const slider = document.getElementById('gallerySlider');
    if (!slider || galleryImages.length === 0) return;

    // 重置当前幻灯片索引
    currentSlide = 0;

    // 清空现有内容
    slider.innerHTML = '';

    // 创建所有图片项
    galleryImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.flexShrink = '0';
        
        // 创建img元素而不是使用innerHTML，避免特殊字符问题
        const img = document.createElement('img');
        // 直接使用原始路径，浏览器通常能处理空格和中文
        img.src = image.src;
        img.alt = image.place;
        img.className = 'gallery-image';
        
        // 添加加载状态监听
        img.onload = function() {
            console.log(`图片 ${index + 1} 加载成功:`, image.src);
            // 检查图片的实际尺寸
            console.log(`  图片尺寸: ${this.naturalWidth}x${this.naturalHeight}, 显示尺寸: ${this.width}x${this.height}`);
        };
        
        img.onerror = function() {
            console.error(`图片 ${index + 1} 加载失败，尝试URL编码:`, image.src);
            // 如果原始路径失败，尝试对文件名进行URL编码
            const pathParts = image.src.split('/');
            const fileName = pathParts.pop();
            const encodedFileName = encodeURIComponent(fileName);
            const encodedPath = pathParts.join('/') + '/' + encodedFileName;
            
            // 创建新的img元素尝试加载编码后的路径
            const testImg = new Image();
            testImg.onload = function() {
                img.src = encodedPath;
                console.log(`图片 ${index + 1} 使用编码路径成功:`, encodedPath);
            };
            testImg.onerror = function() {
                console.error(`图片 ${index + 1} 编码路径也失败:`, encodedPath);
                img.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'500\'%3E%3Crect fill=\'%23ddd\' width=\'800\' height=\'500\'/%3E%3Ctext fill=\'%23999\' font-family=\'sans-serif\' font-size=\'20\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\'%3E图片加载失败%3C/text%3E%3C/svg%3E';
            };
            testImg.src = encodedPath;
        };
        
        const caption = document.createElement('div');
        caption.className = 'gallery-caption';
        
        const locationSpan = document.createElement('span');
        locationSpan.className = 'location';
        locationSpan.textContent = image.location;
        
        const placeSpan = document.createElement('span');
        placeSpan.className = 'place-name';
        placeSpan.textContent = image.place;
        
        caption.appendChild(locationSpan);
        caption.appendChild(placeSpan);
        
        item.appendChild(img);
        item.appendChild(caption);
        
        slider.appendChild(item);
        console.log(`已添加轮播项 ${index + 1}:`, image.place);
        
        // 验证元素是否正确添加
        const addedItem = slider.lastElementChild;
        const addedImg = addedItem.querySelector('img');
        console.log(`  验证: 轮播项${index + 1}已添加，图片src=${addedImg ? addedImg.src.split('/').pop() : '未找到'}`);
    });

    console.log(`总共创建了 ${galleryImages.length} 个轮播项`);
    
    // 使用requestAnimationFrame确保DOM完全渲染后再更新位置
    requestAnimationFrame(() => {
        const items = document.querySelectorAll('.gallery-item');
        console.log('DOM渲染完成，找到', items.length, '个轮播项');
        updateGalleryPosition();
        initGalleryDots();
        console.log('轮播初始化完成，当前显示第', currentSlide + 1, '张');
    });
}

// 更新轮播位置
function updateGalleryPosition() {
    const items = document.querySelectorAll('.gallery-item');
    console.log(`更新轮播位置: currentSlide=${currentSlide}, 共有${items.length}个轮播项`);
    items.forEach((item, index) => {
        const translateX = (index - currentSlide) * 100;
        item.style.transform = `translateX(${translateX}%)`;
        const img = item.querySelector('img');
        const imgSrc = img ? img.src.split('/').pop() : '无图片';
        console.log(`  轮播项 ${index + 1} (${imgSrc}): translateX(${translateX}%)`);
        
        // 检查是否在可视区域
        if (translateX === 0) {
            console.log(`    ✓ 轮播项 ${index + 1} 当前可见`);
            // 检查图片元素的实际状态
            const img = item.querySelector('img');
            if (img) {
                const rect = img.getBoundingClientRect();
                console.log(`    图片位置: left=${rect.left}, top=${rect.top}, width=${rect.width}, height=${rect.height}`);
                console.log(`    图片complete: ${img.complete}, naturalWidth: ${img.naturalWidth}, naturalHeight: ${img.naturalHeight}`);
            }
        }
    });
    
    // 更新指示点
    updateGalleryDots();
}

// 更新轮播指示点
function updateGalleryDots() {
    const dots = document.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// 初始化轮播指示点
function initGalleryDots() {
    const dotsContainer = document.getElementById('galleryDots');
    if (!dotsContainer || galleryImages.length <= 1) return;
    
    dotsContainer.innerHTML = '';
    galleryImages.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateGalleryPosition();
            stopAutoPlay();
            startAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });
}

// 上一张
function prevSlide() {
    if (galleryImages.length === 0) return;
    currentSlide = (currentSlide - 1 + galleryImages.length) % galleryImages.length;
    updateGalleryPosition();
}

// 下一张
function nextSlide() {
    if (galleryImages.length === 0) return;
    currentSlide = (currentSlide + 1) % galleryImages.length;
    updateGalleryPosition();
}

// 自动播放（可选）
let autoPlayInterval;
function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, 5000); // 每5秒切换
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

// 学术成果排序功能
const publications = [
    {
        title: 'Graph linear canonical transform: Definition, vertex-frequency analysis and filter design',
        authors: '<strong>Jian-Yi Chen</strong>, Yu Zhang and Bing-Zhao Li',
        venue: 'IEEE Transactions on Signal Processing, 2024, 72, 5691-5707.',
        topic: '图信号处理',
        year: 2024
    },
    {
        title: 'Operator-based graph linear canonical transform',
        authors: '<strong>Jian-Yi Chen</strong> and Bing-Zhao Li',
        venue: 'Journal of the Franklin Institute, 2025, 362: 107877.',
        topic: '图信号处理',
        year: 2025
    },
    {
        title: 'The short-time Wigner-Ville distribution',
        authors: '<strong>Jian-Yi Chen</strong> and Bing-Zhao Li',
        venue: 'Signal Processing, 2024, 219: 109402.',
        topic: '线性正则变换、时频分析',
        year: 2024
    },
    {
        title: 'Wigner distribution associated with linear canonical transform of generalized 2-D analitic signals',
        authors: '<strong>Jian-Yi Chen</strong> and Bing-Zhao Li',
        venue: 'Digital Signal Processing, 2024, 149: 104481.',
        topic: '线性正则变换、时频分析',
        year: 2024
    },
    {
        title: 'Multi-dimensional graph linear canonical transform and Its Application',
        authors: '<strong>Jian-Yi Chen</strong> and Bing-Zhao Li',
        venue: 'Digital Signal Processing, 2025, 163: 105222.',
        topic: '图信号处理',
        year: 2025
    },
    {
        title: 'Parametric quaternion Wigner-Ville distribution: Definition, uncertainty principles, and application',
        authors: '<strong>Jian-Yi Chen</strong> and Bing-Zhao Li',
        venue: 'Signal, Image and Video Processing, 2025, 19(5): 359.',
        topic: '线性正则变换、时频分析',
        year: 2025
    },
    {
        title: 'Fast numerical calculation of the offset linear canonical transform',
        authors: '<strong>Jian-Yi Chen</strong> and Bing-Zhao Li',
        venue: 'J. Opt. Soc. Am. A, 2023, 40, 427-442.',
        topic: '线性正则变换、时频分析',
        year: 2023
    },
    {
        title: 'Parametric monogenic linear canonical wavelet transform',
        authors: '<strong>Jian-Yi Chen</strong> and Bing-Zhao Li',
        venue: 'Circuits, Systems, and Signal Processing, 2025, 1-22.',
        topic: '线性正则变换、时频分析',
        year: 2025
    },
    {
        title: 'The short-time Wigner-Ville distribution associated with linear canonical transform',
        authors: '<strong>Jian-Yi Chen</strong> and Bing-Zhao Li',
        venue: 'In Proceedings of ICSPS 2023, Xi\'an, China, 5 pages.',
        topic: '线性正则变换、时频分析',
        year: 2023
    },
    {
        title: 'Riesz transform associated with the linear canonical transform',
        authors: '<strong>Jian-Yi Chen</strong> and Bing-Zhao Li',
        venue: 'In Proceedings of IVSP 2024, Ikuta, Japan, 7 pages.',
        topic: '线性正则变换、时频分析',
        year: 2024
    },
    {
        title: 'A novel STAP algorithm via volume cross-correlation function on the Grassmann manifold',
        authors: 'Jia-Mian Li, <strong>Jian-Yi Chen</strong> and Bing-Zhao Li',
        venue: 'Digital Signal Processing, 2025: 105164.',
        topic: '信息几何应用',
        year: 2025
    },
    {
        title: 'The windowed two-dimensional graph fractional Fourier transform',
        authors: 'Yu-Chen Gan, <strong>Jian-Yi Chen</strong> and Bing-Zhao Li',
        venue: 'Digital Signal Processing, 2025: 105191.',
        topic: '图信号处理',
        year: 2025
    },
    {
        title: 'A Novel kind of WVD Associated with the Linear Canonical Transform',
        authors: 'Jia-Yin Peng, <strong>Jian-Yi Chen</strong> and Bing-Zhao Li',
        venue: 'In Proceedings of 2024 Asia Pacific Signal and Information Processing Association Annual Summit and Conference (APSIPA ASC). IEEE, 2024: 1-6.',
        topic: '线性正则变换、时频分析',
        year: 2024
    },
    {
        title: '一种运动过程中异常心电信号的识别方法',
        authors: '王宏洲, <strong>陈建怡</strong>, 周志雄',
        venue: '专利号：ZL202210114479.6，申请日期：2022-01-30，授权日期：2024-04-09',
        topic: '专利',
        year: 2024,
        isPatent: true
    },
    {
        title: '一种基于二维图线性正则变换的图数据压缩方法',
        authors: '<strong>陈建怡</strong>, 李炳照',
        venue: '专利号：CN202411031775.5，申请日期：2024-07-30',
        topic: '专利',
        year: 2024,
        isPatent: true
    }
];

function renderPublications(sortBy = 'time') {
    const container = document.getElementById('publicationList');
    if (!container) return;

    let sortedPubs = [...publications];
    let html = '';

    if (sortBy === 'time') {
        sortedPubs.sort((a, b) => (b.year || 0) - (a.year || 0));
        html = sortedPubs.map(pub => `
            <div class="publication-item" data-topic="${pub.topic || ''}">
                <div class="publication-content">
                    <p class="publication-title">
                        <strong>${pub.title}</strong>
                    </p>
                    <p class="publication-authors">
                        ${pub.authors}
                    </p>
                    <p class="publication-venue">
                        ${pub.venue}
                    </p>
                </div>
            </div>
        `).join('');
    } else if (sortBy === 'topic') {
        // 按主题分组
        const topicGroups = {};
        sortedPubs.forEach(pub => {
            const topic = pub.topic || '其他';
            if (!topicGroups[topic]) {
                topicGroups[topic] = [];
            }
            topicGroups[topic].push(pub);
        });

        // 对每个主题内的论文按时间排序
        Object.keys(topicGroups).forEach(topic => {
            topicGroups[topic].sort((a, b) => (b.year || 0) - (a.year || 0));
        });

        // 定义主题显示顺序
        const topicOrder = [
            '线性正则变换、时频分析',
            '图信号处理',
            '信息几何应用',
            '专利'
        ];

        // 按指定顺序排序主题
        const sortedTopics = Object.keys(topicGroups).sort((a, b) => {
            const indexA = topicOrder.indexOf(a);
            const indexB = topicOrder.indexOf(b);
            // 如果主题在顺序列表中，按顺序排序；否则放在最后
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            } else if (indexA !== -1) {
                return -1;
            } else if (indexB !== -1) {
                return 1;
            } else {
                return a.localeCompare(b);
            }
        });
        
        sortedTopics.forEach((topic, topicIndex) => {
            const pubs = topicGroups[topic];
            html += `<div class="publication-topic-header">${topic}</div>`;
            html += pubs.map(pub => `
                <div class="publication-item" data-topic="${pub.topic || ''}">
                    <div class="publication-content">
                        <p class="publication-title">
                            <strong>${pub.title}</strong>
                        </p>
                        <p class="publication-authors">
                            ${pub.authors}
                        </p>
                        <p class="publication-venue">
                            ${pub.venue}
                        </p>
                    </div>
                </div>
            `).join('');
        });
    }

    container.innerHTML = html;
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 更新最后更新时间
function updateLastModified() {
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        lastUpdate.textContent = `${year}年${month}月`;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化图片轮播
    initGallery();

    // 绑定轮播按钮
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }

    // 鼠标悬停时暂停自动播放
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        galleryContainer.addEventListener('mouseenter', stopAutoPlay);
        galleryContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // 初始化出版物列表
    renderPublications();

    // 绑定排序按钮
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const sortBy = this.getAttribute('data-sort');
            renderPublications(sortBy);
        });
    });

    // 初始化平滑滚动
    initSmoothScroll();

    // 更新最后修改时间
    updateLastModified();

    // 开始自动播放（可选）
    if (galleryImages.length > 1) {
        startAutoPlay();
    }
});

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

