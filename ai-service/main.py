import io
import torch
import requests
import cv2  # Native OpenCV video analytics
import numpy as np
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from PIL import Image
from transformers import AutoModelForSequenceClassification, AutoTokenizer, AutoImageProcessor, AutoModelForImageClassification

app = FastAPI(
    title="AuthentiNet Hybrid Multi-Media Inference Router",
    description="Text payloads route to Sapling Cloud; Documents, Images, and Videos process locally."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Cloud Infrastructure Credential Tracking Gate
SAPLING_API_KEY = "F6Y2HZ6ZVJOG1GSQ7X9GUCABHCV34BYF"

# 2. Local Text Infrastructure Model Core (Loaded hot into RAM)
print("[System Init] Loading Local Text Processor (RoBERTa-Large)...")
TEXT_MODEL_NAME = "roberta-large-openai-detector"
text_tokenizer = AutoTokenizer.from_pretrained(TEXT_MODEL_NAME)
text_model = AutoModelForSequenceClassification.from_pretrained(TEXT_MODEL_NAME)

# 3. Local Image/Video Infrastructure Model Core (Swin Transformer)
print("[System Init] Loading Local Image/Video Processor (Swin Transformer)...")
IMAGE_MODEL_NAME = "umm-maybe/AI-image-detector"
image_extractor = AutoImageProcessor.from_pretrained(IMAGE_MODEL_NAME)
image_model = AutoModelForImageClassification.from_pretrained(IMAGE_MODEL_NAME)

print("[System Ready] All core AI engines are loaded and ready.")

class ContentPayload(BaseModel):
    text: str


# ─── ROUTE 1: PLAIN TEXT INGESTION (SAPLING CLOUD ACCURACY CORES) ───
@app.post("/analyze")
async def analyze_text(payload: ContentPayload):
    if not payload.text or not payload.text.strip():
        return {"humanProbability": 1.0, "aiProbability": 0.0}
        
    print(f"[Route Matrix: Cloud API] Analyzing text snapshot ({len(payload.text.split())} words)...")
    
    try:
        api_url = "https://api.sapling.ai/api/v1/aidetect"
        api_payload = {"key": SAPLING_API_KEY, "text": payload.text}
        
        response = requests.post(api_url, json=api_payload, timeout=8)
        data = response.json()
        
        if "score" in data:
            ai_prob = max(0.0, min(1.0, float(data["score"])))
            human_prob = round(1.0 - ai_prob, 4)
            return {"humanProbability": human_prob, "aiProbability": round(ai_prob, 4)}
            
        print(f"[Cloud API Error Frame]: 'score' key missing. Payload: {data}")
        return {"humanProbability": 0.5, "aiProbability": 0.5}
        
    except Exception as e:
        print(f"[Cloud Fallback Warning]: {str(e)}")
        return {"humanProbability": 0.5, "aiProbability": 0.5}


# ─── ROUTE 2: MULTI-MEDIA FILE DROPZONE (LOCAL HARDWARE CHUNKING) ───
# --- ROUTE 2: MULTI-MEDIA FILE DROPZONE (FIXED MULTIPART STREAM) ---
@app.post("/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    try:
        print(f"[Route Matrix] Intercepted asset payload: {file.filename}")
        filename_lower = file.filename.lower()

        # ────────────────────────────────────────────────────────
        # TRACK A: DOCUMENT TEXT PROCESSING PIPELINE
        # ────────────────────────────────────────────────────────
        if filename_lower.endswith('.pdf') or file.content_type == 'application/pdf':
            file_bytes = await file.read() # Read bytes only inside the PDF thread block
            extracted_text = ""
            pdf_stream = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_stream)
            for page in reader.pages:
                text_content = page.extract_text()
                if text_content:
                    extracted_text += text_content + "\n"
            
            words = extracted_text.split()
            if len(words) == 0:
                return {"humanProbability": 1.0, "aiProbability": 0.0, "extractedText": "Blank PDF layers."}

            total_ai_score = 0.0
            chunk_count = 0
            for i in range(0, len(words), 500):
                chunk_text = " ".join(words[i:i + 500])
                if len(chunk_text.split()) < 10: continue
                inputs = text_tokenizer(chunk_text, return_tensors="pt", truncation=True, max_length=512)
                with torch.no_grad():
                    outputs = text_model(**inputs)
                    probabilities = torch.softmax(outputs.logits, dim=-1).tolist()[0]
                total_ai_score += probabilities[0]
                chunk_count += 1
                
            avg_ai_prob = round(total_ai_score / max(1, chunk_count), 4)
            return {"humanProbability": round(1.0 - avg_ai_prob, 4), "aiProbability": avg_ai_prob, "extractedText": extracted_text}

        # ────────────────────────────────────────────────────────
        # TRACK B: DIGITAL IMAGE FORENSIC PIPELINE (STREAM FIXED)
        # ────────────────────────────────────────────────────────
        elif file.content_type.startswith('image/') or filename_lower.endswith(('.png', '.jpg', '.jpeg', '.webp')):
            print(" -> Extracting clean image matrix stream...")
            
            # CRITICAL FIX: Pass the native file-like descriptor stream directly to Pillow
            # This strips out Axios multi-part metadata headers completely
            img = Image.open(file.file).convert("RGB")
            
            inputs = image_extractor(images=img, return_tensors="pt")
            with torch.no_grad():
                outputs = image_model(**inputs)
                probabilities = torch.softmax(outputs.logits, dim=-1).tolist()[0]
            
            # Index 0 is AI/Synthetic, Index 1 is Human/Real
            ai_prob = round(probabilities[0], 4)
            human_prob = round(probabilities[1], 4)
            
            print(f" -> [DEBUG LIVE ARRAY]: {probabilities}")
            print(f" -> [Vision Done] Real: {human_prob * 100}% | Synthetic: {ai_prob * 100}%")
            
            return {
                "humanProbability": human_prob, 
                "aiProbability": ai_prob, 
                "extractedText": f"Image processing completed for {file.filename}"
            }

        # ────────────────────────────────────────────────────────
        # TRACK C: VIDEO FRAME PARSING PIPELINE (STREAM FIXED)
        # ────────────────────────────────────────────────────────
        elif file.content_type.startswith('video/') or filename_lower.endswith(('.mp4', '.mkv', '.avi', '.mov')):
            print(f" -> Video Core Detected. Buffering stream safely...")
            
            file_bytes = await file.read() # Only read video bytes here
            temp_video_path = f"temp_{file.filename}"
            with open(temp_video_path, "wb") as f:
                f.write(file_bytes)

            video_capture = cv2.VideoCapture(temp_video_path)
            fps = video_capture.get(cv2.CAP_PROP_FPS)
            if fps <= 0: fps = 30 
            
            frame_interval = int(fps)
            total_human_score = 0.0
            total_ai_score = 0.0
            sampled_frames_count = 0
            current_frame_index = 0

            while True:
                success, frame = video_capture.read()
                if not success: break

                if current_frame_index % frame_interval == 0:
                    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    pil_img = Image.fromarray(rgb_frame)
                    
                    inputs = image_extractor(images=pil_img, return_tensors="pt")
                    with torch.no_grad():
                        outputs = image_model(**inputs)
                        probabilities = torch.softmax(outputs.logits, dim=-1).tolist()[0]
                    
                    total_ai_score += probabilities[0]
                    total_human_score += probabilities[1]
                    sampled_frames_count += 1

                current_frame_index += 1

            video_capture.release()
            if os.path.exists(temp_video_path):
                os.remove(temp_video_path)

            if sampled_frames_count == 0:
                raise HTTPException(status_code=400, detail="Could not parse valid frames.")

            final_human_prob = round(total_human_score / sampled_frames_count, 4)
            final_ai_prob = round(total_ai_score / sampled_frames_count, 4)

            print(f" -> [Video Done] Processed {sampled_frames_count} frames. AI Score: {final_ai_prob * 100}%")
            return {
                "humanProbability": final_human_prob,
                "aiProbability": final_ai_prob,
                "extractedText": f"Video forensic classification complete."
            }

        else:
            raise HTTPException(status_code=400, detail="Unsupported file format specification.")

    except Exception as e:
        print(f"[Core Local Pipeline Error]: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))