from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent.parent
SOURCE_ACCORDION = ROOT / "qa-homepage-source-accordion.png"
SOURCE_MODELS = ROOT / "qa-homepage-source-models.png"
IMPLEMENTATION = ROOT / "qa-homepage-integration-desktop.png"
OUTPUT = ROOT / "qa-homepage-integration-comparison.png"

NAVY = (5, 11, 20)
CREAM = (250, 246, 238)
GOLD = (210, 176, 113)
MUTED = (174, 180, 188)


def fit(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    return image.resize(size, Image.Resampling.LANCZOS)


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    path = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
    return ImageFont.truetype(str(path), size) if path.exists() else ImageFont.load_default()


source_accordion = Image.open(SOURCE_ACCORDION).convert("RGB")
source_models = Image.open(SOURCE_MODELS).convert("RGB")
implementation = Image.open(IMPLEMENTATION).convert("RGB")

# The implementation capture includes the fixed navigation and the cloth
# handoff. These crops normalize it to the two supplied component references.
implementation_accordion = implementation.crop((30, 145, 1410, 750))
implementation_models = implementation.crop((30, 755, 1410, 992))

source_accordion = fit(source_accordion, (800, 351))
implementation_accordion = fit(implementation_accordion, (800, 351))
source_models = fit(source_models, (800, 137))
implementation_models = fit(implementation_models, (800, 137))

canvas = Image.new("RGB", (1660, 650), NAVY)
draw = ImageDraw.Draw(canvas)
title_font = font(22)
label_font = font(14)
caption_font = font(12)

draw.text((20, 14), "Homepage integration comparison", fill=CREAM, font=title_font)
draw.text((20, 48), "PRIMARY ACCORDION COMPOSITION", fill=GOLD, font=label_font)
draw.text((840, 48), "RENDERED HOMEPAGE INTEGRATION", fill=GOLD, font=label_font)

canvas.paste(source_accordion, (20, 72))
canvas.paste(implementation_accordion, (840, 72))
draw.rectangle((19, 71, 820, 424), outline=GOLD, width=1)
draw.rectangle((839, 71, 1640, 424), outline=GOLD, width=1)
draw.text((20, 433), "Approved source direction", fill=MUTED, font=caption_font)
draw.text((840, 433), "Hotels active · 1440 × 1024 CSS pixels", fill=MUTED, font=caption_font)

draw.text((20, 468), "SERVICE-MODEL GROUP", fill=GOLD, font=label_font)
draw.text((840, 468), "CURRENT COMPACT SCALE", fill=GOLD, font=label_font)
canvas.paste(source_models, (20, 492))
canvas.paste(implementation_models, (840, 492))
draw.rectangle((19, 491, 820, 630), outline=GOLD, width=1)
draw.rectangle((839, 491, 1640, 630), outline=GOLD, width=1)

canvas.save(OUTPUT, optimize=True)
