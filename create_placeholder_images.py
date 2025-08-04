#!/usr/bin/env python3
"""
为文化长廊页面创建占位符图片
运行此脚本将生成所需的图片文件
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 创建图片目录
os.makedirs('static/images/culture', exist_ok=True)

# 定义图片尺寸和文本
images_config = {
    'tang-dynasty.jpg': {'text': '唐代木偶戏', 'size': (400, 300)},
    'song-dynasty.jpg': {'text': '宋代木偶戏', 'size': (400, 300)},
    'ming-dynasty.jpg': {'text': '明代木偶戏', 'size': (400, 300)},
    'modern-puppet.jpg': {'text': '现代木偶戏', 'size': (400, 300)},
    'wood-selection.jpg': {'text': '选材工艺', 'size': (400, 300)},
    'carving.jpg': {'text': '雕刻工艺', 'size': (400, 300)},
    'painting.jpg': {'text': '彩绘工艺', 'size': (400, 300)},
    'assembly.jpg': {'text': '组装工艺', 'size': (400, 300)},
    'master-li.jpg': {'text': '李天禄大师', 'size': (400, 300)},
    'master-chen.jpg': {'text': '陈锡煌大师', 'size': (400, 300)},
    'story-watermargin.jpg': {'text': '水浒传', 'size': (400, 300)},
    'story-threekingdoms.jpg': {'text': '三国演义', 'size': (400, 300)},
    'story-journeywest.jpg': {'text': '西游记', 'size': (400, 300)},
    'cultural-significance.jpg': {'text': '文化意义', 'size': (400, 300)},
}

# 颜色主题
colors = [
    (200, 16, 46),    # 主红色
    (255, 215, 0),    # 金色
    (139, 69, 19),    # 棕色
    (160, 82, 45),    # 深棕色
]

def create_placeholder_image(filename, config):
    """创建占位符图片"""
    width, height = config['size']
    text = config['text']
    
    # 创建渐变背景
    img = Image.new('RGB', (width, height), color=colors[0])
    draw = ImageDraw.Draw(img)
    
    # 添加渐变效果
    for i in range(height):
        color_factor = i / height
        r = int(colors[0][0] * (1 - color_factor * 0.3))
        g = int(colors[0][1] * (1 - color_factor * 0.3))
        b = int(colors[0][2] * (1 - color_factor * 0.3))
        draw.line([(0, i), (width, i)], fill=(r, g, b))
    
    # 添加装饰性图案
    for i in range(5):
        x = (width // 6) * (i + 1)
        y = height // 2
        size = 20
        draw.ellipse([x-size, y-size, x+size, y+size], 
                    outline=colors[1], width=2)
    
    # 添加文字
    try:
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    # 计算文字位置
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # 添加文字背景
    padding = 10
    draw.rectangle([
        (width - text_width) // 2 - padding,
        height - text_height - 40,
        (width + text_width) // 2 + padding,
        height - 20
    ], fill=(255, 255, 255, 200))
    
    # 添加文字
    draw.text(
        ((width - text_width) // 2, height - text_height - 35),
        text,
        fill=colors[0],
        font=font
    )
    
    # 保存图片
    img.save(f'static/images/culture/{filename}', 'JPEG', quality=85)
    print(f"✓ 创建图片: static/images/culture/{filename}")

def main():
    """主函数"""
    print("开始创建文化长廊图片...")
    
    for filename, config in images_config.items():
        create_placeholder_image(filename, config)
    
    print("\n✅ 所有图片创建完成！")
    print("图片保存在: static/images/culture/")
    print("\n您可以将这些图片替换为实际的木偶戏相关图片。")

if __name__ == "__main__":
    main()
