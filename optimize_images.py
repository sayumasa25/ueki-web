#!/usr/bin/env python3
"""
画像ファイルを最適化してファイルサイズを削減するスクリプト
"""

import os
from PIL import Image
import shutil

def optimize_image(input_path, output_path, max_width=1200, quality=85):
    """
    画像を最適化する
    
    Args:
        input_path: 入力画像のパス
        output_path: 出力画像のパス
        max_width: 最大幅（ピクセル）
        quality: JPEG品質（1-100）
    """
    try:
        with Image.open(input_path) as img:
            # 元のサイズを取得
            original_size = os.path.getsize(input_path)
            
            # RGBモードに変換（透明度がある場合）
            if img.mode in ('RGBA', 'LA', 'P'):
                # 白背景で合成
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # リサイズ（幅が最大幅を超える場合）
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # JPEGで保存（品質を指定）
            if output_path.lower().endswith('.png'):
                output_path = output_path.replace('.png', '.jpg')
            elif not output_path.lower().endswith('.jpg'):
                output_path += '.jpg'
                
            img.save(output_path, 'JPEG', quality=quality, optimize=True)
            
            # 最適化後のサイズを取得
            optimized_size = os.path.getsize(output_path)
            reduction = ((original_size - optimized_size) / original_size) * 100
            
            print(f"✅ {os.path.basename(input_path)}")
            print(f"   元のサイズ: {original_size:,} bytes")
            print(f"   最適化後: {optimized_size:,} bytes")
            print(f"   削減率: {reduction:.1f}%")
            print()
            
            return output_path
            
    except Exception as e:
        print(f"❌ エラー: {input_path} - {str(e)}")
        return None

def main():
    """メイン処理"""
    images_dir = "images"
    
    # 最適化対象の大きなファイル
    large_files = [
        "トップページ.jpg",
        "一人一人にあったケア.png", 
        "安心のサポート体制.png",
        "社長.png",
        "訪問介護だからこそできること.png",
        "コンセプト.jpg",
        "事業所.jpg",
        "logo.jpg",
        "logo.png"
    ]
    
    print("🖼️  画像最適化を開始します...\n")
    
    total_original = 0
    total_optimized = 0
    optimized_files = []
    
    for filename in large_files:
        input_path = os.path.join(images_dir, filename)
        if os.path.exists(input_path):
            # 一時的なバックアップを作成
            backup_path = input_path + ".backup"
            shutil.copy2(input_path, backup_path)
            
            original_size = os.path.getsize(input_path)
            total_original += original_size
            
            # 直接元のファイルを置き換え
            optimized_path = optimize_image(input_path, input_path)
            
            if optimized_path and os.path.exists(optimized_path):
                total_optimized += os.path.getsize(optimized_path)
                optimized_files.append(filename)
            else:
                # 最適化に失敗した場合はバックアップから復元
                shutil.copy2(backup_path, input_path)
    
    # バックアップファイルを削除
    for filename in large_files:
        backup_path = os.path.join(images_dir, filename + ".backup")
        if os.path.exists(backup_path):
            os.remove(backup_path)
    
    # 結果サマリー
    if total_original > 0:
        total_reduction = ((total_original - total_optimized) / total_original) * 100
        print("=" * 50)
        print("📊 最適化結果サマリー")
        print(f"元の合計サイズ: {total_original:,} bytes ({total_original/1024/1024:.1f} MB)")
        print(f"最適化後合計: {total_optimized:,} bytes ({total_optimized/1024/1024:.1f} MB)")
        print(f"総削減率: {total_reduction:.1f}%")
        print(f"最適化されたファイル数: {len(optimized_files)}")
        print("=" * 50)
    
    return len(optimized_files) > 0

if __name__ == "__main__":
    success = main()
    if success:
        print("\n✅ 画像最適化が完了しました！")
    else:
        print("\n❌ 画像最適化に失敗しました。")
