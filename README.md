# AuthentiNet: Multi-Language AI Content Provenance Mesh

AuthentiNet is a secure full-stack text verification system designed to preserve media authenticity. The platform implements a decoupled microservice mesh architecture to seamlessly compute deterministic SHA-256 cryptographic proof-of-origin strings while simultaneously running linguistic token analysis against specialized machine learning models to detect synthetic generative patterns.

## 🛠️ System Architecture

The application scales computational demands by decoupling web infrastructure from heavy deep learning inference layers:

* **Client Layer (Vite + React):** An ultra-minimal high-contrast workspace styled under strict dark monochrome layouts. Handles active authorization token validation and states using browser caching matrices.
* **API Gateway (Node.js + Express):** A central request controller guarded by custom asynchronous JWT token evaluation middleware. Enforces secure, tamper-proof creator tracking and performs SHA-256 fingerprint generation.
* **Persistence Layer (MongoDB):** A document data store handling user profile schemas and recording irreversible content checksum history logs.
* **Analytical Inference Node (Python FastAPI):** An independent background microservice acting as a low-latency proxy engine that maps processed payload arrays directly to production cloud classification clusters (Sapling AI API).

---

## 🚀 Technical Features

* **JWT Security Middlewares:** Eliminates client-side state manipulation by extracting ownership details strictly from verified, cryptographically signed network header frames.
* **Adversarial Drift Prevention:** Bypasses model obsolescence by routing payloads to an evolving cloud-based ensemble linguistic detector.
* **Immutable Cryptographic Fingerprinting:** Generates unique content hashes based on composite block variables (`userId + text + timestamp`), rendering data records resistant to retrospective tampering.

---

## 💻 Tech Stack Matrix

| Layer | Technologies Utilized |
| :--- | :--- |
| **Frontend UI** | React.js (v18), Vite, Tailwind CSS, Axios |
| **Gateway App** | Node.js, Express, JavaScript (ES6+), Mongoose |
| **Security Core** | JSON Web Tokens (JWT), Cryptographic Hashing (`crypto`), Bcryptjs |
| **Inference Engine** | Python 3.11+, FastAPI, Requests, Pydantic |
| **Database Engine** | MongoDB Compass / Atlas Cluster Array |

---

## ⚡ Setup & Local Installation

### Prerequisites
* Node.js (v18+) Installed
* Python (3.10+) Installed
* MongoDB Compass running locally on `mongodb://127.0.0.1:27017`

### 1. Stand Up the AI Microservice
```bash
cd ai-service
python -m venv venv
source venv/Scripts/activate  # On Windows use: venv\Scripts\activate
pip install fastapi uvicorn requests pydantic
uvicorn main:app --reload --port 8000