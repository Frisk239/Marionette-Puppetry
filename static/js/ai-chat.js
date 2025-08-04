// AI聊天功能JavaScript

class AIChat {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sessionId = 'chat_' + Date.now();
        this.knowledgeData = [];
        
        this.init();
    }
    
    async init() {
        await this.loadKnowledge();
        this.setupEventListeners();
        this.displayKnowledge();
    }
    
    async loadKnowledge() {
        try {
            const response = await fetch('/api/knowledge');
            this.knowledgeData = await response.json();
        } catch (error) {
            console.error('加载知识库失败:', error);
        }
    }
    
    setupEventListeners() {
        // 发送消息事件
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // 防止输入框为空时发送
        this.messageInput.addEventListener('input', () => {
            const sendBtn = document.querySelector('.send-btn');
            sendBtn.disabled = !this.messageInput.value.trim();
        });
    }
    
    async sendMessage(message = null) {
        const userMessage = message || this.messageInput.value.trim();
        
        if (!userMessage) return;
        
        // 添加用户消息
        this.addMessage(userMessage, 'user');
        
        // 清空输入框
        if (!message) {
            this.messageInput.value = '';
        }
        
        // 显示加载状态
        this.showLoading();
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    session_id: this.sessionId
                })
            });
            
            const data = await response.json();
            this.hideLoading();
            this.addMessage(data.answer, 'bot', data.source);
            
        } catch (error) {
            console.error('发送消息失败:', error);
            this.hideLoading();
            this.addMessage('抱歉，暂时无法回答您的问题，请稍后重试。', 'bot');
        }
    }
    
    addMessage(text, sender, source = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const time = new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        let avatarSrc = sender === 'user' 
            ? "{{ url_for('static', filename='images/user-avatar.jpg') }}"
            : "{{ url_for('static', filename='images/master-avatar.jpg') }}";
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="${avatarSrc}" alt="${sender === 'user' ? '用户' : '大师'}">
            </div>
            <div class="message-content">
                <p>${this.formatMessage(text)}</p>
                ${source ? `<span class="message-source">来源: ${source === 'local' ? '知识库' : 'AI生成'}</span>` : ''}
                <span class="message-time">${time}</span>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    formatMessage(text) {
        // 简单的消息格式化
        return text
            .replace(/\n/g, '<br>')
            .replace(/【(.+?)】/g, '<strong>$1</strong>')
            .replace(/《(.+?)》/g, '<em>《$1》</em>');
    }
    
    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot loading';
        loadingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="{{ url_for('static', filename='images/master-avatar.jpg') }}" alt="大师">
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(loadingDiv);
        this.scrollToBottom();
    }
    
    hideLoading() {
        const loadingDiv = this.chatMessages.querySelector('.loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    // 快速提问功能
    sendQuickQuestion(question) {
        this.sendMessage(question);
    }
    
    // 知识库功能
    displayKnowledge(category = null) {
        const contentDiv = document.getElementById('knowledgeContent');
        
        if (this.knowledgeData.length === 0) {
            contentDiv.innerHTML = '<p>知识库加载中...</p>';
            return;
        }
        
        let filteredData = category 
            ? this.knowledgeData.filter(item => item.category === category)
            : this.knowledgeData;
        
        contentDiv.innerHTML = '';
        
        filteredData.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'knowledge-item';
            itemDiv.innerHTML = `
                <h4>${item.question}</h4>
                <p>${item.answer}</p>
                <button class="ask-btn" onclick="chat.sendMessage('${item.question}')">
                    询问这个问题
                </button>
            `;
            contentDiv.appendChild(itemDiv);
        });
    }
    
    // 过滤知识
    filterKnowledge(category) {
        this.displayKnowledge(category);
        
        // 高亮选中的分类
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active');
        });
        
        event.target.closest('.category-card').classList.add('active');
    }
    
    // 语音输入功能（模拟）
    startVoiceInput() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.lang = 'zh-CN';
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onstart = () => {
                this.messageInput.placeholder = '正在聆听...';
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.messageInput.value = transcript;
                this.messageInput.placeholder = '请输入您的问题...';
            };
            
            recognition.onerror = (event) => {
                console.error('语音识别错误:', event.error);
                this.messageInput.placeholder = '语音识别失败，请手动输入...';
            };
            
            recognition.start();
        } else {
            alert('您的浏览器不支持语音识别功能');
        }
    }
}

// 全局函数
function sendQuickQuestion(question) {
    if (window.chat) {
        window.chat.sendQuickQuestion(question);
    }
}

function filterKnowledge(category) {
    if (window.chat) {
        window.chat.filterKnowledge(category);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.chat = new AIChat();
    
    // 添加语音输入按钮（如果支持）
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const voiceBtn = document.createElement('button');
        voiceBtn.className = 'voice-btn';
        voiceBtn.innerHTML = '🎤';
        voiceBtn.title = '语音输入';
        voiceBtn.onclick = () => window.chat.startVoiceInput();
        
        const inputContainer = document.querySelector('.input-container');
        inputContainer.appendChild(voiceBtn);
    }
    
    // 添加消息历史记录
    const historyBtn = document.createElement('button');
    historyBtn.className = 'history-btn';
    historyBtn.textContent = '历史记录';
    historyBtn.onclick = () => showChatHistory();
    
    const chatInterface = document.querySelector('.chat-interface');
    chatInterface.appendChild(historyBtn);
});

// 显示聊天历史
async function showChatHistory() {
    try {
        const response = await fetch(`/api/chat-history?session_id=${window.chat.sessionId}`);
        const history = await response.json();
        
        // 创建模态框显示历史
        const modal = document.createElement('div');
        modal.className = 'history-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>聊天历史</h3>
                <div class="history-list">
                    ${history.map(item => `
                        <div class="history-item">
                            <strong>问:</strong> ${item.user}<br>
                            <strong>答:</strong> ${item.bot}
                        </div>
                    `).join('')}
                </div>
                <button onclick="this.parentElement.parentElement.remove()">关闭</button>
            </div>
        `;
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('获取历史记录失败:', error);
    }
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .typing-indicator span {
        width: 8px;
        height: 8px;
        background-color: #999;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing {
        0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .message-source {
        font-size: 0.8em;
        color: #666;
        margin-right: 10px;
    }
    
    .voice-btn, .history-btn {
        background: none;
        border: none;
        font-size: 1.2em;
        cursor: pointer;
        padding: 5px;
        margin-left: 5px;
    }
    
    .history-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 10px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .history-item {
        padding: 10px;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
    }
    
    .knowledge-item {
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin-bottom: 10px;
    }
    
    .ask-btn {
        background: var(--primary-red);
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9em;
    }
    
    .category-card.active {
        background: var(--gold);
        color: var(--ink-black);
    }
`;
document.head.appendChild(style);
