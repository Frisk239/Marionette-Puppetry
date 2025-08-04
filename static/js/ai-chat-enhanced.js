// 终极简化版AI问答系统 - 100%调用DeepSeek API + 加载状态管理
class AIChatSystem {
    constructor() {
        this.isLoading = false;
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
                if (e.key === 'Enter' && !this.isLoading) {
                    this.sendMessage();
                }
            });
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => {
                if (!this.isLoading) {
                    this.sendMessage();
                }
            });
        }

        // 悬浮聊天
        const floatingInput = document.getElementById('floatingChatInput');
        if (floatingInput) {
            floatingInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !this.isLoading) {
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
                if (!this.isLoading) {
                    this.toggleFloatingChat();
                }
            });
        }
    }

    toggleFloatingChat() {
        const floatingWindow = document.getElementById('floatingChatWindow');
        if (floatingWindow) {
            floatingWindow.classList.toggle('active');
        }
    }

    setLoadingState(isLoading) {
        this.isLoading = isLoading;
        
        // 更新主界面按钮
        const sendButton = document.getElementById('sendButton');
        const chatInput = document.getElementById('chatInput');
        
        if (sendButton) {
            sendButton.disabled = isLoading;
            sendButton.innerHTML = isLoading ? '<div class="loading-spinner"></div>' : '发送';
        }
        
        if (chatInput) {
            chatInput.disabled = isLoading;
        }
        
        // 更新预设问题按钮状态
        const presetQuestions = document.querySelectorAll('.preset-question');
        presetQuestions.forEach(btn => {
            btn.style.pointerEvents = isLoading ? 'none' : 'auto';
            btn.style.opacity = isLoading ? '0.6' : '1';
        });
        
        // 更新悬浮聊天输入
        const floatingInput = document.getElementById('floatingChatInput');
        if (floatingInput) {
            floatingInput.disabled = isLoading;
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const messagesContainer = document.getElementById('chatMessages');
        
        if (!input || !messagesContainer || this.isLoading) return;

        const message = input.value.trim();
        if (!message) return;

        this.setLoadingState(true);

        // 添加用户消息
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
            this.addMessage('抱歉，暂时无法连接到AI服务，请检查网络后重试。', 'bot', messagesContainer);
        } finally {
            this.setLoadingState(false);
        }
    }

    async sendFloatingMessage() {
        const input = document.getElementById('floatingChatInput');
        const messagesContainer = document.getElementById('floatingChatMessages');
        
        if (!input || !messagesContainer || this.isLoading) return;

        const message = input.value.trim();
        if (!message) return;

        this.setLoadingState(true);

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
        } finally {
            this.setLoadingState(false);
        }
    }

    // 预设问题快速提问 - 直接调用AI + 加载状态
    async askPresetQuestion(question) {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer || this.isLoading) return;

        this.setLoadingState(true);

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
        } finally {
            this.setLoadingState(false);
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
    if (window.aiChatSystem && !window.aiChatSystem.isLoading) {
        window.aiChatSystem.sendMessage();
    }
}

function sendFloatingMessage() {
    if (window.aiChatSystem && !window.aiChatSystem.isLoading) {
        window.aiChatSystem.sendFloatingMessage();
    }
}

function toggleFloatingChat() {
    if (window.aiChatSystem && !window.aiChatSystem.isLoading) {
        window.aiChatSystem.toggleFloatingChat();
    }
}

function askQuestion(question) {
    if (window.aiChatSystem && !window.aiChatSystem.isLoading) {
        window.aiChatSystem.askPresetQuestion(question);
    }
}

// 初始化系统
document.addEventListener('DOMContentLoaded', function() {
    window.aiChatSystem = new AIChatSystem();
});
