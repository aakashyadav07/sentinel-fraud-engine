import os
import re
from PIL import Image

def extract_text_from_image(image_path: str) -> str:
    """
    Extract text from uploaded screenshot.
    Uses pytesseract if available, with graceful fallback.
    """
    if not image_path or not os.path.exists(image_path):
        return ""

    extracted_text = ""

    # Attempt pytesseract if installed
    try:
        import pytesseract
        image = Image.open(image_path)
        extracted_text = pytesseract.image_to_string(image)
        if extracted_text and extracted_text.strip():
            return extracted_text.strip()
    except Exception:
        # Pytesseract binary not available or error occurred
        pass

    # Basic fallback: read basic image metadata or fallback message
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            format_name = img.format
            # If standard screenshot text can't be extracted via binary OCR, return descriptive OCR placeholder
            return f"[Screenshot Analyzed: {os.path.basename(image_path)} ({format_name} {width}x{height})]"
    except Exception as e:
        return f"[Image Analysis Note: {str(e)}]"
