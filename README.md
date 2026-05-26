Markdown
# AuthentiNet: Multi-Media Forensic Workstation

AuthentiNet is an enterprise-grade full-stack forensic application designed to detect synthetic and AI-generated media (PDFs, Images, and Videos). It utilizes a hybrid data model—combining **MongoDB Atlas** for high-throughput metadata logs and a decentralized **Solidity Smart Contract** ledger for immutable file tracking.

## 📐 System Architecture

- **Frontend:** React (Vite) styled with a custom, framework-independent utility layer (`src/App.css`) for high-utility data dashboard tracking.
- **Orchestration Gateway:** Node.js / Express processing asset hashing (SHA-256) and routing Web3 ledger transitions via `ethers.js`.
- **AI Core Cluster:** Python / FastAPI executing deep learning inference pipelines via local `transformers` and `torch` runtimes.
- **Decentralized Fallback Network:** Hardhat EVM network simulator executing immutable forensic tracking logs.

## 🚀 Local Deployment Quickstart

### 1. Start the Local Blockchain Node
```bash
cd blockchain
npm install --legacy-peer-deps
npx hardhat node
2. Deploy the Smart Contract
In a separate terminal:

Bash
npx hardhat run scripts/deploy.js --network localhost
3. Launch the Express Gateway Server
Update your server/.env with the generated CONTRACT_ADDRESS and Account #0's Private Key, then run:

Bash
cd server
npm install
node index.js
4. Initialize the AI Inference Engine
Bash
cd ai-service
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
5. Boot the React Frontend Dashboard
Bash
cd client
npm install
npm run dev

---

## 🔒 Step 2: Double-Check Your `.gitignore` Files
> ⚠️ **CRITICAL SECURITY CHECK:** Before you push anything else to a public GitHub repo, you **must** ensure you are not uploading your secret key files, database passwords, or heavy dependency folders. 

Make sure you have an active `.gitignore` file inside your **`server/`** folder and your **`blockchain/`** folder containing these lines:

```text
# server/.gitignore & blockchain/.gitignore
node_modules/
.env
.artifacts/
cache/
Inside your ai-service/ folder, your .gitignore should look like this:

Plaintext
# ai-service/.gitignore
venv/
__pycache__/
*.pyc
.env