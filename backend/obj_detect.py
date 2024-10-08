from transformers import AutoFeatureExtractor, AutoModelForObjectDetection
from PIL import Image
import torch
import json
import sys

# Object detection setup
processor = AutoFeatureExtractor.from_pretrained("hustvl/yolos-tiny")
model = AutoModelForObjectDetection.from_pretrained("hustvl/yolos-tiny")
model_config = model.config

def detect_objects(image):
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    inputs = processor(images=image, return_tensors="pt")
    outputs = model(**inputs)
    
    target_sizes = torch.tensor([image.size[::-1]])
    results = processor.post_process_object_detection(outputs, target_sizes=target_sizes)[0]

    labels = []
    for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
        if score >= 0.5:
            labels.append({'label': model_config.id2label[label.item()], 'score': score.item(), 'box': box.tolist()})
    return labels

if __name__ == "__main__":
    image_path = sys.argv[1]
    image = Image.open(image_path)
    detections = detect_objects(image)
    # Output as a JSON string
    print(json.dumps(detections))
