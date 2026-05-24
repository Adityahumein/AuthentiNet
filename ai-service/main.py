import os
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="AuthentiNet Cloud Inference Service",
    description="Production-grade endpoint proxy engine."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContentPayload(BaseModel):
    text: str



SAPLING_API_KEY = "F6Y2HZ6ZVJOG1GSQ7X9GUCABHCV34BYF"

@app.post("/analyze")
async def analyze_text(payload: ContentPayload):
    if not payload.text or not payload.text.strip():
        return {"humanProbability": 1.0, "aiProbability": 0.0}
    
    word_count = len(payload.text.split())
    if word_count < 10:
        return {"humanProbability": 1.0, "aiProbability": 0.0}

    try:
        api_url = "https://api.sapling.ai/api/v1/aidetect"
        api_payload = {
            "key": SAPLING_API_KEY,
            "text": payload.text
        }
        
        print(f"[Dispatching Request] Sending text array to cloud proxy...")
        response = requests.post(api_url, json=api_payload, timeout=8)
        data = response.json()
        
        print(f"[DEBUG CLOUD RESPONSE]: {data}")
        
        # Safe extraction checks
        if "score" in data:
            ai_prob = max(0.0, min(1.0, round(float(data["score"]), 4)))
            human_prob = round(1.0 - ai_prob, 4)
            
            print(f"[Pipeline Success] Output verified -> Human: {human_prob}, AI: {ai_prob}")
            return {
                "humanProbability": human_prob,
                "aiProbability": ai_prob
            }
        else:
            print(f"[Cloud Rejection Frame]: 'score' field missing. Details: {data}")
            return {"humanProbability": 0.5, "aiProbability": 0.5}
        
    except Exception as e:
        print(f"[System Pipeline Exception Critical]: {str(e)}")
        return {"humanProbability": 0.5, "aiProbability": 0.5}

@app.get("/health")
def health_check():
    return {"status": "operational"}