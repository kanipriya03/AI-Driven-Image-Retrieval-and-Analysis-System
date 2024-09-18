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

  ```
   transformers==4.42.3
   pytesseract==0.3.10
   face_recognition==1.3.0
   sentence-transformers==2.2.2
   torch==2.0.0
   Pillow==10.0.0
   pymongo==4.3.0
   nltk==3.8.1
```


### Setup Instructions

## Backend Setup

1. **Clone the Repository:**
    ```
    git clone https://github.com/your-username/my_local_folder.git
    cd my_local_folder
    ```

2. **Install Python Dependencies:**
    - Navigate to the backend directory:
      ```
      cd backend
      ```
    - Set up a virtual environment:
      ```
      python -m venv env
      ```
      Activate the virtual environment:
      ```bash
      # For Windows: env\Scripts\activate
      ```
    - Install the required packages:
      ```
      pip install -r requirements.txt
      ```

3. **Set Up Tesseract for OCR:**
    - Follow the instructions on the Tesseract OCR installation page.

4. **Configure MongoDB:**
    - Update `db.js` with your MongoDB connection string. For MongoDB Atlas, refer to [this guide](https://docs.atlas.mongodb.com/) for your connection string.

## Frontend Setup

1. **Navigate to the Frontend Directory:**
    ```
    cd ../frontend
    ```

2. **Install Node.js Dependencies:**
    ```
    npm install
    ```

3. **Run the React Development Server:**
    ```
    npm start
    ```
    - Access the application in your browser at `http://localhost:3000`.

## Running the Backend Server

1. **Start the backend server from the `backend/` directory:**
    ```
    node app.js
    ```
    - The backend will be accessible at `http://localhost:5000`.

## How to Use

1. **Uploading Images:**
    - Navigate to the Upload page.
    - Select images or a ZIP file to upload.
    - The system will process the images to extract text, detect objects, recognize faces, and generate captions.
    - Metadata for each image will be stored in MongoDB.

2. **Searching for Images:**
    - Go to the Search page.
    - Enter keywords, object labels, or facial features to retrieve relevant images.
    - The search functionality uses:
        - **Synonyms:** Extracts synonyms and performs queries based on these.
        - **Text Similarity:** Uses Jaro-Winkler similarity to match terms against text in the database.

3. **Face Tagging:**
    - Visit the Faces section to view detected faces.
    - Tag faces with names or search for images containing the same or similar faces.

4. **Viewing and Managing Images:**
    - In the Images section, browse through uploaded images and their metadata, including OCR text, captions, and object labels.

## Future Enhancements

- **Advanced Search Capabilities:** Enhance search functionalities with more complex queries combining text, objects, and face recognition.
- **Improved Face Detection:** Integrate additional models or techniques to improve face recognition accuracy.
- **Performance Optimization:** Optimize the system to handle larger datasets and high-volume queries efficiently.

## Contributions

- Contributions are welcome! To contribute:
  - Open an issue on GitHub.
  - Submit a pull request with your changes.
  - Please adhere to the repository’s contribution guidelines and ensure your code passes all tests before submitting.





