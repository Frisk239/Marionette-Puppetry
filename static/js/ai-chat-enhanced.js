// 简化版AI问答系统 - 100%调用DeepSeek API
class AIChatSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFloatingChat();
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
            // 直接调用后端API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            this.addMessage(data.answer, 'bot', messagesContainer);
        } catch (error) {
            console.error('API调用失败:', error);
            this.addMessage('抱歉，暂时无法连接到AI服务，请检查网络后重试。', 'bot', messagesContainer);
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
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            this.addMessage(data.answer, 'bot', messagesContainer);
        } catch (error) {
            console.error('API调用失败:', error);
            this.addMessage('抱歉，暂时无法连接到AI服务。', 'bot', messagesContainer);
        }
    }

    // 预设问题快速提问 - 直接调用AI
    async askPresetQuestion(question) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        // 添加用户消息
        this.addMessage(question, 'user', messagesContainer);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: question })
            });

            const data = await response.json();
            this.addMessage(data.answer, 'bot', messagesContainer);
        } catch (error) {
            console.error('API调用失败:', error);
            this.addMessage('抱歉，暂时无法连接到AI服务。', 'bot', messagesContainer);
        }
    }

    addMessage(text, type, container) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const avatar = type === 'user' ? '👤' : '🎭';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${this.formatMessage(text)}</div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    formatMessage(text) {
        return text.replace(/\n/g, '<br>');
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
