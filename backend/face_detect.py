import sys
import json
import uuid
import hashlib
import face_recognition
import numpy as np
from pymongo import MongoClient
from bson.binary import Binary
from PIL import Image
import io
import base64

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')  
db = client['imageana']

# Define collections
faces_with_boxes_collection = db['faces_with_boxes']
faces_collection = db['faces']

def generate_short_uuid():
    """Generate a short unique ID."""
    return str(uuid.uuid4().hex)[:24]

def generate_hash(buffer):
    """Generate a hash from the image buffer."""
    return hashlib.sha256(buffer).hexdigest()

def find_existing_face_id(face_encoding):
    """Find an existing face ID based on the face encoding."""
    for doc in faces_collection.find():
        stored_encoding = np.array(doc["face_encoding"], dtype=np.float64)
        if face_recognition.compare_faces([stored_encoding], face_encoding)[0]:
            return doc["unique_id"]
    return None

def save_face_with_box(image, face_encoding, unique_id, hash_value, face_location):
    """Save face with bounding box details to the faces_with_boxes_collection."""
    top, right, bottom, left = face_location
    face_image = image[top:bottom, left:right]
    
    pil_image = Image.fromarray(face_image)
    buffered = io.BytesIO()
    pil_image.save(buffered, format="JPEG")
    face_img_bytes = buffered.getvalue()
    face_img_base64 = base64.b64encode(face_img_bytes).decode('utf-8')

    faces_with_boxes_collection.insert_one({
        "hash": hash_value,  # Use the same hash for all faces in the image
        "image": face_img_base64,
        "face_location": {"top": top, "right": right, "bottom": bottom, "left": left},
        "unique_id": unique_id,
        "encoding": Binary(face_encoding.tobytes())
    })

def main(image_path):
    """Main function to process the image and store face data."""
    # Read the image as bytes to generate hash
    with open(image_path, "rb") as f:
        buffer = f.read()

    # Generate hash from image buffer
    hash_value = generate_hash(buffer)

    # Load and process the image
    image = face_recognition.load_image_file(image_path)
    face_locations = face_recognition.face_locations(image)
    face_encodings = face_recognition.face_encodings(image, face_locations)

    if not face_encodings:
        print(json.dumps({'face_encodings': [], 'unique_ids': [], 'hash': hash_value}))
        return

    unique_ids = []
    
    for encoding, location in zip(face_encodings, face_locations):
        unique_id = find_existing_face_id(encoding)
        if not unique_id:
            unique_id = generate_short_uuid()

        # Save face data with the same image hash
        save_face_with_box(image, encoding, unique_id, hash_value, location)
        unique_ids.append(unique_id)

    output = {
        'face_encodings': [encoding.tolist() for encoding in face_encodings],
        'unique_ids': unique_ids,
        'hash': hash_value  # Include the same hash for the entire image
    }
    
    print(json.dumps(output))

if len(sys.argv) != 2:
    print("Usage: python face_detect.py <image_path>")
    sys.exit(1)

image_path = sys.argv[1]
main(image_path)
