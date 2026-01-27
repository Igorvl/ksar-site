from PIL import Image
import os

input_path = r"c:\Projects\Business\Web_projects_NEW\ksar.me\ksar-site\public\Projects\Soma\soma2.png"
output_path = r"c:\Projects\Business\Web_projects_NEW\ksar.me\ksar-site\public\Projects\Soma\Soma2.webp"

try:
    img = Image.open(input_path)
    print(f"Original size: {img.size}")

    # Rotate 135 degrees counter-clockwise
    # expand=True ensures the image isn't cropped if the rotation increases bounding box
    img_rotated = img.rotate(135, expand=True, resample=Image.Resampling.BICUBIC)
    
    # Save as WEBP, max quality
    img_rotated.save(output_path, "WEBP", quality=100, lossless=True)

    print(f"Processed image saved to {output_path}")
    print(f"New size: {img_rotated.size}")
except Exception as e:
    print(f"Error: {e}")
