from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import sys

# Initializing models
caption_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
caption_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# Function to generate captions
def generate_caption(image_path: str) -> str:
    try:
        image = Image.open(image_path)
    except Exception as e:
        print(f"Error opening image file {image_path}: {e}", file=sys.stderr)
        sys.exit(1)

    try:
        inputs = caption_processor(images=image, return_tensors="pt")
        outputs = caption_model.generate(**inputs)
        caption = caption_processor.decode(outputs[0], skip_special_tokens=True)
        return caption
    except Exception as e:
        print(f"Error generating caption: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python caption.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    caption = generate_caption(image_path)
    print(caption)
