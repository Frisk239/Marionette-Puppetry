from flask import Flask, render_template, request, jsonify, send_from_directory
import sqlite3
import json
import os
from datetime import datetime
import requests

app = Flask(__name__)

# 数据库初始化
def init_db():
    conn = sqlite3.connect('marionette.db')
    cursor = conn.cursor()
    
    # 创建知识库表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS puppet_knowledge (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            keywords TEXT
        )
    ''')
    
    # 创建用户互动记录表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            interaction_type TEXT NOT NULL,
            content TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 创建木偶动作表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS puppet_actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action_name TEXT NOT NULL,
            description TEXT,
            joints_data TEXT,
            difficulty_level INTEGER
        )
    ''')
    
    # 插入初始数据
    init_knowledge_data(cursor)
    init_puppet_actions(cursor)
    
    conn.commit()
    conn.close()

def init_knowledge_data(cursor):
    knowledge_data = [
        ('历史', '闽南木偶戏起源于什么时候？', '闽南木偶戏起源于唐代，兴盛于宋元时期，距今已有1000多年历史。', '起源 历史 唐代'),
        ('技艺', '木偶戏有哪些表演技巧？', '主要包括手指技巧、手腕技巧、手臂技巧，以及配合说唱的表演技巧。', '技艺 表演 技巧'),
        ('人物', '谁是著名的闽南木偶戏大师？', '李天禄是台湾著名的布袋戏大师，被誉为"布袋戏国宝"。', '大师 李天禄 人物'),
        ('剧目', '有哪些经典的闽南木偶戏剧目？', '《水浒传》、《三国演义》、《西游记》等传统剧目最受欢迎。', '剧目 经典 传统'),
        ('文化', '木偶戏在闽南文化中的地位如何？', '木偶戏是闽南文化的重要组成部分，是民间喜庆活动不可或缺的表演艺术。', '文化 地位 闽南')
    ]
    
    cursor.executemany('''
        INSERT OR IGNORE INTO puppet_knowledge (category, question, answer, keywords) 
        VALUES (?, ?, ?, ?)
    ''', knowledge_data)

def init_puppet_actions(cursor):
    actions = [
        ('拱手礼', '传统问候动作', '{"head": 0, "left_arm": 45, "right_arm": 45, "left_leg": 0, "right_leg": 0}', 1),
        ('舞剑', '武打动作', '{"head": 15, "left_arm": 90, "right_arm": 120, "left_leg": 30, "right_leg": 45}', 3),
        ('作揖', '行礼动作', '{"head": 15, "left_arm": 60, "right_arm": 60, "left_leg": 0, "right_leg": 0}', 2),
        ('走路', '基本步伐', '{"head": 5, "left_arm": 30, "right_arm": -30, "left_leg": 15, "right_leg": -15}', 2),
        ('转身', '旋转动作', '{"head": 0, "left_arm": 180, "right_arm": 180, "left_leg": 90, "right_leg": 90}', 2)
    ]
    
    cursor.executemany('''
        INSERT OR IGNORE INTO puppet_actions (action_name, description, joints_data, difficulty_level) 
        VALUES (?, ?, ?, ?)
    ''', actions)

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
    return render_template('gallery.html')

@app.route('/api/knowledge')
def get_knowledge():
    conn = sqlite3.connect('marionette.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM puppet_knowledge')
    data = cursor.fetchall()
    conn.close()
    
    result = []
    for row in data:
        result.append({
            'id': row[0],
            'category': row[1],
            'question': row[2],
            'answer': row[3],
            'keywords': row[4]
        })
    
    return jsonify(result)

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    
    # 先查询本地知识库
    conn = sqlite3.connect('marionette.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT answer FROM puppet_knowledge 
        WHERE question LIKE ? OR keywords LIKE ?
    ''', (f'%{user_message}%', f'%{user_message}%'))
    
    result = cursor.fetchone()
    
    if result:
        answer = result[0]
        source = 'local'
    else:
        # 这里可以集成实际的AI API
        answer = "这个问题很有意思，让我为您详细解答：闽南木偶戏作为非物质文化遗产，承载着深厚的文化内涵。关于您的问题，建议查阅更多专业资料或咨询当地木偶戏传承人。"
        source = 'ai'
    
    # 记录对话
    session_id = request.json.get('session_id', 'default')
    cursor.execute('''
        INSERT INTO user_sessions (session_id, interaction_type, content) 
        VALUES (?, ?, ?)
    ''', (session_id, 'chat', json.dumps({'user': user_message, 'bot': answer})))
    
    conn.commit()
    conn.close()
    
    return jsonify({'answer': answer, 'source': source})

@app.route('/api/puppet-actions')
def get_puppet_actions():
    conn = sqlite3.connect('marionette.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM puppet_actions')
    data = cursor.fetchall()
    conn.close()
    
    result = []
    for row in data:
        result.append({
            'id': row[0],
            'action_name': row[1],
            'description': row[2],
            'joints_data': json.loads(row[3]),
            'difficulty_level': row[4]
        })
    
    return jsonify(result)

@app.route('/api/generate-story', methods=['POST'])
def generate_story():
    theme = request.json.get('theme', '')
    characters = request.json.get('characters', [])
    
    # 简单的故事生成逻辑
    story_templates = [
        f"在古老的闽南小镇，{characters[0] if characters else '小木偶'}开始了{theme}的冒险...",
        f"传说在清朝年间，一位木偶戏艺人带着他的{characters[0] if characters else '木偶'}，演绎了一出{theme}的精彩故事...",
        f"每逢庙会，{characters[0] if characters else '木偶大师'}都会带着家传的木偶，表演{theme}，引来满堂喝彩..."
    ]
    
    story = story_templates[hash(theme) % len(story_templates)]
    
    # 记录生成记录
    conn = sqlite3.connect('marionette.db')
    cursor = conn.cursor()
    session_id = request.json.get('session_id', 'default')
    cursor.execute('''
        INSERT INTO user_sessions (session_id, interaction_type, content) 
        VALUES (?, ?, ?)
    ''', (session_id, 'create', json.dumps({'theme': theme, 'characters': characters, 'story': story})))
    
    conn.commit()
    conn.close()
    
    return jsonify({'story': story})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
