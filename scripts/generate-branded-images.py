#!/usr/bin/env python3
"""
Generate branded blog post images for X/Twitter
Adds article title overlay at bottom like Felix's format
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont


def create_branded_image(input_path, output_path, title):
    """Add title overlay to blog image"""
    
    # Open the image
    img = Image.open(input_path)
    width, height = img.size
    
    # Create a copy to work with
    branded = img.copy()
    draw = ImageDraw.Draw(branded)
    
    # Overlay bar settings
    bar_height = 80
    bar_y = height - bar_height
    
    # Draw semi-transparent dark bar at bottom
    overlay = Image.new('RGBA', (width, bar_height), (0, 0, 0, 180))
    branded.paste(overlay, (0, bar_y), overlay)
    
    # Try to load a nice font, fallback to default
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 28)
    except:
        font = ImageFont.load_default()
    
    # Wrap text if too long
    max_width = width - 40
    words = title.split()
    lines = []
    current_line = []
    
    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]
    if current_line:
        lines.append(' '.join(current_line))
    
    # Limit to 2 lines
    lines = lines[:2]
    
    # Draw text centered in bar
    line_height = 32
    total_text_height = len(lines) * line_height
    start_y = bar_y + (bar_height - total_text_height) // 2 + 5
    
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = start_y + i * line_height
        
        # Draw white text
        draw.text((x, y), line, font=font, fill=(255, 255, 255, 255))
    
    # Save
    branded.save(output_path, 'PNG')
    print(f"Created: {output_path}")


def main():
    blog_dir = os.path.dirname(os.path.abspath(__file__))
    images_dir = os.path.join(blog_dir, '..', 'blog', 'images')
    branded_dir = os.path.join(blog_dir, '..', 'blog', 'branded')
    
    # Create branded directory
    os.makedirs(branded_dir, exist_ok=True)
    
    # Blog posts data
    posts = [
        {'image': 'openclaw-setup.png', 'title': 'The Complete OpenClaw Setup Guide'},
        {'image': 'building-in-public.png', 'title': 'Building CliffMart: From Zero to Live in 48 Hours'},
        {'image': 'memory-systems.png', 'title': 'How We Built a 3-Layer Memory System'},
        {'image': 'x-automation.png', 'title': 'Automating X Without Getting Banned'},
        {'image': 'video-transcription.png', 'title': 'Building a Video Transcription Skill'},
        {'image': 'monetization.png', 'title': 'First Dollar: Monetizing AI Tools'},
    ]
    
    for post in posts:
        input_path = os.path.join(images_dir, post['image'])
        output_path = os.path.join(branded_dir, post['image'])
        
        if os.path.exists(input_path):
            create_branded_image(input_path, output_path, post['title'])
        else:
            print(f"Warning: {input_path} not found")
    
    print("\nDone! Branded images created in blog/branded/")


if __name__ == '__main__':
    main()
