from flask import Flask, render_template, request, jsonify, send_from_directory
import sqlite3
import json
import os
from datetime import datetime
import requests
import config

app = Flask(__name__)

# 数据库初始化 - 仅保留聊天记录
def init_db():
    conn = sqlite3.connect('marionette.db')
    cursor = conn.cursor()
    
    # 创建用户互动记录表（仅存储聊天记录）
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            interaction_type TEXT NOT NULL,
            content TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/culture')
def culture():
    return render_template('culture.html')

@app.route('/interactive')
def interactive():
    return render_template('interactive.html')

@app.route('/ai-chat')
def ai_chat():
    return render_template('ai_chat.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery-compatible.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    
    try:
        # 调用DeepSeek API
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {config.DEEPSEEK_API_KEY}'
            },
            json={
                'model': config.DEEPSEEK_MODEL,
                'messages': [
                    {'role': 'system', 'content': config.SYSTEM_PROMPT},
                    {'role': 'user', 'content': user_message}
                ],
                'max_tokens': 300,
                'temperature': 0.7
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            answer = data['choices'][0]['message']['content']
        else:
            answer = "抱歉，AI服务暂时不可用，请稍后再试。"
    
    except Exception as e:
        print(f"API调用错误: {e}")
        answer = "抱歉，暂时无法连接到AI服务，请检查网络后重试。"
    
    # 记录对话
    conn = sqlite3.connect('marionette.db')
    cursor = conn.cursor()
    session_id = request.json.get('session_id', 'default')
    cursor.execute('''
        INSERT INTO user_sessions (session_id, interaction_type, content) 
        VALUES (?, ?, ?)
    ''', (session_id, 'chat', json.dumps({'user': user_message, 'bot': answer})))
    
    conn.commit()
    conn.close()
    
    return jsonify({'answer': answer})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
