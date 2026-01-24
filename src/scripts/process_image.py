from PIL import Image
import os

input_path = "C:/Users/Igor Viktorovich/.gemini/antigravity/brain/5ffd8fb9-c4a9-450f-9fee-868acad3bb12/soma_extended_1769218084969.png"
output_path = r"c:\Projects\Business\Web_projects_NEW\ksar.me\ksar-site\public\Projects\Soma\Soma1.webp"

img = Image.open(input_path)

# Resize logic
target_width = 2800
# Calculate height to keep aspect ratio
w_percent = (target_width / float(img.size[0]))
h_size = int((float(img.size[1]) * float(w_percent)))

# Or if 16:9 is strictly required:
# target_height = int(target_width * 9 / 16)
# img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
# But user said "make it 16x9... drawing to left and right".
# The generated image should already be roughly wide. Let's maximize width to 2800 and keep aspect ratio for now,
# or crop/resize to exactly 16:9 if needed.
# Let's just resize to 2800 width maintaining aspect ratio, assuming generation did a good job on ratio.
img = img.resize((target_width, h_size), Image.Resampling.LANCZOS)

# Save as WEBP, quality high (lossless or high quality), 32bit (RGBA)
# Ensure RGBA
if img.mode != 'RGBA':
    img = img.convert('RGBA')

img.save(output_path, "WEBP", quality=95, lossless=False)

print(f"Image saved to {output_path}, Size: {img.size}")
