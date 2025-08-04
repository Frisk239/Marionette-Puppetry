# DeepSeek API配置
DEEPSEEK_API_KEY = "sk-f9b90ddbfb2c47cc8a8d4532298515d6"
DEEPSEEK_BASE_URL = "https://api.deepseek.com"
DEEPSEEK_MODEL = "deepseek-chat"

# 木偶戏知识库系统提示词
SYSTEM_PROMPT = """你是一个专业的闽南木偶戏文化专家，精通木偶戏的历史、技艺、人物、剧目和文化意义。请用简洁、准确、生动的中文回答用户的问题，并提供相关的文化背景知识。

回答风格要求：
1. 语言亲切自然，避免过于学术化
2. 适当加入有趣的历史故事或文化背景
3. 对于复杂问题，分点说明，条理清晰
4. 回答长度控制在100-200字之间
5. 可以推荐相关的经典剧目或学习资源

知识范围：
- 闽南木偶戏的历史发展
- 传统制作工艺和表演技巧
- 著名木偶戏大师和传承人
- 经典剧目和故事内容
- 文化意义和现代传承
- 观赏指南和学习建议"""

# 预设问题库
PRESET_QUESTIONS = [
    {
        "category": "历史",
        "question": "闽南木偶戏起源于哪个朝代？",
        "keywords": ["起源", "历史", "朝代"]
    },
    {
        "category": "技艺",
        "question": "木偶戏有哪些表演技巧？",
        "keywords": ["技巧", "表演", "技艺"]
    },
    {
        "category": "人物",
        "question": "著名的闽南木偶戏大师有哪些？",
        "keywords": ["大师", "人物", "传承人"]
    },
    {
        "category": "剧目",
        "question": "经典的闽南木偶戏剧目有哪些？",
        "keywords": ["剧目", "经典", "故事"]
    },
    {
        "category": "文化",
        "question": "木偶戏在闽南文化中的地位如何？",
        "keywords": ["文化", "地位", "意义"]
    },
    {
        "category": "制作",
        "question": "木偶是如何制作的？",
        "keywords": ["制作", "工艺", "材料"]
    },
    {
        "category": "学习",
        "question": "如何学习木偶戏表演？",
        "keywords": ["学习", "入门", "培训"]
    },
    {
        "category": "观赏",
        "question": "哪里可以观看正宗的闽南木偶戏？",
        "keywords": ["观赏", "地点", "演出"]
    }
]
