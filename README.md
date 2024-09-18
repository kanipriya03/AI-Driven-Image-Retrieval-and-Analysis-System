# AI-Powered Image Retrieval and Analysis System

## Overview
The AI-Powered Image Retrieval and Analysis System is a web-based application designed to manage, process, and search images using advanced technologies. It integrates Optical Character Recognition (OCR), object detection, image captioning, and facial recognition to provide a comprehensive tool for image analysis and retrieval.

This system uses MongoDB to handle image metadata efficiently. The frontend, developed with React.js, provides a modern and intuitive user experience. The backend combines Node.js and Python for processing images, handling requests, and managing data operations. The modular architecture supports future enhancements in image processing, searching, and management.

## Features

1. **Image Upload and Storage**
   - **Bulk Upload via ZIP**: Upload individual images or batch images compressed in ZIP files.
   - **Image Metadata Storage**: Metadata including file path, captions, extracted text, and object labels are stored in MongoDB.

2. **Optical Character Recognition (OCR)**
   - **Text Extraction**: Uses Tesseract OCR to extract textual information from images.
   - **Text Storage**: Extracted text is stored in MongoDB for text-based queries.

3. **Image Captioning**
   - **Caption Generation**: Utilizes Hugging Face's BLIP Model for generating descriptive captions.
   - **Natural Language Captions**: Captions are stored in MongoDB and can be queried with natural language.

4. **Object Detection**
   - **YOLO-based Detection**: Identifies and labels objects using the YOLO (You Only Look Once) model.
   - **Label Mapping**: Object labels are stored for efficient retrieval based on specific objects.

5. **Face Detection and Recognition**
   - **Face Detection**: Uses the `face_recognition` library for detecting and analyzing faces.
   - **Face Encodings and Tagging**: Supports manual tagging of faces and searching for images with specific or similar faces.
   - **Face Search**: Retrieve images by selecting a reference face to find matching or similar faces.

6. **Multimodal Search Functionality**
   - **Keyword Search**: Search images using keywords from captions, detected objects, or OCR text.
   - **Face-based Search**: Find images with specific faces by selecting a reference face.
   - **Text-based Search**: Query images based on text extracted via OCR.
   - **Object-based Search**: Retrieve images by specifying objects, such as "cake" or "ball."
   - **Combined Search**: Complex queries integrating image captions, object labels, OCR text, and facial recognition.

7. **Frontend Interface**
   - **React.js UI**: Modern, responsive interface for interacting with the system.
   - **Intuitive Navigation**: Use a sidebar to navigate functionalities such as image uploads and searches.
   - **Real-time Feedback**: Provides real-time updates during image processing.

## Prerequisites

- **Node.js**: Version 14 or later
- **Python**: Version 3.7 or later
- **MongoDB**: Local installation or MongoDB Atlas for cloud-based deployment
- **Tesseract OCR**: Install Tesseract from [here](https://github.com/tesseract-ocr/tesseract).

### Required Python Packages

Install the following packages listed in `backend/requirements.txt`:

```plaintext
transformers==4.42.3
pytesseract==0.3.10
face_recognition==1.3.0
sentence-transformers==2.2.2
torch==2.0.0
Pillow==10.0.0
pymongo==4.3.0
nltk==3.8.1'
