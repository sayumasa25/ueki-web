#!/usr/bin/env python3
"""
Sample images generator for Care Station Solana Hiroshima website
Creates placeholder images with appropriate colors and text
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_gradient_image(width, height, color1, color2, text, filename):
    """Create a gradient image with text overlay"""
    # Create image
    img = Image.new('RGB', (width, height), color1)
    draw = ImageDraw.Draw(img)
    
    # Create gradient effect
    for y in range(height):
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # Add text
    try:
        # Try to use a nice font
        font_size = min(width, height) // 10
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    
    # Get text size and position
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Add text with shadow for better readability
    shadow_offset = 2
    draw.text((x + shadow_offset, y + shadow_offset), text, fill=(0, 0, 0, 128), font=font)
    draw.text((x, y), text, fill=(255, 255, 255), font=font)
    
    # Save image
    img.save(filename, 'JPEG', quality=85)
    print(f"Created: {filename}")

def main():
    """Create all sample images"""
    # Create images directory if it doesn't exist
    os.makedirs('images', exist_ok=True)
    
    # Define colors (RGB)
    warm_blue = (74, 144, 164)      # Primary color
    light_blue = (232, 244, 248)   # Secondary color
    warm_beige = (212, 165, 116)   # Accent color
    cream = (255, 244, 230)        # Warm background
    soft_green = (74, 124, 89)     # Success color
    
    # Create images
    images_to_create = [
        {
            'filename': 'images/hero-image.jpg',
            'size': (600, 400),
            'color1': light_blue,
            'color2': cream,
            'text': '温かい介護サービス'
        },
        {
            'filename': 'images/concept-image.jpg',
            'size': (500, 350),
            'color1': cream,
            'color2': warm_beige,
            'text': 'ひだまりのような温かさ'
        },
        {
            'filename': 'images/manager.jpg',
            'size': (300, 300),
            'color1': (240, 248, 255),
            'color2': warm_blue,
            'text': '管理者'
        },
        {
            'filename': 'images/feature-personal.jpg',
            'size': (80, 80),
            'color1': (232, 245, 232),
            'color2': soft_green,
            'text': '👤'
        },
        {
            'filename': 'images/feature-home.jpg',
            'size': (80, 80),
            'color1': (255, 240, 245),
            'color2': (212, 82, 122),
            'text': '🏠'
        },
        {
            'filename': 'images/feature-support.jpg',
            'size': (80, 80),
            'color1': light_blue,
            'color2': warm_blue,
            'text': '💝'
        },
        {
            'filename': 'images/office-exterior.jpg',
            'size': (400, 300),
            'color1': (248, 249, 250),
            'color2': (108, 117, 125),
            'text': '事業所外観'
        }
    ]
    
    for img_config in images_to_create:
        create_gradient_image(
            img_config['size'][0],
            img_config['size'][1],
            img_config['color1'],
            img_config['color2'],
            img_config['text'],
            img_config['filename']
        )
    
    print("\nAll sample images created successfully!")
    print("You can now refresh your website to see the images.")

if __name__ == "__main__":
    main()
