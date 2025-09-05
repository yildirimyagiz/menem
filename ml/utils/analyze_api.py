from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io
import base64
import torch
from torchvision import models, transforms
import uvicorn
import magic
import os
from datetime import datetime

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and labels once
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
model.eval()
with open("imagenet_classes.txt", "r") as f:
    labels = [line.strip() for line in f.readlines()]

def analyze_image(image: Image.Image):
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    input_tensor = preprocess(image.convert("RGB")).unsqueeze(0)
    with torch.no_grad():
        output = model(input_tensor)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
    top3_prob, top3_catid = torch.topk(probabilities, 3)
    tags = [labels[catid] for catid in top3_catid]
    return tags

def image_to_base64(image: Image.Image) -> str:
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode()

def image_to_svg(image: Image.Image) -> str:
    # Simple placeholder: SVG with image embedded as base64
    base64str = image_to_base64(image)
    w, h = image.size
    svg = f'<svg width="{w}" height="{h}" xmlns="http://www.w3.org/2000/svg">\n'
    svg += f'<image href="data:image/jpeg;base64,{base64str}" width="{w}" height="{h}" />\n'
    svg += '</svg>'
    return svg

@app.post("/ml/analyze")
async def analyze(photo: UploadFile = File(...)):
    file_bytes = await photo.read()
    mime = magic.Magic(mime=True)
    mime_type = mime.from_buffer(file_bytes)
    if not mime_type.startswith("image/"):
        return JSONResponse({"error": "Uploaded file is not an image."}, status_code=400)
    image = Image.open(io.BytesIO(file_bytes))
    tags = analyze_image(image)
    recognition = tags  # For demo, use same as tags
    album = "interior" if "sofa" in tags or "bed" in tags else "exterior"
    base64str = image_to_base64(image)
    svg = image_to_svg(image)

    # Save converted images to disk
    save_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "converted"))
    os.makedirs(save_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    base64_path = os.path.join(save_dir, f"{timestamp}_photo.txt")
    svg_path = os.path.join(save_dir, f"{timestamp}_photo.svg")
    with open(base64_path, "w") as f:
        f.write(base64str)
    with open(svg_path, "w") as f:
        f.write(svg)

    return JSONResponse({
        "tags": tags,
        "recognition": recognition,
        "album": album,
        "base64": base64str,
        "svg": svg,
        "base64_path": base64_path,
        "svg_path": svg_path,
    })

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
