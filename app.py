from flask import Flask, render_template, request, jsonify, send_from_directory
import requests
import config

app = Flask(__name__)

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
    
    
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
