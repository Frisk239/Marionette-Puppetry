# 闽南木偶戏数字博物馆

一个展示闽南传统木偶戏文化的数字平台，包含影像资料、文化知识和AI互动体验。

## ✨ 主要功能

- **影像资料库**：珍贵木偶戏表演视频与图片展示
- **文化长廊**：系统展示木偶戏历史、技艺与传承
- **AI智慧问答**：与AI木偶大师对话，深入了解文化知识
- **响应式设计**：完美适配手机、平板和桌面设备

## 🚀 技术架构

### 前端技术
- HTML5 + CSS3 (Flexbox/Grid布局)
- JavaScript ES6+ (原生交互实现)
- 响应式设计 (适配所有设备)

### 后端技术
- Python Flask (轻量级Web框架)
- SQLite (本地数据存储)
- RESTful API (前后端交互)

## 📂 项目结构

```
Marionette-Puppetry/
├── app.py                 # Flask主应用
├── config.py              # 应用配置
├── requirements.txt       # Python依赖
├── static/
│   ├── css/               # 样式文件
│   │   ├── responsive.css # 响应式样式
│   │   ├── culture.css    # 文化页面样式
│   │   └── gallery.css    # 影像页面样式
│   ├── js/                # JavaScript文件
│   │   ├── main.js        # 通用功能
│   │   ├── mobile-nav.js  # 移动导航
│   │   └── gallery.js     # 影像页面交互
│   └── images/            # 图片资源
│       └── culture/       # 文化相关图片
└── templates/             # 页面模板
    ├── base.html          # 基础模板
    ├── index.html         # 首页
    ├── culture.html       # 文化长廊
    └── gallery.html       # 影像资料
```

## 🛠️ 快速开始

### 环境要求
- Python 3.7+
- Flask 2.3+

### 安装步骤
1. 克隆项目
```bash
git clone [项目地址]
cd Marionette-Puppetry
```

2. 安装依赖
```bash
pip install -r requirements.txt
```

3. 运行应用
```bash
python app.py
```

4. 访问网站
打开浏览器访问：http://localhost:5000

## 📱 响应式设计

- **移动端优先**：优化小屏幕体验
- **自适应布局**：自动适配不同设备
- **触摸友好**：大点击区域和手势支持

## 🌟 特色页面

### 影像资料
- 分类展示木偶戏相关影像
- 响应式网格布局
- 详细内容展示

### 文化长廊
- 时间线展示发展历史
- 制作工艺详解
- 名家大师介绍

## 📜 许可证

MIT License

## 🙏 致谢

- 闽南木偶戏传承人
- 文化保护机构
- 开源社区贡献者
