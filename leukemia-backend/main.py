import torch
import torch.nn as nn
from torchvision import models, transforms
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware  # ✅ CORS ADDED
from PIL import Image
import io
import json

# -----------------------
# FASTAPI APP
# -----------------------
app = FastAPI()

# -----------------------
# 🔥 CORS FIX (VERY IMPORTANT)
# -----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# LOAD CLASS MAPPING
# -----------------------
with open("classes.json", "r") as f:
    class_names = json.load(f)

# -----------------------
# MODEL ARCHITECTURE (SAME AS TRAINING)
# -----------------------
class Attention(nn.Module):
    def __init__(self, hidden_dim):
        super().__init__()
        self.attn = nn.Linear(hidden_dim, 1)

    def forward(self, x):
        weights = torch.softmax(self.attn(x), dim=1)
        context = (weights * x).sum(dim=1)
        return context


class CNN_GRU_Attention(nn.Module):
    def __init__(self):
        super().__init__()

        base_model = models.resnet18(weights=None)
        self.feature_extractor = nn.Sequential(*list(base_model.children())[:-1])

        self.gru = nn.GRU(512, 256, batch_first=True)
        self.attention = Attention(256)

        self.fc = nn.Sequential(
            nn.Linear(256, 128),
            nn.ReLU(),
            nn.Dropout(0.4),
            nn.Linear(128, 1)
        )

    def forward(self, x):
        x = self.feature_extractor(x)
        x = x.view(x.size(0), -1)

        x = x.unsqueeze(1)
        x, _ = self.gru(x)
        x = self.attention(x)

        x = self.fc(x)
        return x

# -----------------------
# LOAD MODEL
# -----------------------
device = torch.device("cpu")

model = CNN_GRU_Attention()
model.load_state_dict(torch.load("leukemia_latest_model.pth", map_location=device))
model.to(device)
model.eval()

# -----------------------
# IMAGE TRANSFORM
# -----------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

# -----------------------
# ROUTES
# -----------------------
@app.get("/")
def home():
    return {"message": "Leukemia Detection API Running 🚀"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        img = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(img)
            prob = torch.sigmoid(output).item()

        prediction = "Leukemia" if prob > 0.5 else "Healthy"
        confidence = prob if prob > 0.5 else 1 - prob

        return {
            "prediction": prediction,
            "confidence": round(confidence * 100, 2)
        }

    except Exception as e:
        return {"error": str(e)}