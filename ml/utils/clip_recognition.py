import torch
import open_clip
from PIL import Image
import numpy as np

# List of real estate relevant prompts (room types, features)
PROMPTS = [
    "kitchen", "bathroom", "living room", "bedroom", "balcony", "exterior", "garden", "sea view", "American kitchen", "Turkish bath", "salon", "site içi", "müstakil", "duplex", "penthouse"
]

# Load model and tokenizer only once
def load_clip_model():
    model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')
    tokenizer = open_clip.get_tokenizer('ViT-B-32')
    return model, preprocess, tokenizer

clip_model, clip_preprocess, clip_tokenizer = load_clip_model()

def recognize_with_clip(image: Image.Image, prompts=PROMPTS):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = clip_model.to(device)
    image_input = clip_preprocess(image).unsqueeze(0).to(device)
    text_inputs = clip_tokenizer(prompts)
    with torch.no_grad():
        image_features = model.encode_image(image_input)
        text_features = model.encode_text(text_inputs)
        image_features /= image_features.norm(dim=-1, keepdim=True)
        text_features /= text_features.norm(dim=-1, keepdim=True)
        similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)
        values, indices = similarity[0].topk(3)
    results = [(prompts[i], float(values[j])) for j, i in enumerate(indices)]
    return results

# Example usage:
if __name__ == "__main__":
    img = Image.open("test_property.jpg")
    print(recognize_with_clip(img))
