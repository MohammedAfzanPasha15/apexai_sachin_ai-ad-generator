<div align="center">

  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY2J6Y3U3Y3U3Y3U3Y3U3Y3U3Y3U3Y3U3Y3U3Y3U3Y3U/xT9IgzoKnwFNmISR8I/giphy.gif" alt="Apex AI Logo Animation" width="200" height="auto" />

  # ⚡ APEX AI
  ### NEXT‑GEN AI ADVERTISEMENT GENERATOR

  <p>
    <b>The Artificial Intelligence that Thinks Like a Marketer.</b>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img src="https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
    <img src="https://img.shields.io/badge/FastAPI-0.95+-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img src="https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white" />
    <img src="https://img.shields.io/badge/Status-Active_Development-success?style=for-the-badge" />
  </p>

  <p>
    <a href="#-core-capabilities">Capabilities</a> •
    <a href="#-demo">Visual Demo</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-tech-stack">Tech Stack</a>
  </p>
</div>

---

## 🧠 Project Overview

**APEX AI** is not just a tool; it is a creative engine. It bridges the gap between raw product data and high-conversion marketing campaigns.

Instead of manually brainstorming ads, slogans, or campaigns, **APEX AI** understands the product, target audience, and tone, then generates optimized advertising content in seconds.

> **"Seconds, not hours. Impact, not guessing."**

---

## 🌌 The AI Generation Pipeline

We utilize a multi-modal approach to transform a simple prompt into a full marketing suite.

```mermaid
graph TD;
    A[User Input] -->|Product & Goal| B(Prompt Engineering Layer);
    B --> C{Generative AI Core};
    C -->|Text Generation| D[Smart Copy];
    C -->|Visual Concepts| E[Creative Direction];
    C -->|Strategy| F[Marketing Logic];
    D --> G[Ad Optimization Engine];
    E --> G;
    F --> G;
    G -->|Final Polish| H[🚀 FINAL MARKETING OUTPUT];
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style H fill:#bbf,stroke:#333,stroke-width:4px,color:black
    style C fill:#ff9,stroke:#333,stroke-width:2px,color:black



🛠️ Tech Stack & DependenciesComponentTechnologyRoleBackendPython 3.10+Core LanguageFastAPIHigh-speed Async API FrameworkUvicornASGI ServerPydanticData Validation & Schema enforcementFrontendReact.js (Vite)UI LibraryTailwind CSSStyling SystemFramer MotionAnimation LibraryLucide ReactIconographyAILangChainLLM Orchestration (Optional)OpenAI APIIntelligence Model🚀 Installation & SetupFollow these steps to deploy the local development environment.1️⃣ PrerequisitesPython 3.10 or higherNode.js 18+ and npmAn OpenAI API Key2️⃣ Clone the RepositoryBashgit clone [https://github.com/MohammedAfzanPasha15/apexai_sachin_ai-ad-generator.git](https://github.com/MohammedAfzanPasha15/apexai_sachin_ai-ad-generator.git)
cd apexai_sachin_ai-ad-generator
3️⃣ Backend ConfigurationNavigate to the backend folder and set up the Python environment.Bash# Enter backend directory (or root if main.py is in root)
python -m venv .venv

# Activate Virtual Environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install Dependencies
pip install -r requirements.txt
🔑 Set up Environment Variables:Create a .env file in the root directory:Ini, TOMLOPENAI_API_KEY=sk-your-key-here-xxxxxxxxxxxx
ALLOWED_ORIGINS=http://localhost:5173
PORT=8000
Run the Backend:Bashpython main.py
# Server should start at http://localhost:8000
4️⃣ Frontend ConfigurationOpen a new terminal for the React application.Bashcd frontend

# Install Node modules
npm install

# Start Development Server
npm run dev
🚀 Access the App: Open http://localhost:5173 in your browser.🔌 API DocumentationIf you wish to integrate APEX AI into other apps, use these endpoints:<details><summary><b>🔵 POST /generate-ad</b> (Click to expand)</summary>Description: Generates full ad copy and strategy.Body:JSON{
  "product_name": "EcoBottle",
  "description": "A self-cleaning water bottle",
  "target_audience": "Hikers",
  "tone": "Adventurous"
}
Response:JSON{
  "headline": "Pure Water, Anywhere.",
  "body": "Meet the bottle that cleans itself...",
  "keywords": ["#hiking", "#eco", "#tech"]
}
</details><details><summary><b>🔵 GET /health</b> (Click to expand)</summary>Description: Checks if the API and AI services are online.</details>📂 Directory StructureBashapexai/
├── 📂 backend/
│   ├── 📂 routers/         # API Route definitions
│   ├── 📂 services/        # AI Logic & Prompt Templates
│   ├── 📄 main.py          # App Entry point
│   └── 📄 models.py        # Pydantic Schemas
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/  # Reusable UI (Cards, Buttons)
│   │   ├── 📂 pages/       # Dashboard, Generator Views
│   │   └── 📂 assets/      # Images & Animations
│   └── 📄 package.json
├── 📄 .env.example         # Template for keys
└── 📄 README.md            # You are here
⚠️ TroubleshootingIssue: Module not found in PythonSolution: Ensure you activated the virtual environment (.venv\Scripts\activate) before running pip install.Issue: Frontend cannot connect to BackendSolution: Check CORS settings in main.py. Ensure the backend is running on port 8000 and frontend on 5173.Issue: OpenAI Rate Limit ErrorSolution: Check your OpenAI credit balance or add a payment method to your OpenAI account.👨‍💻 Author<div align="center"><img src="https://www.google.com/search?q=https://avatars.githubusercontent.com/u/108503673%3Fv%3D4" width="100px" style="border-radius:50%"/><b>Mohammed Afzan Pasha</b><i>AI Engineer • Full-Stack Developer • Innovator</i><div align="center"><sub>© 2026 APEX AI. Licensed under MIT. Made with ⚡ in India.</sub></div>
