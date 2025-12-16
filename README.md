# 🩺Doctor-Patient Chat App with AI Audio Translation
  
A real-time chat application designed to bridge communication gaps between doctors and patients using advanced AI audio translation.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/Material%20UI-5.x-0081CB)](https://mui.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB)](https://www.python.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101)](https://socket.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-Deployment-46E3B7)](https://render.com/)

## 🏗 Architecture 

The application defines a clear flow for audio processing:

```mermaid
graph TD
    User["User (Client)"] -->|Upload Audio| Node[Node.js Server]
    Node -->|Exec| Python[Python Script]
    Python -->|FFmpeg| Convert[Convert to WAV]
    Convert -->|WebSocket| Gladia[Gladia AI API]
    Gladia -->|Translation| Python
    Python -->|JSON| Node
    Node -->|Response| User
```

## 🚀 Features

- **Real-time Messaging**: Instant text and audio messaging using Socket.io.
- **Role-based Authentication**:
    - **Doctor**: Can set availability, view patient list.
    - **Patient**: Can view available doctors, initiate chat.
- **AI Audio Translation**:
    - Uploads audio files like (mp3, wav, m4a).
    - Automatically transcodes using FFmpeg.
    - Transcribes and translates speech using Gladia API.
- **Responsive Design**: Modern React frontend with Material-like aesthetics.

## 🛠 Tech Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React 18 | UI Library with Hooks |
| **Styling** | CSS Modules | Custom styling (no external UI kit dependency) |
| **Backend** | Node.js / Express | REST API & Static Serving |
| **Real-time** | Socket.io | WebSocket communication |
| **Database** | MongoDB Atlas | Cloud NoSQL Storage |
| **AI/Scripting** | Python 3 | Audio processing logic |
| **Processing** | Pydub / FFmpeg | Audio conversion & manipulation |
| **AI Service** | Gladia API | Real-time Speech-to-Text & Translation |

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **Python**: v3.9+ (v3.13 supported with `audioop-lts`)
- **MongoDB Atlas**: Account and Connection String
- **Gladia API Key**: Account at [gladia.io](https://gladia.io)

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Doctor-Patient-ChatApp.git
cd Doctor-Patient-ChatApp
```

### 2. Backend Setup
The backend is a hybrid Node.js + Python environment.

**a. Install Node Dependencies**
```bash
cd doctor-patient-chat/server
npm install
# Install system binary for audio probing
npm install ffprobe-static
```

**b. Setup Python Virtual Environment**
Go back to the root directory:
```bash
cd ../../API
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd ../doctor-patient-chat/client
npm install
```

## 🔧 Configuration

### Server Environment (`doctor-patient-chat/server/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server Port | `5001` |
| `MONGODB_URI` | MongoDB Connection String | `mongodb+srv://user:pass@...` |
| `JWT_SECRET` | Secret for JWT Tokens | `supersecretkey` |
| `PYTHON_EXECUTABLE` | Path to Python Venv | `../../API/venv/bin/python` |
| `GLADIA_API_KEY` | Your Gladia API Key | `c3d8...` |
| `CLIENT_URL` | Frontend URL (CORS) | `http://localhost:3000` |

### Client Environment (`doctor-patient-chat/client/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend HTTP URL | `http://localhost:5001/api` |
| `REACT_APP_WS_URL` | Backend WebSocket URL | `ws://localhost:5001` |

## 🚀 Deployment

### Backend (Render)
1.  **Type**: Web Service (Docker)
2.  **Build Context**: Root Directory
3.  **Environment Variables**: Add all Server Env vars defined above.
4.  **Network**: Allow IP `0.0.0.0/0` in MongoDB Atlas.

### Frontend (Vercel)
1.  **Framework**: Create React App
2.  **Root Directory**: `doctor-patient-chat/client`
3.  **Environment Variables**: Add Client Env vars pointing to your Render URL.

## 📡 API Reference

#### Auth
- `POST /api/auth/register` - Register new user (Doctor/Patient)
- `POST /api/auth/login` - Login user

#### Users
- `GET /api/users/doctors` - Get list of doctors fast using REST API
- `GET /api/users/availability` - Update doctor status

#### Upload
- `POST /api/upload` - Upload audio for translation
    - **Body**: `multipart/form-data` with `audio` file and `language` string.

## 🐛 Troubleshooting

**Q: Server returns 500 on Audio Upload?**
> **A:** Check log. Often due to missing `ffprobe`. Ensure `npm install ffprobe-static` was run in server and `API/main.py` points to it.

**Q: CORS Error on Vercel?**
> **A:** Ensure `CLIENT_URL` in backend env matches your Vercel domain exactly (no trailing slash).

**Q: Python script fails with `ModuleNotFoundError: No module named 'audioop'`?**
> **A:** You are using Python 3.13+. Ensure `audioop-lts` is installed.

## 📄 License
This project is licensed under the MIT License.

