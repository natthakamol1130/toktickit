import os
from PIL import Image

img1_path = r"C:/Users/Windows/.gemini/antigravity-ide/brain/5a3bea47-87a2-4f5c-9e01-370be5c711ed/media__1786893781002.png"
img2_path = r"C:/Users/Windows/.gemini/antigravity-ide/brain/5a3bea47-87a2-4f5c-9e01-370be5c711ed/media__1786893803525.png"
out_dir = r"c:/Users/Windows/OneDrive/kmutt/Lab1_Starter_Scaffold/toktickit/docs/lab-01/images"
os.makedirs(out_dir, exist_ok=True)

im1 = Image.open(img1_path)
im2 = Image.open(img2_path)

# Let's save individual ones
im1.save(os.path.join(out_dir, "directory_structure_top.png"))
im2.save(os.path.join(out_dir, "directory_structure_bottom.png"))

# Let's combine them vertically
total_width = max(im1.width, im2.width)
total_height = im1.height + im2.height

combined = Image.new("RGBA", (total_width, total_height), (24, 24, 24, 255))
combined.paste(im1, (0, 0))
combined.paste(im2, (0, im1.height))

out_path = os.path.join(out_dir, "directory_structure.png")
combined.save(out_path)
print("Saved combined directory structure image successfully to:", out_path)
