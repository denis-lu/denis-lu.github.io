# 陆昊辰的个人主页

> 一个展示技术实力、创意和个性的交互式个人主页

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?logo=github)](https://denis-lu.github.io)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Animation-blue?logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-orange?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)

## 📖 项目简介

这是一个综合运用现代Web技术构建的交互式个人主页，旨在展示我的技术能力、学习经历和个人特色。通过这个项目，我深度实践了前端开发的核心技术，包括DOM操作、事件处理、CSS动画、异步编程、面向对象设计等，同时集成了多个第三方库和现代Web API。

### 🎯 项目目标

- **技术展示**：通过实际项目展示对前端技术的掌握程度
- **个人品牌**：构建专业的数字名片，为未来的职业发展做准备
- **学习实践**：在真实项目中应用所学知识，提升编程能力
- **创意表达**：通过交互设计和视觉效果展现个人特色

## ✨ 已实现功能

### 📋 功能总览表

| 阶段 | 模块 | 功能名称 | 技术实现 | 特色亮点 |
|------|------|----------|----------|----------|
| **第一阶段** | 核心功能 | 🌓 日夜模式切换 | CSS变量 + `classList.toggle()` | 平滑过渡动画，本地存储偏好 |
| | | ⌨️ 动态打字机标题 | 自定义`TypewriterEffect`类 | 光标闪烁，响应式适配 |
| | | 📊 GitHub项目展示 | GitHub API + 面向对象设计 | 智能筛选，平滑过滤动画 |
| **第二阶段** | 选修模块A | 📈 动态技能条 | Intersection Observer API | 滚动触发，渐进式动画 |
| | | | 技能雷达图 | Chart.js集成 | 多维度数据可视化 |
| | 选修模块B | 📅 互动时间轴 | 自定义时间轴组件 | 悬停卡片，点击展开详情 |
| | | | 🗺️ 足迹地图 | Leaflet.js地图库 | 自定义标记，交互弹窗 |
| | 选修模块C | 📝 Markdown | Marked.js解析器 | 无后端，动态内容加载 |
| **第三阶段** | 创意彩蛋 | 🎮 Konami Code游戏 | 键盘事件 + Canvas API | 隐藏触发，完整贪吃蛇游戏 |

### 🔧 技术实现详情

| 功能模块 | 核心技术 | 第三方库/API | 代码组织 |
|----------|----------|--------------|----------|
| **主题系统** | CSS变量、DOM操作 | - | 全局主题管理 |
| **打字机效果** | setTimeout、字符串操作 | - | `TypewriterEffect`类 |
| **项目展示** | Fetch API、事件委托 | GitHub API | `ProjectCard`、`GitHubProjectsManager`类 |
| **数据可视化** | Intersection Observer | Chart.js | `SkillsVisualization`类 |
| **时间轴** | DOM操作、事件处理 | - | `InteractiveTimeline`类 |
| **地图功能** | 地图API集成 | Leaflet.js | `TravelMap`类 |
| **Markdown解析** | Fetch API、文本处理 | Marked.js | 动态内容加载 |
| **游戏系统** | Canvas API、游戏逻辑 | - | `KonamiCode`、`SnakeGame`类 |

## 🎯 最大挑战与解决方案

### 挑战1：GitHub API限流问题
**问题描述**：GitHub API有请求频率限制，在开发过程中经常遇到403错误。

**解决方案**：
- 申请GitHub Personal Access Token提高请求限制

### 挑战2：复杂动画的时序控制
**问题描述**：项目筛选动画需要精确控制淡出、清空、淡入的时序，避免动画重叠和闪烁。

**解决方案**：
- 使用状态标志位防止动画重叠
- 精确计算动画时间，确保前一个动画完全结束后再开始下一个
- 实现动画队列机制，支持动画取消和重新开始
- 使用CSS transition和JavaScript结合的方式实现流畅动画

### 挑战3：响应式设计中的细节适配
**问题描述**：在不同设备上，特别是移动端，时间轴、地图、游戏等组件的布局和交互需要精细调整。

**解决方案**：
- 使用CSS媒体查询实现断点式响应式设计
- 针对移动端优化触摸交互和手势操作
- 调整字体大小、间距、动画时长等细节参数

### 挑战4：第三方库的集成与主题适配
**问题描述**：Chart.js、Leaflet.js等第三方库需要与自定义主题系统完美融合。

**解决方案**：
- 深入研究第三方库的配置选项和API
- 实现动态主题更新机制，支持运行时主题切换
- 使用CSS变量和JavaScript动态修改库的配置
- 创建统一的主题管理类，集中处理所有组件的主题更新


## 🛠️ 技术栈

### 核心技术
- **HTML5**：语义化标签，无障碍设计
- **CSS3**：CSS变量、Flexbox、Grid布局、动画效果
- **JavaScript ES6+**：类、模块、异步编程、DOM操作

### 第三方库
- **Bootstrap 5**：响应式UI框架
- **Chart.js**：数据可视化图表库
- **Leaflet.js**：交互式地图库
- **Marked.js**：Markdown解析器
- **MathJax**：数学公式渲染
- **js-yaml**：YAML文件解析

### 现代Web API
- **Intersection Observer API**：滚动触发动画
- **Fetch API**：异步数据获取
- **Canvas API**：游戏图形渲染
- **LocalStorage**：主题偏好存储

## 🎨 设计特色

### 视觉设计
- **响应式布局**：适配桌面端、平板和移动设备
- **主题系统**：支持浅色/深色主题切换
- **动画效果**：丰富的CSS动画和过渡效果
- **现代UI**：卡片式设计、渐变背景、阴影效果

### 交互设计
- **平滑动画**：所有交互都有流畅的动画反馈
- **用户反馈**：悬停效果、点击反馈、加载状态
- **无障碍设计**：键盘导航支持、语义化标签

## 🚀 项目亮点

### 1. 技术深度
- **面向对象编程**：使用ES6类组织代码结构
- **异步编程**：熟练运用Promise、async/await处理异步操作
- **API集成**：GitHub API、地图API等第三方服务集成
- **性能优化**：事件委托、防抖节流、懒加载等优化技术

### 2. 用户体验
- **响应式设计**：完美适配各种设备尺寸
- **主题切换**：用户友好的日夜模式切换
- **交互反馈**：丰富的动画和视觉反馈
- **隐藏彩蛋**：增加趣味性的隐藏功能

### 3. 代码质量
- **模块化设计**：功能分离，代码结构清晰
- **错误处理**：完善的异常处理机制
- **可维护性**：注释完整，代码可读性强
- **可扩展性**：易于添加新功能和修改现有功能

## 📁 项目结构

```
denis-lu.github.io/
├── index.html              # 主页面
├── static/
│   ├── css/
│   │   ├── main.css        # 主样式文件
│   │   └── styles.css      # Bootstrap样式
│   ├── js/
│   │   ├── scripts.js      # 主要JavaScript逻辑
│   │   ├── bootstrap.bundle.min.js
│   │   ├── js-yaml.min.js
│   │   └── tex-svg.js
│   └── assets/
│       ├── img/
│       │   ├── background.jpg
│       │   └── photo.png
│       └── favicon.ico
├── contents/
│   ├── home.md            # 首页内容
│   ├── awards.md          # 获奖经历
│   ├── skills.md          # 技能介绍
│   ├── experience.md      # 工作经历
│   ├── projects.md        # 项目介绍
│   ├── skills-data.yml    # 技能数据配置
│   ├── timeline-data.yml  # 时间轴数据配置
│   └── travel-data.yml    # 地图数据配置
└── README.md              # 项目说明文档
```

## 🚀 快速开始

### 本地运行
1. 克隆仓库：
```bash
git clone https://github.com/denis-lu/denis-lu.github.io.git
cd denis-lu.github.io
```

2. 使用本地服务器运行（推荐）：
```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx serve .

# 使用Live Server (VS Code扩展)
# 右键index.html选择"Open with Live Server"
```

3. 访问 `http://localhost:8000` 查看效果

### 部署到GitHub Pages
1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择源分支（通常是main或master）
4. 访问 `https://你的用户名.github.io` 查看在线版本

## 🔧 自定义配置

### 修改个人信息
- 编辑 `contents/` 目录下的Markdown文件
- 修改 `contents/skills-data.yml` 调整技能数据
- 更新 `contents/timeline-data.yml` 修改时间轴内容
- 编辑 `contents/travel-data.yml` 自定义地图标记

### 主题定制
- 修改 `static/css/main.css` 中的CSS变量
- 调整颜色方案、字体、间距等样式
- 添加新的动画效果和交互样式

### 功能扩展
- 在 `static/js/scripts.js` 中添加新的功能类
- 集成其他第三方库和API
- 实现新的交互效果和动画

## 📄 许可证

本项目采用 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📞 联系方式

- **邮箱**：1874840037@qq.com / lhc5316@gmail.com
- **GitHub**：[@denis-lu](https://github.com/denis-lu)
- **个人主页**：[https://denis-lu.github.io](https://denis-lu.github.io)

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！

*最后更新：2025年9月2日*