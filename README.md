# AI Portfolio Assistant 🤖

An AI-powered personal portfolio chatbot that answers questions about my profile, technical skills, projects, achievements, and experience using my resume and profile information.

## ✨ Features

- **AI-Powered Chatbot:** Ask questions about my professional profile in natural language.
- **Resume-Based Answers:** Uses resume information and profile data to provide relevant responses.
- **Project & Skills Information:** Explore my technical skills, projects, and development experience.
- **Quick Link Access:** Get links to my GitHub, LinkedIn, and other relevant profiles.
- **Job Match Analysis:** Evaluate how my skills and experience align with a job description.
- **Reliable Responses:** Designed to avoid unsupported claims and respond appropriately when information is unavailable.
- **Responsive UI:** Chat interface designed for desktop and mobile devices.

## 🛠️ Tech Stack

**Frontend**

- React.js
- Vite
- CSS

**Backend**

- Python
- FastAPI
- Groq API

## 📁 Project Structure

```text
AI-Portfolio-Assistant/
├── app/
│   ├── main.py
│   ├── profile.py
│   └── resume_reader.py
├── data/
│   └── resume.pdf
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── test_match_job.py
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd AI-Portfolio-Assistant
```

### 2. Set Up the Python Backend

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the project root and add your API key:

```env
GROQ_API_KEY=your_groq_api_key
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

The backend will be available at `http://127.0.0.1:8000`.

### 3. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## 🔐 Environment Variables

| Variable       | Description                                    |
| -------------- | ---------------------------------------------- |
| `GROQ_API_KEY` | API key used to access the Groq language model |

**Security:** Never commit API keys, `.env` files, or private personal documents to a public repository.

## 🧪 Testing

Run the job-matching test file from the project root:

```bash
python test_match_job.py
```

## 🚀 Deployment

The frontend can be deployed on Vercel, while the FastAPI backend can be hosted separately on a compatible Python hosting platform. Configure the production API URL and environment variables before deployment.

## 👨‍💻 Author

**Sachin Yadav**

- GitHub: [sjyadav07](https://github.com/sjyadav07)
- LinkedIn: [Sachin Yadav](https://www.linkedin.com/in/sachinyadav-it/)

---

Built to make exploring my professional profile and projects easier through conversational AI.
