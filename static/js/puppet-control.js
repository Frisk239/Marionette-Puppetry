// 木偶控制JavaScript

class PuppetController {
    constructor() {
        this.puppetParts = {
            head: document.querySelector('.puppet-part.head'),
            body: document.querySelector('.puppet-part.body'),
            leftArm: document.querySelector('.puppet-part.left-arm'),
            rightArm: document.querySelector('.puppet-part.right-arm'),
            leftLeg: document.querySelector('.puppet-part.left-leg'),
            rightLeg: document.querySelector('.puppet-part.right-leg')
        };
        
        this.currentAngles = {
            head: 0,
            leftArm: 0,
            rightArm: 0,
            leftLeg: 0,
            rightLeg: 0
        };
        
        this.initControls();
        this.loadActions();
    }
    
    initControls() {
        // 手动控制滑块
        const controls = {
            head: document.getElementById('headControl'),
            leftArm: document.getElementById('leftArmControl'),
            rightArm: document.getElementById('rightArmControl'),
            leftLeg: document.getElementById('leftLegControl'),
            rightLeg: document.getElementById('rightLegControl')
        };
        
        const valueDisplays = {
            head: document.getElementById('headValue'),
            leftArm: document.getElementById('leftArmValue'),
            rightArm: document.getElementById('rightArmValue'),
            leftLeg: document.getElementById('leftLegValue'),
            rightLeg: document.getElementById('rightLegValue')
        };
        
        Object.keys(controls).forEach(part => {
            controls[part].addEventListener('input', (e) => {
                const angle = parseInt(e.target.value);
                this.currentAngles[part] = angle;
                valueDisplays[part].textContent = angle + '°';
                this.updatePuppetPart(part, angle);
            });
        });
    }
    
    updatePuppetPart(part, angle) {
        const element = this.puppetParts[part];
        if (!element) return;
        
        switch(part) {
            case 'head':
                element.style.transform = `rotate(${angle}deg)`;
                break;
            case 'leftArm':
                element.setAttribute('x2', 60 + angle * 0.5);
                element.setAttribute('y2', 110 - Math.abs(angle) * 0.3);
                break;
            case 'rightArm':
                element.setAttribute('x2', 140 - angle * 0.5);
                element.setAttribute('y2', 110 - Math.abs(angle) * 0.3);
                break;
            case 'leftLeg':
                element.setAttribute('x2', 85 + angle * 0.5);
                element.setAttribute('y2', 160 + Math.abs(angle) * 0.3);
                break;
            case 'rightLeg':
                element.setAttribute('x2', 115 + angle * 0.5);
                element.setAttribute('y2', 160 + Math.abs(angle) * 0.3);
                break;
        }
    }
    
    async loadActions() {
        try {
            const response = await fetch('/api/puppet-actions');
            const actions = await response.json();
            this.displayActions(actions);
        } catch (error) {
            console.error('加载动作失败:', error);
            // 使用默认动作
            this.displayDefaultActions();
        }
    }
    
    displayActions(actions) {
        const container = document.getElementById('actionButtons');
        container.innerHTML = '';
        
        actions.forEach(action => {
            const button = document.createElement('button');
            button.className = 'action-btn';
            button.textContent = action.action_name;
            button.title = action.description;
            button.onclick = () => this.performAction(action);
            container.appendChild(button);
        });
    }
    
    displayDefaultActions() {
        const defaultActions = [
            { action_name: '拱手礼', description: '传统问候动作', joints_data: { head: 0, leftArm: 45, rightArm: 45, leftLeg: 0, rightLeg: 0 } },
            { action_name: '舞剑', description: '武打动作', joints_data: { head: 15, leftArm: 90, rightArm: 120, leftLeg: 30, rightLeg: 45 } },
            { action_name: '作揖', description: '行礼动作', joints_data: { head: 15, leftArm: 60, rightArm: 60, leftLeg: 0, rightLeg: 0 } }
        ];
        
        this.displayActions(defaultActions);
    }
    
    performAction(action) {
        const joints = action.joints_data;
        
        // 重置所有控制滑块
        Object.keys(joints).forEach(part => {
            const control = document.getElementById(`${this.getControlId(part)}Control`);
            const display = document.getElementById(`${this.getControlId(part)}Value`);
            
            if (control && display) {
                control.value = joints[part];
                display.textContent = joints[part] + '°';
                this.currentAngles[part] = joints[part];
                this.updatePuppetPart(part, joints[part]);
            }
        });
        
        // 添加动画效果
        this.animateAction(action);
    }
    
    getControlId(part) {
        const mapping = {
            head: 'head',
            leftArm: 'leftArm',
            rightArm: 'rightArm',
            leftLeg: 'leftLeg',
            rightLeg: 'rightLeg'
        };
        return mapping[part] || part;
    }
    
    animateAction(action) {
        const puppetContainer = document.querySelector('.puppet-container');
        puppetContainer.classList.add('action-performing');
        
        setTimeout(() => {
            puppetContainer.classList.remove('action-performing');
        }, 2000);
    }
    
    resetPuppet() {
        Object.keys(this.currentAngles).forEach(part => {
            this.currentAngles[part] = 0;
            const control = document.getElementById(`${this.getControlId(part)}Control`);
            const display = document.getElementById(`${this.getControlId(part)}Value`);
            
            if (control && display) {
                control.value = 0;
                display.textContent = '0°';
                this.updatePuppetPart(part, 0);
            }
        });
    }
}

// AI故事生成功能
async function generateStory() {
    const theme = document.getElementById('storyTheme').value;
    const characters = document.getElementById('storyCharacters').value;
    
    if (!theme.trim()) {
        alert('请输入故事主题');
        return;
    }
    
    const storyDiv = document.getElementById('generatedStory');
    storyDiv.innerHTML = '<div class="loading-spinner"></div>';
    
    try {
        const response = await fetch('/api/generate-story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                theme: theme,
                characters: characters ? characters.split(',').map(c => c.trim()) : [],
                session_id: 'interactive_' + Date.now()
            })
        });
        
        const data = await response.json();
        storyDiv.innerHTML = `
            <div class="story-content">
                <h5>生成的故事：</h5>
                <p>${data.story}</p>
                <button onclick="performStoryActions('${theme}')" class="btn btn-secondary">用木偶表演这个故事</button>
            </div>
        `;
    } catch (error) {
        console.error('生成故事失败:', error);
        storyDiv.innerHTML = '<p>抱歉，故事生成失败，请稍后重试。</p>';
    }
}

// 根据故事主题执行相关动作
function performStoryActions(theme) {
    const storyActions = {
        '战斗': { head: 20, leftArm: 90, rightArm: 120, leftLeg: 30, rightLeg: 45 },
        '问候': { head: 0, leftArm: 45, rightArm: 45, leftLeg: 0, rightLeg: 0 },
        '舞蹈': { head: 15, leftArm: 60, rightArm: -60, leftLeg: 20, rightLeg: -20 }
    };
    
    const action = storyActions[theme] || { head: 0, leftArm: 0, rightArm: 0, leftLeg: 0, rightLeg: 0 };
    
    // 执行动作
    const puppet = new PuppetController();
    Object.keys(action).forEach(part => {
        puppet.updatePuppetPart(part, action[part]);
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    const puppetController = new PuppetController();
    
    // 添加重置按钮功能
    const resetButton = document.createElement('button');
    resetButton.textContent = '重置木偶';
    resetButton.className = 'btn btn-secondary';
    resetButton.onclick = () => puppetController.resetPuppet();
    
    const controlPanel = document.querySelector('.control-panel');
    controlPanel.appendChild(resetButton);
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'r':
            case 'R':
                puppetController.resetPuppet();
                break;
            case ' ':
                e.preventDefault();
                // 随机动作
                const randomAction = {
                    head: Math.random() * 90 - 45,
                    leftArm: Math.random() * 180 - 90,
                    rightArm: Math.random() * 180 - 90,
                    leftLeg: Math.random() * 90 - 45,
                    rightLeg: Math.random() * 90 - 45
                };
                
                Object.keys(randomAction).forEach(part => {
                    const angle = Math.round(randomAction[part]);
                    puppetController.updatePuppetPart(part, angle);
                    
                    const control = document.getElementById(`${part}Control`);
                    const display = document.getElementById(`${part}Value`);
                    
                    if (control && display) {
                        control.value = angle;
                        display.textContent = angle + '°';
                    }
                });
                break;
        }
    });
});

// 添加触摸支持
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', function(e) {
    if (e.touches.length === 1) {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        
        const deltaX = touchX - touchStartX;
        const deltaY = touchY - touchStartY;
        
        // 简单的触摸控制
        const puppet = document.querySelector('.puppet-body');
        puppet.style.transform = `translate(${deltaX * 0.1}px, ${deltaY * 0.1}px)`;
    }
});

document.addEventListener('touchend', function() {
    const puppet = document.querySelector('.puppet-body');
    puppet.style.transform = 'translate(0, 0)';
});
