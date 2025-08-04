// 智慧问答系统 - 集成DeepSeek API和本地知识库
class AIChatSystem {
    constructor() {
        this.apiKey = 'sk-f9b90ddbfb2c47cc8a8d4532298515d6';
        this.baseUrl = 'https://api.deepseek.com';
        this.model = 'deepseek-chat';
        this.systemPrompt = `你是一个专业的闽南木偶戏文化专家，精通木偶戏的历史、技艺、人物、剧目和文化意义。请用简洁、准确、生动的中文回答用户的问题，并提供相关的文化背景知识。

回答风格要求：
1. 语言亲切自然，避免过于学术化
2. 适当加入有趣的历史故事或文化背景
3. 对于复杂问题，分点说明，条理清晰
4. 回答长度控制在100-200字之间
5. 可以推荐相关的经典剧目或学习资源`;

        this.localKnowledge = null;
        this.init();
    }

    async init() {
        await this.loadLocalKnowledge();
        this.setupEventListeners();
        this.setupFloatingChat();
    }

    async loadLocalKnowledge() {
        try {
            const response = await fetch('/api/knowledge');
            this.localKnowledge = await response.json();
            console.log('本地知识库已加载:', this.localKnowledge.length, '条记录');
        } catch (error) {
            console.error('加载本地知识库失败:', error);
            this.localKnowledge = [];
        }
    }

    setupEventListeners() {
        // 主聊天界面
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }

        // 悬浮聊天
        const floatingInput = document.getElementById('floatingChatInput');
        if (floatingInput) {
            floatingInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendFloatingMessage();
                }
            });
        }
    }

    setupFloatingChat() {
        const floatingBall = document.getElementById('aiFloatingBall');
        const floatingWindow = document.getElementById('floatingChatWindow');
        
        if (floatingBall && floatingWindow) {
            floatingBall.addEventListener('click', () => {
                this.toggleFloatingChat();
            });
        }
    }

    toggleFloatingChat() {
        const floatingWindow = document.getElementById('floatingChatWindow');
        if (floatingWindow) {
            floatingWindow.classList.toggle('active');
        }
    }

    // 从本地知识库查找答案
    findLocalAnswer(question) {
        if (!this.localKnowledge) return null;

        // 精确匹配
        const exactMatch = this.localKnowledge.find(item => 
            item.question.toLowerCase().includes(question.toLowerCase()) ||
            question.toLowerCase().includes(item.question.toLowerCase())
        );
        
        if (exactMatch) return exactMatch.answer;

        // 关键词匹配
        const keywords = question.toLowerCase().split(/[，。！？\s]/);
        for (const item of this.localKnowledge) {
            const itemKeywords = item.keywords ? item.keywords.toLowerCase().split(/[，\s]/) : [];
            const itemQuestion = item.question.toLowerCase();
            
            for (const keyword of keywords) {
                if (keyword && (itemKeywords.includes(keyword) || itemQuestion.includes(keyword))) {
                    return item.answer;
                }
            }
        }

        return null;
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const button = document.getElementById('sendButton');
        const messagesContainer = document.getElementById('chatMessages');
        
        if (!input || !messagesContainer) return;

        const message = input.value.trim();
        if (!message) return;

        // 禁用按钮，显示加载状态
        button.disabled = true;
        button.innerHTML = '<div class="loading-spinner"></div>';

        // 添加用户消息
        this.addMessage(message, 'user', messagesContainer);
        input.value = '';

        try {
            // 先检查本地知识库
            const localAnswer = this.findLocalAnswer(message);
            if (localAnswer) {
                this.addMessage(localAnswer, 'bot', messagesContainer, '本地知识库');
            } else {
                // 调用DeepSeek API
                const response = await this.callDeepSeekAPI(message);
                this.addMessage(response, 'bot', messagesContainer, 'AI专家');
            }
        } catch (error) {
            console.error('获取答案失败:', error);
            this.addMessage('抱歉，暂时无法回答您的问题。请稍后再试。', 'bot', messagesContainer);
        } finally {
            button.disabled = false;
            button.innerHTML = '发送';
        }
    }

    async sendFloatingMessage() {
        const input = document.getElementById('floatingChatInput');
        const messagesContainer = document.getElementById('floatingChatMessages');
        
        if (!input || !messagesContainer) return;

        const message = input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user', messagesContainer);
        input.value = '';

        try {
            // 先检查本地知识库
            const localAnswer = this.findLocalAnswer(message);
            if (localAnswer) {
                this.addMessage(localAnswer, 'bot', messagesContainer, '本地知识库');
            } else {
                // 调用DeepSeek API
                const response = await this.callDeepSeekAPI(message);
                this.addMessage(response, 'bot', messagesContainer, 'AI专家');
            }
        } catch (error) {
            console.error('获取答案失败:', error);
            this.addMessage('抱歉，暂时无法回答您的问题。', 'bot', messagesContainer);
        }
    }

    // 快速提问 - 使用本地知识库
    async askPresetQuestion(question) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        // 添加用户消息
        this.addMessage(question, 'user', messagesContainer);

        try {
            // 直接从本地知识库查找
            const localAnswer = this.findLocalAnswer(question);
            if (localAnswer) {
                this.addMessage(localAnswer, 'bot', messagesContainer, '本地知识库');
            } else {
                // 如果本地没有，再调用API
                const response = await this.callDeepSeekAPI(question);
                this.addMessage(response, 'bot', messagesContainer, 'AI专家');
            }
        } catch (error) {
            console.error('获取答案失败:', error);
            this.addMessage('抱歉，暂时无法回答您的问题。', 'bot', messagesContainer);
        }
    }

    async callDeepSeekAPI(message) {
        const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: this.systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 300,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessage(text, type, container, source = '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const avatar = type === 'user' ? '👤' : '🎭';
        
        let sourceTag = '';
        if (source && type === 'bot') {
            sourceTag = `<small style="opacity: 0.7; font-size: 0.8em;">📚 ${source}</small><br>`;
        }
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                ${sourceTag}${this.formatMessage(text)}
            </div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    formatMessage(text) {
        // 简单的文本格式化
        return text.replace(/\n/g, '<br>');
    }

    // 更新预设问题的点击事件
    updatePresetQuestions() {
        const presetQuestions = document.querySelectorAll('.preset-question');
        presetQuestions.forEach(question => {
            question.addEventListener('click', (e) => {
                e.preventDefault();
                const text = question.getAttribute('data-question') || question.textContent;
                this.askPresetQuestion(text);
            });
        });
    }
}

// 全局函数
function sendMessage() {
    if (window.aiChatSystem) {
        window.aiChatSystem.sendMessage();
    }
}

function sendFloatingMessage() {
    if (window.aiChatSystem) {
        window.aiChatSystem.sendFloatingMessage();
    }
}

function toggleFloatingChat() {
    if (window.aiChatSystem) {
        window.aiChatSystem.toggleFloatingChat();
    }
}

function askQuestion(question) {
    if (window.aiChatSystem) {
        window.aiChatSystem.askPresetQuestion(question);
    }
}

// 初始化系统
document.addEventListener('DOMContentLoaded', function() {
    window.aiChatSystem = new AIChatSystem();
});
