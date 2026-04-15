# 🧬 Leukemia Detection using Deep Learning with GRU

## 📌 Project Overview

This project presents an AI-powered system for detecting **Acute Lymphoblastic Leukemia (ALL)** from **Peripheral Blood Smear (PBS) images** using deep learning.

The system classifies blood cell images into:

* 🟢 Healthy (Benign)
* 🔴 Leukemia (Malignant)

It provides a **fast, automated, and accurate diagnosis support tool** for students, researchers, and healthcare professionals.

---

## 🎯 Objectives

* Automate leukemia detection using AI
* Reduce dependency on manual microscopic analysis
* Provide real-time predictions via a web interface
* Achieve high accuracy using deep learning techniques

---

## 🧪 Dataset Details

* **Source:** Kaggle (Blood Cell Cancer ALL dataset)
* **Total Images:** ~4000+
* **Image Type:** Peripheral Blood Smear (PBS) images
* **Classes:**

  * Benign (Healthy)
  * Malignant:

    * Early Pre-B
    * Pre-B
    * Pro-B
      
## 📦 Dataset Download

Due to GitHub size limitations, the dataset is not included in this repository.

You can download it from:

👉 [Download Dataset (Google Drive)](https://drive.google.com/drive/folders/1xBvBt66ow2LmtPNHmPLU00D-0kN0NG5i?usp=sharing)

Dataset Details:
- ~4000+ images
- Peripheral Blood Smear (PBS)
- Classes: Benign, Early Pre-B, Pre-B, Pro-B 

### 🔄 Preprocessing

* Resized images
* Normalization
* Data augmentation (flip, rotation, etc.)
* Converted to binary classification:

  * Healthy vs Leukemia

---

## 🧠 Model Architecture

* Framework: **PyTorch**
* Type: **Convolutional Neural Network (CNN)**
* Output: Binary classification using **Sigmoid activation**

### ⚙️ Training Details

* Loss Function: Binary Cross Entropy Loss (BCE)
* Optimizer: Adam
* Scheduler: ReduceLROnPlateau
* Epochs: Multiple training cycles with checkpointing
* Gradient Clipping used for stability

### 📊 Performance

* Training Accuracy: ~88%
* Validation Accuracy: ~88–90%
* High confidence predictions on unseen data

---

## 💻 Tech Stack

### 🧠 AI / ML

* Python
* PyTorch
* NumPy, Matplotlib

### 🌐 Backend

* FastAPI
* Uvicorn

### 🎨 Frontend

* Next.js
* React
* Tailwind CSS

### ☁️ Tools

* Google Colab (Training)
* GitHub (Version Control)

---

## 📂 Project Structure

```
LeukemiaDetection-GRU/
├── leukemia-backend/
│   ├── main.py
│   ├── classes.json
│   └── requirements.txt
│
├── leukemia-ui/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── model_v1.ipynb
├── .gitignore
└── README.md
```

---

## ⚙️ How to Run the Project

### 🔹 Backend Setup

```bash
cd leukemia-backend
pip install -r requirements.txt
python main.py
```

---

### 🔹 Frontend Setup

```bash
cd leukemia-ui
npm install
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

## 🧪 Testing

* Upload a new unseen blood smear image
* Model predicts:

  * Class (Healthy / Leukemia)
  * Confidence score (%)

---

## 📸 Sample Output

* Prediction: Leukemia
* Confidence: 88.18%

---

## 🚀 Features

* Real-time prediction
* Image upload interface
* Confidence score output
* Clean UI for medical use
* End-to-end pipeline (UI → API → Model)

---

## ⚠️ Limitations

* Not a replacement for professional medical diagnosis
* Limited dataset size
* Binary classification (subtypes grouped)

---

## 🔮 Future Improvements

* Multi-class classification (Early Pre-B, Pre-B, Pro-B)
* Larger dataset training
* Model optimization for deployment
* Mobile app integration
* Cloud deployment

---

## 👨‍💻 Author

**Danish Shaikh**
AI/ML Enthusiast | Full Stack Developer

---

## 📜 Disclaimer

This project is for **educational and research purposes only**.
Always consult a certified medical professional for diagnosis.

---
