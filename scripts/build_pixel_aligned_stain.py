"""Create a received-state scene without changing the approved scene geometry."""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
BASE_PATH = ROOT / "assets/images/generated/home-opening-coat-returned-v1.jpg"
REFERENCE_PATH = Path(
    "/Users/jordanhudson/.codex/generated_images/"
    "019f9a0b-5b15-7111-bef3-025adf5325a5/"
    "exec-d0413548-8e69-4f20-a934-fb8c53ab7e29.png"
)
OUTPUT_PATH = ROOT / "assets/images/generated/home-opening-coat-received-pixel-aligned-v1.png"
COMPACT_OUTPUT_PATH = (
    ROOT / "assets/images/generated/home-opening-coat-received-compact-feathered-v1.png"
)


base_image = Image.open(BASE_PATH).convert("RGB")
reference_image = Image.open(REFERENCE_PATH).convert("RGB").resize(base_image.size, Image.Resampling.LANCZOS)

base = np.asarray(base_image, dtype=np.float32)
reference = np.asarray(reference_image, dtype=np.float32)
height, width = base.shape[:2]

# The generated reference contributes only a stain mask. Every output pixel still
# starts from the approved clean scene, so seams, folds, buttons, and edges cannot move.
red, green, blue = reference[..., 0], reference[..., 1], reference[..., 2]
yellow_chroma = np.maximum(0.0, ((red + green) * 0.5) - blue - 2.0)
saturation = reference.max(axis=2) - reference.min(axis=2)
darkness = np.maximum(0.0, 244.0 - reference.mean(axis=2))

mask = np.clip(yellow_chroma / 34.0 + saturation * darkness / 8500.0, 0.0, 1.0)

# Restrict the transfer to the coat torso where the reference stains were placed.
region = np.zeros((height, width), dtype=np.float32)
region[int(height * 0.42) : int(height * 0.79), : int(width * 0.31)] = 1.0
mask *= region

mask_image = Image.fromarray(np.uint8(mask * 255), mode="L").filter(ImageFilter.GaussianBlur(2.2))
mask = np.asarray(mask_image, dtype=np.float32) / 255.0
mask *= region
mask = np.clip(mask * 0.78, 0.0, 0.72)

# Multiply a warm grease/food tint through the original luminance and texture.
tint = np.array([0.91, 0.82, 0.62], dtype=np.float32)
stained = base * tint
result = base * (1.0 - mask[..., None]) + stained * mask[..., None]

Image.fromarray(np.uint8(np.clip(result, 0, 255)), mode="RGB").save(
    OUTPUT_PATH,
    format="PNG",
    optimize=True,
)


def smoothstep(edge_start: float, edge_end: float, values: np.ndarray) -> np.ndarray:
    """Return a soft 0..1 transition between two normalized image positions."""

    progress = np.clip((values - edge_start) / (edge_end - edge_start), 0.0, 1.0)
    return progress * progress * (3.0 - 2.0 * progress)


# At compact-desktop crops the proof section starts near the lower edge of the
# original stain. Move only the stain mask down the coat, then feather its right
# and lower limits. The coat, seams, folds, and background stay pixel-for-pixel
# aligned with the clean source.
y_positions = np.linspace(0.0, 1.0, height, dtype=np.float32)[:, None]
x_positions = np.linspace(0.0, 1.0, width, dtype=np.float32)[None, :]
compact_shift = int(height * 0.085)
compact_mask = np.zeros_like(mask)
compact_mask[compact_shift:, :] = mask[:-compact_shift, :]
compact_mask *= 1.0 - smoothstep(0.27, 0.305, x_positions)
compact_mask *= 1.0 - smoothstep(0.80, 0.88, y_positions)

compact_result = base * (1.0 - compact_mask[..., None]) + stained * compact_mask[..., None]
Image.fromarray(np.uint8(np.clip(compact_result, 0, 255)), mode="RGB").save(
    COMPACT_OUTPUT_PATH,
    format="PNG",
    optimize=True,
)

print(OUTPUT_PATH)
print(COMPACT_OUTPUT_PATH)
