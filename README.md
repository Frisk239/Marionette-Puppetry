# 闽南木偶戏AI数字博物馆

一个融合传统闽南木偶戏文化与现代AI技术的互动式网站，致力于传承和推广这一珍贵的非物质文化遗产。

## 🎭 项目特色

- **虚拟戏台体验**：在线操控木偶，体验传统技艺
- **AI智慧问答**：与AI木偶大师对话，深入了解文化知识
- **文化长廊**：系统展示木偶戏的历史、技艺与传承
- **影像资料库**：珍贵的表演视频与图片展示
- **故事创作工坊**：AI辅助创作木偶戏剧本

## 🚀 技术架构

### 前端技术栈
- **HTML5 + CSS3**：响应式布局，传统中国风设计
- **JavaScript ES6+**：交互功能与动画效果
- **SVG动画**：木偶控制与动作展示
- **现代Web API**：语音识别、本地存储等

### 后端技术栈
- **Python Flask**：轻量级Web框架
- **SQLite**：本地数据库存储知识库
- **RESTful API**：前后端数据交互
- **AI集成**：预留Moonshot/DeepSeek/阿里云API接口

### 数据库设计
- **puppet_knowledge**：木偶戏知识库
- **user_sessions**：用户交互记录
- **puppet_actions**：木偶动作数据
- **story_templates**：故事模板

## 📁 项目结构

```
marionette-puppetry/
├── app.py                 # Flask主应用
├── requirements.txt       # Python依赖
├── README.md             # 项目说明
├── marionette.db         # SQLite数据库
├── static/
│   ├── css/
│   │   ├── traditional.css    # 传统中国风样式
│   │   ├── animations.css     # 动画效果
│   │   ├── interactive.css    # 虚拟戏台样式
│   │   └── chat.css          # 聊天界面样式
│   ├── js/
│   │   ├── main.js           # 主要功能
│   │   ├── puppet-control.js # 木偶控制
│   │   └── ai-chat.js        # AI聊天功能
│   ├── images/              # 图片资源
│   └── videos/              # 视频资源
├── templates/
│   ├── base.html           # 基础模板
│   ├── index.html          # 首页
│   ├── culture.html        # 文化长廊
│   ├── interactive.html    # 虚拟戏台
│   ├── ai_chat.html        # 智慧问答
│   └── gallery.html        # 影像资料
└── api/
    ├── __init__.py
    ├── ai_services.py      # AI服务集成
    └── puppet_api.py       # 木偶API
```

## 🎯 核心功能

### 1. 虚拟戏台
- **实时木偶控制**：通过滑块控制木偶关节
- **预设动作**：一键执行传统动作套路
- **AI故事生成**：根据主题自动生成剧本
- **触摸支持**：移动端手势控制

### 2. AI智慧问答
- **知识库查询**：基于SQLite的本地知识库
- **智能对话**：模拟木偶大师对话
- **快速提问**：预设常见问题
- **语音输入**：支持语音识别（浏览器支持时）

### 3. 文化展示
- **历史时间线**：从唐代到现代的发展历程
- **制作工艺**：选材、雕刻、彩绘、组装全流程
- **名家大师**：李天禄、陈锡煌等传承人介绍
- **经典剧目**：水浒传、三国演义等传统剧目

### 4. 影像资料
- **分类展示**：表演、工艺、大师、剧目四大类别
- **响应式布局**：支持网格和列表两种视图
- **灯箱效果**：大图查看与详情展示
- **懒加载**：优化图片加载性能

## 🛠️ 快速开始

### 环境要求
- Python 3.7+
- Flask 2.3+
- 现代浏览器（支持ES6+）

### 安装步骤

1. **克隆项目**
```bash
git clone [项目地址]
cd marionette-puppetry
```

2. **安装依赖**
```bash
pip install -r requirements.txt
```

3. **运行应用**
```bash
python app.py
```

4. **访问网站**
打开浏览器访问：http://localhost:5000

### 开发模式
```bash
# 使用Flask开发服务器
export FLASK_ENV=development
python app.py
```

## 🔧 AI集成配置

### 添加API Keys
在`config.py`中添加您的API密钥：

```python
# Moonshot API
MOONSHOT_API_KEY = "your-moonshot-key"

# DeepSeek API
DEEPSEEK_API_KEY = "your-deepseek-key"

# 阿里云DashScope
DASHSCOPE_API_KEY = "your-dashscope-key"
```

### 启用AI功能
取消注释`app.py`中的相关代码，替换为实际的API调用。

## 📱 响应式设计

- **桌面端**：完整功能体验
- **平板端**：优化触控操作
- **手机端**：简化界面，核心功能优先

## 🎨 设计特色

- **传统中国风**：红色、金色主色调，书法字体
- **现代交互**：平滑动画，直观操作
- **文化沉浸**：传统纹样，古典氛围
- **无障碍支持**：键盘导航，屏幕阅读器友好

## 📊 性能优化

- **懒加载**：图片和视频按需加载
- **缓存策略**：静态资源长期缓存
- **压缩优化**：CSS/JS文件压缩
- **响应式图片**：不同屏幕适配

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

### 开发建议
1. 保持传统与现代平衡的设计理念
2. 优化移动端用户体验
3. 丰富知识库内容
4. 提升AI对话质量

## 📄 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 🙏 致谢

- 闽南木偶戏传承人提供的文化指导
- 开源社区的技术支持
- 所有为非遗文化传承做出贡献的人们

---

**让传统艺术在数字时代焕发新生！**
