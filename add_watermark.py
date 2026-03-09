"""
Add watermark to all portfolio images.
Watermark text: @therahuljoshi_
Position: bottom-right corner, semi-transparent white text with shadow.
"""

import os
import glob
from PIL import Image, ImageDraw, ImageFont

WATERMARK_TEXT = "@therahuljoshi_"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Folders to process
FOLDERS = [
    os.path.join(BASE_DIR, "images"),
    os.path.join(BASE_DIR, "assets"),
]


def get_font(size):
    """Try to load a clean font, fall back to default."""
    font_names = [
        "arial.ttf",
        "Arial.ttf",
        "calibri.ttf",
        "Calibri.ttf",
        "segoeui.ttf",
        "consola.ttf",  # Consolas (monospace)
        "cour.ttf",     # Courier New
    ]
    for name in font_names:
        try:
            return ImageFont.truetype(name, size)
        except (OSError, IOError):
            pass
    # Try Windows font directory
    win_fonts = r"C:\Windows\Fonts"
    for name in font_names:
        path = os.path.join(win_fonts, name)
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except (OSError, IOError):
                pass
    # Fallback to default
    return ImageFont.load_default()


def add_watermark(image_path):
    """Add watermark to a single image file."""
    try:
        img = Image.open(image_path).convert("RGBA")
    except Exception as e:
        print(f"  SKIP (cannot open): {image_path} - {e}")
        return False

    width, height = img.size

    # Font size ~3% of image width, min 16px
    font_size = max(16, int(width * 0.03))
    font = get_font(font_size)

    # Create transparent overlay for watermark
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Measure text size
    bbox = draw.textbbox((0, 0), WATERMARK_TEXT, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Position: bottom-right with padding
    padding_x = int(width * 0.025)
    padding_y = int(height * 0.025)
    x = width - text_width - padding_x
    y = height - text_height - padding_y

    # Draw shadow (dark, slightly offset)
    shadow_color = (0, 0, 0, 100)
    draw.text((x + 1, y + 1), WATERMARK_TEXT, font=font, fill=shadow_color)
    draw.text((x + 2, y + 2), WATERMARK_TEXT, font=font, fill=(0, 0, 0, 60))

    # Draw watermark text (white, semi-transparent)
    text_color = (255, 255, 255, 90)  # ~35% opacity
    draw.text((x, y), WATERMARK_TEXT, font=font, fill=text_color)

    # Composite overlay onto image
    watermarked = Image.alpha_composite(img, overlay)

    # Convert back to RGB for JPEG saving
    watermarked_rgb = watermarked.convert("RGB")

    # Save — overwrite original with good quality
    watermarked_rgb.save(image_path, "JPEG", quality=92, optimize=True)
    return True


def main():
    total = 0
    success = 0
    errors = 0

    for folder in FOLDERS:
        if not os.path.isdir(folder):
            print(f"Folder not found: {folder}")
            continue

        images = sorted(glob.glob(os.path.join(folder, "*.jpeg")))
        images += sorted(glob.glob(os.path.join(folder, "*.jpg")))
        images += sorted(glob.glob(os.path.join(folder, "*.png")))
        # Remove duplicates (in case patterns overlap)
        images = sorted(set(images))

        print(f"\nProcessing {len(images)} images in {folder}...")

        for i, img_path in enumerate(images, 1):
            total += 1
            filename = os.path.basename(img_path)
            if add_watermark(img_path):
                success += 1
                if i % 25 == 0 or i == len(images):
                    print(f"  [{i}/{len(images)}] {filename} - done")
            else:
                errors += 1

    print(f"\n{'='*50}")
    print(f"Watermarking complete!")
    print(f"  Total: {total}")
    print(f"  Success: {success}")
    print(f"  Errors: {errors}")


if __name__ == "__main__":
    main()
