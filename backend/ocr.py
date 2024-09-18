from PIL import Image
import io
import pytesseract
import sys

def extract_text_from_image(image_path):
    try:
        # Open the image from the given file path
        image = Image.open(image_path)
        
        # Perform OCR processing
        text = pytesseract.image_to_string(image)
        return text

    except Exception as e:
        print(f"Error in extract_text_from_image: {e}")
        return ""

if __name__ == "__main__":
    # Accept the image path from the command line argument
    if len(sys.argv) < 2:
        print("Usage: python ocr.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    extracted_text = extract_text_from_image(image_path)
    
    # Output the extracted text
    print(extracted_text)
