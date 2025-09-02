// Dynamic Typewriter Effect
class TypewriterEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = options.typeSpeed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.showCursor = options.showCursor !== false;
        
        // 使用CSS动画实现光标，避免DOM操作问题
        if (this.showCursor) {
            this.element.classList.add('css-typewriter');
        }
        
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            // 删除字符
            const displayText = currentText.substring(0, this.currentCharIndex - 1);
            this.updateDisplay(displayText);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 500); // 短暂停顿后开始下一句
                return;
            }
            
            setTimeout(() => this.type(), this.deleteSpeed);
        } else {
            // 添加字符
            const displayText = currentText.substring(0, this.currentCharIndex + 1);
            this.updateDisplay(displayText);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                // 完成当前文本，准备删除
                setTimeout(() => {
                    this.isDeleting = true;
                    this.type();
                }, this.pauseTime);
                return;
            }
            
            setTimeout(() => this.type(), this.typeSpeed);
        }
    }
    
    updateDisplay(text) {
        // 简化实现，使用textContent直接设置文本，让CSS处理光标
        this.element.textContent = text;
    }
    
    // 清理方法
    destroy() {
        if (this.showCursor) {
            this.element.classList.remove('css-typewriter');
        }
    }
}

// ProjectCard Class for rendering individual project cards
class ProjectCard {
    constructor(repo) {
        this.name = repo.name;
        this.description = repo.description || '暂无描述';
        this.language = repo.language || '未指定';
        this.htmlUrl = repo.html_url;
        this.starCount = repo.stargazers_count || 0;
        this.forkCount = repo.forks_count || 0;
        this.updatedAt = repo.updated_at;
        this.isPrivate = repo.private;
    }
    
    render() {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-language', this.language);
        
        // Format last updated date
        const lastUpdated = new Date(this.updatedAt).toLocaleDateString('zh-CN');
        
        card.innerHTML = `
            <h3><a href="${this.htmlUrl}" target="_blank" rel="noopener noreferrer">${this.name}</a></h3>
            <p class="description">${this.description}</p>
            <div class="project-meta">
                <span class="language-tag">${this.language}</span>
                <div class="project-stats">
                    <span><i class="bi bi-star"></i> ${this.starCount}</span>
                    <span><i class="bi bi-diagram-3"></i> ${this.forkCount}</span>
                </div>
            </div>
            <div class="project-info" style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-color); opacity: 0.6;">
                最后更新: ${lastUpdated}
            </div>
        `;
        
        return card;
    }
}

// GitHub API Integration
class GitHubProjectsManager {
    constructor(username = 'denis-lu', githubToken = null) {
        this.username = username;
        this.repositories = [];
        this.filteredRepositories = [];
        this.currentFilter = 'all';
        this.githubToken = githubToken; // GitHub Personal Access Token
        this.isAnimating = false; // 防止动画重叠的标志
        this.animationTimeout = null; // 存储动画超时ID
    }
    
    // Fetch repositories from GitHub API
    async fetchRepositories() {
        try {
            const projectsContainer = document.getElementById('projects-container');
            projectsContainer.innerHTML = '<div class="loading">正在加载项目数据...</div>';
            
            // Setup request headers with optional authentication
            const headers = {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Personal-Website'
            };
            
            if (this.githubToken) {
                headers['Authorization'] = `token ${this.githubToken}`;
            }
            
            const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`, {
                headers: headers
            });
            
            if (!response.ok) {
                throw new Error(`GitHub API 请求失败，状态码：${response.status}`);
            }
            
            const repositories = await response.json();
            
            // Filter out private repositories and sort by updated date
            this.repositories = repositories
                .filter(repo => !repo.private)
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            
            this.filteredRepositories = [...this.repositories];
            
            return this.repositories;
        } catch (error) {
            console.error('获取仓库数据时出错：', error);
            const projectsContainer = document.getElementById('projects-container');
            projectsContainer.innerHTML = `
                <div class="loading">
                    <p>无法加载项目数据：${error.message}</p>
                    <p>请检查网络连接或GitHub用户名是否正确</p>
                    <p>如果遇到403错误，可能需要配置GitHub Personal Access Token</p>
                </div>
            `;
            return [];
        }
    }
    
    // Render project cards
    renderProjects(repositories = this.filteredRepositories) {
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';
        
        if (repositories.length === 0) {
            projectsContainer.innerHTML = '<div class="loading">暂无项目数据</div>';
            return;
        }
        
        repositories.forEach((repo, index) => {
            const projectCard = new ProjectCard(repo);
            const cardElement = projectCard.render();
            
            // Add fade-in animation for initial load
            cardElement.classList.add('fade-in');
            // Add staggered animation delay
            cardElement.style.animationDelay = `${index * 0.1}s`;
            
            projectsContainer.appendChild(cardElement);
        });
    }
    
    // Render project cards with fade-in animation for filtering
    renderProjectsWithAnimation(repositories = this.filteredRepositories) {
        const projectsContainer = document.getElementById('projects-container');
        
        if (repositories.length === 0) {
            projectsContainer.innerHTML = '<div class="loading">暂无项目数据</div>';
            return;
        }
        
        repositories.forEach((repo, index) => {
            const projectCard = new ProjectCard(repo);
            const cardElement = projectCard.render();
            
            // 确保卡片有fade-in类
            cardElement.classList.add('fade-in');
            // 添加错开的动画延迟，使用较短的间隔让动画感觉更流畅
            cardElement.style.animationDelay = `${index * 0.05}s`;
            
            projectsContainer.appendChild(cardElement);
        });
    }
    
    // Extract unique languages and create filter buttons
    createFilterButtons() {
        const languages = new Set();
        this.repositories.forEach(repo => {
            if (repo.language) {
                languages.add(repo.language);
            }
        });
        
        const sortedLanguages = Array.from(languages).sort();
        const filterContainer = document.getElementById('filter-container');
        filterContainer.innerHTML = '';
        
        // Create "All" button
        const allButton = document.createElement('button');
        allButton.textContent = '全部';
        allButton.className = 'filter-button active';
        allButton.setAttribute('data-language', 'all');
        filterContainer.appendChild(allButton);
        
        // Create language-specific buttons
        sortedLanguages.forEach(language => {
            const button = document.createElement('button');
            button.textContent = language;
            button.className = 'filter-button';
            button.setAttribute('data-language', language);
            filterContainer.appendChild(button);
        });
        
        this.addFilterEventListeners();
    }
    
    // Add event listeners for filter buttons
    addFilterEventListeners() {
        const filterContainer = document.getElementById('filter-container');
        
        // Use event delegation for better performance
        filterContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-button')) {
                const selectedLanguage = event.target.getAttribute('data-language');
                this.filterProjects(selectedLanguage);
                this.updateActiveButton(event.target);
            }
        });
    }
    
    // Filter projects by language with animation
    filterProjects(language) {
        // 如果正在进行动画，清除之前的超时
        if (this.isAnimating && this.animationTimeout) {
            clearTimeout(this.animationTimeout);
            this.animationTimeout = null;
            // 确保按钮在新动画开始前被重新启用
            this.toggleFilterButtons(false);
        }
        
        // 如果正在动画且筛选条件相同，直接返回
        if (this.isAnimating && this.currentFilter === language) {
            this.toggleFilterButtons(false); // 确保按钮被启用
            return;
        }
        
        this.currentFilter = language;
        this.isAnimating = true; // 设置动画标志
        this.toggleFilterButtons(true); // 禁用按钮
        
        if (language === 'all') {
            this.filteredRepositories = [...this.repositories];
        } else {
            this.filteredRepositories = this.repositories.filter(repo => repo.language === language);
        }
        
        const projectsContainer = document.getElementById('projects-container');
        const existingCards = document.querySelectorAll('.project-card');
        
        // 如果没有现有卡片，直接渲染新内容
        if (existingCards.length === 0) {
            this.renderProjects();
            this.isAnimating = false;
            this.toggleFilterButtons(false);
            return;
        }
        
        // 开始淡出动画
        existingCards.forEach((card, index) => {
            card.classList.remove('fade-in');
            card.classList.add('fade-out');
            // 使用反向顺序，让最后的卡片先淡出
            const reverseIndex = existingCards.length - 1 - index;
            card.style.animationDelay = `${reverseIndex * 0.02}s`;
        });
        
        // 计算动画时间：最大延迟 + 动画持续时间 + 额外缓冲时间
        const maxDelay = Math.max(0, (existingCards.length - 1) * 0.02 * 1000);
        const animationDuration = 500; // CSS动画持续时间
        const bufferTime = 100; // 额外缓冲时间
        const fadeOutTime = maxDelay + animationDuration + bufferTime;
        
        // 等待淡出完成后清空并渲染新内容
        this.animationTimeout = setTimeout(() => {
            // 清空容器
            projectsContainer.innerHTML = '';
            
            // 立即渲染新卡片（带淡入动画）
            this.renderProjectsWithAnimation();
            
            // 重置状态
            this.isAnimating = false;
            this.toggleFilterButtons(false);
            this.animationTimeout = null;
        }, fadeOutTime);
    }
    
    // Update active button styling
    updateActiveButton(activeButton) {
        document.querySelectorAll('.filter-button').forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    // 禁用/启用过滤按钮
    toggleFilterButtons(disabled) {
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.disabled = disabled;
            if (disabled) {
                button.style.opacity = '0.6';
                button.style.cursor = 'not-allowed';
            } else {
                button.style.opacity = '';
                button.style.cursor = '';
            }
        });
    }
    
    // Set GitHub token for authentication
    setGithubToken(token) {
        this.githubToken = token;
    }
    
    // Initialize the entire GitHub projects system
    async initialize() {
        await this.fetchRepositories();
        if (this.repositories.length > 0) {
            this.renderProjects();
            this.createFilterButtons();
        }
    }
}

// Initialize GitHub Projects functionality
async function initializeGitHubProjects() {
    const githubToken = null;
    
    const githubManager = new GitHubProjectsManager('denis-lu', githubToken);
    await githubManager.initialize();
}

// Skills Visualization Class
class SkillsVisualization {
    constructor() {
        this.skillsAnimated = false;
        this.radarChart = null;
        this.observer = null;
        this.skillsData = null;
        this.init();
    }

    async init() {
        await this.loadSkillsData();
        this.createIntersectionObserver();
        this.observeSkillsSection();
    }

    // 加载技能数据
    async loadSkillsData() {
        try {
            const response = await fetch('contents/skills-data.yml');
            const yamlText = await response.text();
            this.skillsData = jsyaml.load(yamlText);
        } catch (error) {
            console.error('Failed to load skills data:', error);
            // 使用默认数据
            this.skillsData = {
                skill_bars: [
                    { name: 'JavaScript', percentage: 90 },
                    { name: 'Python', percentage: 85 },
                    { name: 'Java', percentage: 80 }
                ],
                radar_chart: {
                    labels: ['前端开发', '后端开发', '数据库'],
                    data: [85, 90, 75]
                }
            };
        }
    }

    // 创建Intersection Observer
    createIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3 // 当技能区域30%可见时触发
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.skillsAnimated) {
                    this.animateSkillBars();
                    this.createRadarChart();
                    this.skillsAnimated = true;
                }
            });
        }, options);
    }

    // 观察技能区域
    observeSkillsSection() {
        const skillsSection = document.getElementById('skills-bars');
        if (skillsSection) {
            this.observer.observe(skillsSection);
        }
    }

    // 生成并动画技能条
    animateSkillBars() {
        const container = document.getElementById('skills-bars-container');
        if (!container || !this.skillsData || !this.skillsData.skill_bars) return;
        
        // 清空容器
        container.innerHTML = '';
        
        // 为每个技能创建技能条
        this.skillsData.skill_bars.forEach((skill, index) => {
            const skillBar = document.createElement('div');
            skillBar.className = 'skill-bar';
            skillBar.setAttribute('data-skill', skill.name);
            skillBar.setAttribute('data-percentage', skill.percentage);
            
            skillBar.innerHTML = `
                <div class="skill-info">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-percentage">${skill.percentage}%</span>
                </div>
                <div class="skill-progress">
                    <div class="skill-fill"></div>
                </div>
            `;
            
            container.appendChild(skillBar);
            
            // 为每个技能条添加延迟动画
            setTimeout(() => {
                skillBar.classList.add('animate');
                
                const skillFill = skillBar.querySelector('.skill-fill');
                
                // 延迟一点开始填充动画，让入场动画先完成
                setTimeout(() => {
                    skillFill.style.width = skill.percentage + '%';
                }, 200);
                
            }, index * 150); // 每个技能条间隔150ms
        });
    }

    // 创建雷达图
    createRadarChart() {
        const ctx = document.getElementById('skillsRadarChart');
        if (!ctx || !this.skillsData || !this.skillsData.radar_chart) return;

        // 雷达图数据
        const radarData = {
            labels: this.skillsData.radar_chart.labels,
            datasets: [{
                label: '技能水平',
                data: this.skillsData.radar_chart.data,
                backgroundColor: 'rgba(57, 72, 210, 0.2)',
                borderColor: 'rgba(57, 72, 210, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(57, 72, 210, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        };

        const config = {
            type: 'radar',
            data: radarData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        min: 0,
                        ticks: {
                            stepSize: 20,
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() + '20'
                        },
                        angleLines: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() + '30'
                        },
                        pointLabels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim(),
                            font: {
                                size: 12,
                                family: 'Arial, sans-serif'
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutCubic'
                }
            }
        };

        this.radarChart = new Chart(ctx, config);

        // 为雷达图容器添加动画
        const radarContainer = document.querySelector('.radar-chart-container');
        if (radarContainer) {
            setTimeout(() => {
                radarContainer.classList.add('animate');
            }, 800); // 在技能条动画完成后开始
        }
    }

    // 更新主题颜色
    updateThemeColors() {
        if (this.radarChart) {
            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
            
            this.radarChart.options.scales.r.ticks.color = textColor;
            this.radarChart.options.scales.r.grid.color = textColor + '20';
            this.radarChart.options.scales.r.angleLines.color = textColor + '30';
            this.radarChart.options.scales.r.pointLabels.color = textColor;
            
            this.radarChart.update();
        }
    }

    // 清理方法
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.radarChart) {
            this.radarChart.destroy();
        }
    }
}

// 互动式时间轴类
class InteractiveTimeline {
    constructor() {
        this.descriptionCard = null;
        this.currentExpandedItem = null;
        this.timelineData = null;
        this.init();
    }

    async init() {
        await this.loadTimelineData();
        this.renderTimeline();
        this.createDescriptionCard();
        this.addEventListeners();
    }

    // 加载时间轴数据
    async loadTimelineData() {
        try {
            const response = await fetch('contents/timeline-data.yml');
            const yamlText = await response.text();
            this.timelineData = jsyaml.load(yamlText);
        } catch (error) {
            console.error('加载时间轴数据失败:', error);
            this.timelineData = {
                timeline: {
                    title: "我的人生轨迹",
                    events: []
                }
            };
        }
    }

    // 渲染时间轴
    renderTimeline() {
        const container = document.getElementById('life-timeline');
        if (!container || !this.timelineData) return;

        const timelineConfig = this.timelineData.timeline;
        
        container.innerHTML = `
            <h3 class="timeline-title">${timelineConfig.title}</h3>
            <div class="timeline">
                <div class="timeline-line"></div>
                ${this.renderTimelineItems(timelineConfig.events)}
            </div>
        `;
    }

    // 渲染时间轴项目
    renderTimelineItems(events) {
        return events.map((event, index) => {
            const futureClass = event.type === 'future' ? ' future' : '';
            const yearDisplay = event.year === 'Future' ? '未来' : event.year;
            
            return `
                <div class="timeline-item" data-side="${event.side}">
                    <div class="timeline-dot${futureClass}" 
                         data-year="${event.year}" 
                         data-title="${event.title}" 
                         data-description="${event.description}" 
                         data-details="${event.details}">
                        <span class="timeline-year">${yearDisplay}</span>
                        <div class="timeline-content">
                            <h4>${event.title}</h4>
                            <p>${event.description}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 创建悬停描述卡片
    createDescriptionCard() {
        this.descriptionCard = document.createElement('div');
        this.descriptionCard.className = 'timeline-description-card';
        document.body.appendChild(this.descriptionCard);
    }

    // 添加事件监听器
    addEventListeners() {
        const timelineDots = document.querySelectorAll('.timeline-dot');
        
        timelineDots.forEach(dot => {
            // 鼠标悬停显示描述卡片
            dot.addEventListener('mouseenter', (e) => this.showDescriptionCard(e));
            dot.addEventListener('mouseleave', () => this.hideDescriptionCard());
            
            // 点击展开/收起详细信息
            dot.addEventListener('click', (e) => this.toggleDetails(e));
        });

        // 点击其他地方收起详细信息
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.timeline-dot') && !e.target.closest('.timeline-details')) {
                this.collapseAllDetails();
            }
        });
    }

    // 显示描述卡片
    showDescriptionCard(event) {
        const dot = event.currentTarget;
        const description = dot.getAttribute('data-description');
        const title = dot.getAttribute('data-title');
        const year = dot.getAttribute('data-year');
        
        if (!description) return;

        this.descriptionCard.innerHTML = `
            <h5 style="margin: 0 0 0.5rem 0; color: var(--h-title-color); font-size: 0.95rem;">${year} - ${title}</h5>
            <p style="margin: 0; color: var(--text-color);">${description}</p>
        `;

        // 计算卡片位置
        const rect = dot.getBoundingClientRect();
        const timelineItem = dot.closest('.timeline-item');
        const side = timelineItem.getAttribute('data-side');
        
        if (side === 'left') {
            this.descriptionCard.style.left = (rect.left - 320) + 'px';
        } else {
            this.descriptionCard.style.left = (rect.right + 20) + 'px';
        }
        
        this.descriptionCard.style.top = (rect.top + window.scrollY - 10) + 'px';
        
        // 显示卡片
        setTimeout(() => {
            this.descriptionCard.classList.add('show');
        }, 50);
    }

    // 隐藏描述卡片
    hideDescriptionCard() {
        this.descriptionCard.classList.remove('show');
    }

    // 切换详细信息展开/收起
    toggleDetails(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const dot = event.currentTarget;
        const timelineItem = dot.closest('.timeline-item');
        const details = dot.getAttribute('data-details');
        
        if (!details) return;

        // 如果当前项已展开，则收起
        if (this.currentExpandedItem === timelineItem) {
            this.collapseDetails(timelineItem);
            this.currentExpandedItem = null;
            return;
        }

        // 先收起其他已展开的项
        this.collapseAllDetails();

        // 展开当前项
        this.expandDetails(timelineItem, details);
        this.currentExpandedItem = timelineItem;
    }

    // 展开详细信息
    expandDetails(timelineItem, details) {
        // 检查是否已存在详细信息区域
        let detailsElement = timelineItem.querySelector('.timeline-details');
        
        if (!detailsElement) {
            detailsElement = document.createElement('div');
            detailsElement.className = 'timeline-details';
            detailsElement.innerHTML = `<p>${details}</p>`;
            
            const timelineContent = timelineItem.querySelector('.timeline-content');
            timelineContent.appendChild(detailsElement);
        }

        // 添加展开动画
        setTimeout(() => {
            detailsElement.classList.add('expanded');
        }, 50);

        // 平滑滚动到详细信息
        setTimeout(() => {
            detailsElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });
        }, 300);
    }

    // 收起详细信息
    collapseDetails(timelineItem) {
        const detailsElement = timelineItem.querySelector('.timeline-details');
        if (detailsElement) {
            detailsElement.classList.remove('expanded');
        }
    }

    // 收起所有展开的详细信息
    collapseAllDetails() {
        const expandedDetails = document.querySelectorAll('.timeline-details.expanded');
        expandedDetails.forEach(detail => {
            detail.classList.remove('expanded');
        });
        this.currentExpandedItem = null;
    }

    // 清理方法
    destroy() {
        if (this.descriptionCard) {
            this.descriptionCard.remove();
        }
        // 移除事件监听器会在页面重新加载时自动清理
    }
}

// 我的足迹地图类
class TravelMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.travelData = null;
        this.init();
    }

    async init() {
        await this.loadTravelData();
        this.updateMapDescription();
        this.createMap();
        this.addMarkers();
    }

    // 加载地图数据
    async loadTravelData() {
        try {
            const response = await fetch('contents/travel-data.yml');
            const yamlText = await response.text();
            this.travelData = jsyaml.load(yamlText);
        } catch (error) {
            console.error('加载地图数据失败:', error);
            this.travelData = {
                travel_map: {
                    title: "我的足迹",
                    description: "探索我走过的城市，每个标记都有一段特别的回忆...",
                    center_coords: [35.0, 103.0],
                    default_zoom: 5,
                    cities: []
                }
            };
        }
    }

    // 更新地图描述信息
    updateMapDescription() {
        if (!this.travelData) return;
        
        const mapConfig = this.travelData.travel_map;
        // const titleElement = document.getElementById('travel-map-subtitle');
        const descElement = document.querySelector('.travel-map-description');
        
        // 标题内容以 HTML 为准，不通过 YML 设置
        // if (titleElement) {
        //     titleElement.innerHTML = `<i class="bi bi-geo-alt-fill"></i>&nbsp;${mapConfig.title}`;
        // }
        if (descElement) {
            descElement.textContent = mapConfig.description;
        }
    }

    createMap() {
        const mapContainer = document.getElementById('travel-map-canvas');
        if (!mapContainer || !this.travelData) return;

        const mapConfig = this.travelData.travel_map;

        try {
            // 创建地图实例，使用配置文件中的设置
            this.map = L.map('travel-map-canvas', {
                center: mapConfig.center_coords,
                zoom: mapConfig.default_zoom,
                maxZoom: 18,
                minZoom: 3,
                zoomControl: true,
                scrollWheelZoom: true
            });

            // 添加地图图层 - 使用OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);

            // 添加地图完全加载后的回调
            this.map.whenReady(() => {
                // Map loaded successfully
            });

        } catch (error) {
            console.error('地图初始化失败:', error);
            this.showMapError();
        }
    }

    addMarkers() {
        if (!this.map || !this.travelData) return;

        const cities = this.travelData.travel_map.cities;
        cities.forEach(city => {
            this.addCityMarker(city);
        });
    }

    addCityMarker(city) {
        try {
            // 创建自定义标记图标
            const markerHtml = `
                <div class="custom-marker ${city.type}">
                    ${city.name.charAt(0)}
                </div>
            `;

            const customIcon = L.divIcon({
                html: markerHtml,
                className: 'custom-div-icon',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -15]
            });

            // 创建标记
            const marker = L.marker(city.coords, { 
                icon: customIcon,
                title: city.name
            }).addTo(this.map);

            // 创建弹窗内容
            const popupContent = this.createPopupContent(city);
            
            // 绑定弹窗
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });

            // 添加悬停效果
            marker.on('mouseover', function() {
                this.openPopup();
            });

            // 存储标记引用
            this.markers.push(marker);

        } catch (error) {
            console.error(`添加${city.name}标记失败:`, error);
        }
    }

    createPopupContent(city) {
        let statusText = '';
        switch(city.type) {
            case 'visited':
                statusText = '✅ 已到访';
                break;
            case 'planned':
                statusText = '📅 计划前往';
                break;
            case 'special':
                statusText = '⭐ 特别回忆';
                break;
        }

        return `
            <div class="popup-content">
                <h3 class="popup-city-name">${city.name}</h3>
                <div style="color: var(--h-title-color); font-weight: 600; margin-bottom: 0.5rem;">
                    ${statusText}
                </div>
                ${city.image ? `<img src="${city.image}" alt="${city.name}" class="popup-image">` : ''}
                <p class="popup-story">${city.story}</p>
                <div class="popup-date">${city.date}</div>
            </div>
        `;
    }

    showMapError() {
        const mapContainer = document.getElementById('travel-map-canvas');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="map-loading">
                    <div style="text-align: center;">
                        <i class="bi bi-exclamation-triangle" style="font-size: 2rem; color: var(--h-title-color); margin-bottom: 1rem;"></i>
                        <p>地图加载失败</p>
                        <p style="font-size: 0.9rem; opacity: 0.7;">请检查网络连接或稍后重试</p>
                    </div>
                </div>
            `;
        }
    }

    // 响应主题切换
    updateTheme() {
        // Leaflet地图本身不需要特殊的主题更新
        // 自定义样式会通过CSS变量自动更新
    }

    // 清理方法
    destroy() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        this.markers = [];
    }
}

// 初始化技能可视化
let skillsVisualization = null;
// 初始化时间轴
let interactiveTimeline = null;
// 初始化地图
let travelMap = null;

// 定义配置变量
const content_dir = 'contents/';
const config_file = 'config.yml';
const section_names = ['home', 'awards', 'skills', 'experience', 'projects'];

// 统一的页面初始化功能
document.addEventListener('DOMContentLoaded', async function() {
    // Dark/Light Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // Check for saved theme preference or default to light theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme on page load
    if (currentTheme === 'dark') {
        body.classList.add('dark-theme');
        themeIcon.textContent = '🌙';
    } else {
        body.classList.remove('dark-theme');
        themeIcon.textContent = '☀️';
    }
    
    // Theme toggle function
    function toggleTheme() {
        // Toggle the dark-theme class on the body
        body.classList.toggle('dark-theme');
        
        // Update the icon based on current theme
        if (body.classList.contains('dark-theme')) {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        }
        
        // Update button title
        const isDark = body.classList.contains('dark-theme');
        themeToggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        
        // Update radar chart colors if it exists
        if (skillsVisualization) {
            skillsVisualization.updateThemeColors();
        }
        
        // Update travel map theme if it exists
        if (travelMap) {
            travelMap.updateTheme();
        }
    }
    
    // Add event listener to the theme toggle button
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Set initial button title
    const isDark = body.classList.contains('dark-theme');
    themeToggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    
    // Initialize Typewriter Effect
    const typewriterElement = document.getElementById('top-section-bg-text');
    if (typewriterElement) {
        const texts = [
            "你好，我是陆昊辰",
            "一名后端开发爱好者",
            "Welcome to my homepage",
            "Let's build amazing things together!"
        ];
        
        new TypewriterEffect(typewriterElement, texts, {
            typeSpeed: 120,
            deleteSpeed: 60,
            pauseTime: 2500,
            showCursor: true
        });
    }
    
    // Initialize GitHub Projects
    initializeGitHubProjects();

    // Initialize Skills Visualization (async)
    skillsVisualization = new SkillsVisualization();

    // Initialize Interactive Timeline (async)
    interactiveTimeline = new InteractiveTimeline();

    // Initialize Travel Map (async)
    travelMap = new TravelMap();

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Marked：Markdown 文本解析
    marked.use({ 
        mangle: false, 
        headerIds: false,
        gfm: true,        // 启用 GitHub Flavored Markdown
        breaks: true,     // 启用换行支持
        pedantic: false,  // 不启用严格模式
        sanitize: false,  // 不启用清理模式
        smartLists: true, // 启用智能列表
        smartypants: true // 启用智能标点
    })
    // 并行加载所有 Markdown 文件
    try {
        await Promise.all(section_names.map(async (name) => {
            try {
                const response = await fetch(content_dir + name + '.md');
                const markdown = await response.text();
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            } catch (error) {
                console.error(`Failed to load or process ${name}.md:`, error);
            }
        }));
        
        // 所有 Markdown 文件加载完成后，统一执行 MathJax 渲染
        MathJax.typeset();
    } catch (error) {
        console.error('Failed to load markdown files:', error);
    }
    
    // 初始化Konami Code（DOM加载完成后）
    konamiCode = new KonamiCode();
});

// Konami Code Easter Egg - Snake Game
class KonamiCode {
    constructor() {
        this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
                        'KeyB', 'KeyA'];
        this.userInput = [];
        this.gameVisible = false;
        this.init();
    }
    
    init() {
        // 添加键盘事件监听器
        document.addEventListener('keydown', (event) => {
            this.handleKeyInput(event);
        });
        
        // 创建游戏容器
        this.createGameContainer();
    }
    
    handleKeyInput(event) {
        // 如果游戏已经显示，不再监听Konami Code
        if (this.gameVisible) return;
        
        // 记录用户输入
        this.userInput.push(event.code);
        
        // 保持输入序列长度不超过Konami Code长度
        if (this.userInput.length > this.sequence.length) {
            this.userInput.shift();
        }
        
        // 检查是否匹配Konami Code（每次按键都检查）
        if (this.arraysEqual(this.userInput, this.sequence)) {
            this.triggerEasterEgg();
            this.userInput = []; // 重置输入序列
            return;
        }
        
        // 检查是否是序列的正确开始，如果不是就重置
        if (!this.isValidSequenceStart()) {
            // 如果当前按键是序列的第一个键，重新开始
            if (event.code === this.sequence[0]) {
                this.userInput = [event.code];
        } else {
            this.userInput = [];
            }
        }
    }
    
    isValidSequenceStart() {
        // 检查当前序列是否是正确序列的开始部分
        for (let i = 0; i < this.userInput.length; i++) {
            if (this.userInput[i] !== this.sequence[i]) {
                return false;
            }
        }
        return true;
    }
    
    arraysEqual(arr1, arr2) {
        return arr1.length === arr2.length && arr1.every((val, i) => val === arr2[i]);
    }
    
    createGameContainer() {
        // 创建游戏遮罩层
        const gameOverlay = document.createElement('div');
        gameOverlay.id = 'konami-game-overlay';
        gameOverlay.className = 'konami-game-overlay';
        
        // 创建游戏容器
        const gameContainer = document.createElement('div');
        gameContainer.id = 'konami-game-container';
        gameContainer.className = 'konami-game-container';
        
        // 游戏标题和关闭按钮
        const gameHeader = document.createElement('div');
        gameHeader.className = 'konami-game-header';
        gameHeader.innerHTML = `
            <h3>🎉 彩蛋解锁！贪吃蛇小游戏 🐍</h3>
            <button id="close-konami-game" class="close-game-btn">✕</button>
        `;
        
        // 游戏内容区域
        const gameContent = document.createElement('div');
        gameContent.className = 'konami-game-content';
        gameContent.innerHTML = `
            <div class="snake-game-info">
                <p>使用方向键或 WASD 控制小蛇移动</p>
                <button id="snake-start-btn" class="snake-control-btn">开始游戏</button>
                <button id="snake-restart-btn" class="snake-control-btn" style="display:none;">重新开始</button>
                </div>
            <div id="snake-game-map" class="snake-map"></div>
        `;
        
        gameContainer.appendChild(gameHeader);
        gameContainer.appendChild(gameContent);
        gameOverlay.appendChild(gameContainer);
        document.body.appendChild(gameOverlay);
        
        // 添加事件监听器
        this.addGameEventListeners();
    }
    
    addGameEventListeners() {
        const closeBtn = document.getElementById('close-konami-game');
        const overlay = document.getElementById('konami-game-overlay');
        
        // 关闭游戏
        closeBtn.addEventListener('click', () => {
            this.hideGame();
        });
        
        // 点击遮罩层关闭游戏
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideGame();
            }
        });
        
        // ESC键关闭游戏
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.gameVisible) {
                this.hideGame();
            }
        });
    }
    
    triggerEasterEgg() {
        this.showGame();
        
        // 显示提示信息
        this.showSuccessMessage();
        
        // 初始化贪吃蛇游戏
        setTimeout(() => {
            this.initSnakeGame();
        }, 500);
    }
    
    showSuccessMessage() {
        // 创建成功提示
        const successMsg = document.createElement('div');
        successMsg.className = 'konami-success-message';
        successMsg.innerHTML = '🎊 恭喜你发现了隐藏彩蛋！';
        document.body.appendChild(successMsg);
        
        // 3秒后移除提示
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.remove();
            }
        }, 3000);
    }
    
    showGame() {
        const overlay = document.getElementById('konami-game-overlay');
        if (!overlay) {
            return;
        }
        overlay.classList.add('show');
        this.gameVisible = true;
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
    
    hideGame() {
        const overlay = document.getElementById('konami-game-overlay');
        if (!overlay) {
            return;
        }
        overlay.classList.remove('show');
        this.gameVisible = false;
        document.body.style.overflow = ''; // 恢复滚动
        
        // 停止游戏
        if (window.snakeGameInstance) {
            window.snakeGameInstance.stopGame();
        }
    }
    
    initSnakeGame() {
        // 初始化贪吃蛇游戏实例
        window.snakeGameInstance = new SnakeGame();
    }
}

// 贪吃蛇游戏类
class SnakeGame {
    constructor() {
        this.map = document.getElementById("snake-game-map");
        this.foodElements = [];
        this.snakeElements = [];
        this.gameRunning = false;
        this.timeId = null;
        
        this.init();
    }
    
    init() {
        // 初始化食物和蛇
        this.food = new Food(this);
        this.snake = new Snake(this);
        
        // 显示初始状态
        this.food.init();
        this.snake.init();
        
        // 添加控制按钮事件
        this.addControlListeners();
    }
    
    addControlListeners() {
        const startBtn = document.getElementById('snake-start-btn');
        const restartBtn = document.getElementById('snake-restart-btn');
        
        startBtn.addEventListener('click', () => {
            this.startGame();
        });
        
        restartBtn.addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    startGame() {
        if (this.timeId != null) return; // 防止重复启动
        
        this.gameRunning = true;
        this.timeId = setInterval(() => {
            this.snake.move();
        }, 200);
        
        // 更新按钮状态
        document.getElementById('snake-start-btn').style.display = 'none';
        document.getElementById('snake-restart-btn').style.display = 'inline-block';
        
        // 添加键盘控制
        this.addKeyboardControls();
    }
    
    stopGame() {
        if (this.timeId) {
            clearInterval(this.timeId);
            this.timeId = null;
            this.gameRunning = false;
        }
        
        // 恢复按钮状态
        document.getElementById('snake-start-btn').style.display = 'inline-block';
        document.getElementById('snake-restart-btn').style.display = 'none';
        
        // 移除键盘监听
        this.removeKeyboardControls();
    }
    
    restartGame() {
        this.stopGame();
        
        // 重置蛇和食物
        this.snake.reset();
        this.food.init();
        
        // 重新开始
        this.startGame();
    }
    
    addKeyboardControls() {
        this.keyHandler = (e) => {
            if (!this.gameRunning) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    if (this.snake.direction !== "right") {
                        this.snake.direction = "left";
                    }
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    if (this.snake.direction !== "bottom") {
                        this.snake.direction = "top";
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    if (this.snake.direction !== "left") {
                        this.snake.direction = "right";
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    if (this.snake.direction !== "top") {
                        this.snake.direction = "bottom";
                    }
                    break;
            }
        };
        
        document.addEventListener('keydown', this.keyHandler);
    }
    
    removeKeyboardControls() {
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
            this.keyHandler = null;
        }
    }
    
    gameOver(message) {
        this.stopGame();
        
        setTimeout(() => {
            alert(message);
        }, 100);
    }
}

// 食物类
class Food {
    constructor(game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.width = 20;
        this.height = 20;
        this.color = "green";
    }
    
    init() {
        this.remove();
        
        const div = document.createElement("div");
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = this.color;
        div.style.position = "absolute";
        div.style.borderRadius = "50%";
        
        // 随机生成位置，避免生成在蛇身上
        do {
            this.x = parseInt(Math.random() * (this.game.map.offsetWidth / this.width));
            this.y = parseInt(Math.random() * (this.game.map.offsetHeight / this.height));
        } while (this.isOnSnake());
        
        div.style.left = this.x * this.width + "px";
        div.style.top = this.y * this.height + "px";
        
        this.game.map.appendChild(div);
        this.game.foodElements.push(div);
    }
    
    isOnSnake() {
        for (let i = 0; i < this.game.snake.body.length; i++) {
            if (this.x === this.game.snake.body[i].x && this.y === this.game.snake.body[i].y) {
                return true;
            }
        }
        return false;
    }
    
    remove() {
        this.game.foodElements.forEach(element => {
            if (element.parentNode) {
                this.game.map.removeChild(element);
            }
        });
        this.game.foodElements = [];
    }
}

// 蛇类
class Snake {
    constructor(game) {
        this.game = game;
        this.direction = "right";
        this.width = 20;
        this.height = 20;
        this.body = [
            { x: 3, y: 2, color: "red" },
            { x: 2, y: 2, color: "orange" },
            { x: 1, y: 2, color: "orange" }
        ];
    }
    
    init() {
        this.remove();
        
        this.body.forEach((segment, index) => {
            const div = document.createElement("div");
            this.game.map.appendChild(div);
            div.style.width = this.width + "px";
            div.style.height = this.height + "px";
            div.style.position = "absolute";
            div.style.backgroundColor = segment.color;
            div.style.left = segment.x * this.width + "px";
            div.style.top = segment.y * this.height + "px";
            
            // 头部圆角
            if (index === 0) {
                div.style.borderRadius = "8px";
            } else {
                div.style.borderRadius = "4px";
            }
            
            this.game.snakeElements.push(div);
        });
    }
    
    remove() {
        this.game.snakeElements.forEach(element => {
            if (element.parentNode) {
                this.game.map.removeChild(element);
            }
        });
        this.game.snakeElements = [];
    }
    
    move() {
        // 移动蛇身
        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }
        
        // 移动蛇头
        switch (this.direction) {
            case "right":
                this.body[0].x += 1;
                break;
            case "left":
                this.body[0].x -= 1;
                break;
            case "top":
                this.body[0].y -= 1;
                break;
            case "bottom":
                this.body[0].y += 1;
                break;
        }
        
        this.init(); // 重新渲染
        
        // 检查是否吃到食物
        if (this.body[0].x === this.game.food.x && this.body[0].y === this.game.food.y) {
            const last = this.body[this.body.length - 1];
            this.body.push({
                x: last.x,
                y: last.y,
                color: "orange"
            });
            this.game.food.init();
        }
        
        // 检查碰撞
        this.checkCollisions();
    }
    
    checkCollisions() {
        const maxX = this.game.map.offsetWidth / this.width;
        const maxY = this.game.map.offsetHeight / this.height;
        const headX = this.body[0].x;
        const headY = this.body[0].y;
        
        // 撞墙检查
        if (headX < 0 || headX >= maxX || headY < 0 || headY >= maxY) {
            this.game.gameOver("游戏结束！你撞到了墙壁。");
            this.reset();
            return;
        }
        
        // 撞到自己检查
        for (let i = 4; i < this.body.length; i++) {
            if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
                this.game.gameOver("游戏结束！蛇撞到了自己。");
                this.reset();
                return;
            }
        }
    }
    
    reset() {
        this.direction = "right";
        this.body = [
            { x: 3, y: 2, color: "red" },
            { x: 2, y: 2, color: "orange" },
            { x: 1, y: 2, color: "orange" }
        ];
        this.init();
    }
}

// 初始化Konami Code监听器 - 移到DOM加载完成后
let konamiCode = null;
