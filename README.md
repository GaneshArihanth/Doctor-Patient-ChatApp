# Doctor-Patient Chat App with AI Audio Translation

A real-time chat application for doctors and patients, featuring AI-powered audio translation using Gladia API. This application allows users to send text and audio messages, with audio automatically transcribed and translated.

## 🚀 Features

- **Real-time Messaging**: Instant text and audio messaging using Socket.io.
- **Role-based Auth**: Separate login/registration for Doctors and Patients.
- **Audio Translation**: Uploaded audio is processed via Python and Gladia API for transcription and translation.
- **Doctor Availability**: Doctors can set their availability status.
- **Responsive Design**: Modern React frontend with a clean UI.

## 🛠️ Tech Stack

### Frontend
- **React.js**: UI Library
- **Axios**: API Requests
- **Socket.io-client**: Real-time communication
- **Vercel**: Deployment platform

### Backend
- **Node.js & Express**: Server framework
- **MongoDB**: Database (Atlas)
- **Socket.io**: WebSocket server
- **Multer**: File handling
- **Render**: Deployment platform (Dockerized)

### AI & Processing
- **Python 3**: scripting for audio processing
- **Pydub & FFmpeg**: Audio manipulation
- **Gladia API**: Speech-to-Text and Translation

## 📋 Prerequisites

- Node.js (v16+)
- Python 3.9+
- MongoDB Atlas Account
- Gladia API Key

## ⚙️ Local Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Doctor-Patient-ChatApp.git
cd Doctor-Patient-ChatApp
```

### 2. Backend Setup
The backend requires both Node.js and Python environments.

**Navigate to server:**
```bash
cd doctor-patient-chat/server
npm install
```

**Setup Python Virtual Environment:**
Open a new terminal in the project root:
```bash
cd API
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Configure Environment Variables:**
Create `doctor-patient-chat/server/.env`:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PYTHON_EXECUTABLE=/absolute/path/to/project/API/venv/bin/python
GLADIA_API_KEY=your_gladia_key
CLIENT_URL=http://localhost:3000
```

**Start the Server:**
```bash
cd doctor-patient-chat/server
npm start
```

### 3. Frontend Setup
**Navigate to client:**
```bash
cd doctor-patient-chat/client
npm install
```

**Configure Environment Variables:**
Create `doctor-patient-chat/client/.env`:
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_WS_URL=ws://localhost:5001
```

**Start the Client:**
```bash
npm start
```

## 🚀 Deployment

### Backend (Render)
The backend is Dockerized to support both Node.js and Python.
1.  Connect repo to Render.
2.  Select **Docker** Runtime.
3.  Add Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `GLADIA_API_KEY`, `CLIENT_URL`.
4.  **Important**: Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access.

### Frontend (Vercel)
1.  Import project to Vercel.
2.  Set Root Directory to `doctor-patient-chat/client`.
3.  Add Environment Variables:
    - `REACT_APP_API_URL`: `https://your-render-backend.onrender.com/api`
    - `REACT_APP_WS_URL`: `wss://your-render-backend.onrender.com`

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **500 Error on Upload** | Check `PYTHON_EXECUTABLE` path. Ensure `ffprobe` is installed (`npm install ffprobe-static` in server). |
| **CORS Error** | Check `CLIENT_URL` in backend env and ensure Vercel URL is added. |
| **MongoDB Error** | Whitelist IP `0.0.0.0/0` in MongoDB Atlas. |
| **Audio Processing Fail** | Ensure virtual environment (`venv`) dependencies are installed. |

## 📂 Project Structure
```
Doctor-Patient-ChatApp/
├── API/                 # Python scripts for audio processing
├── doctor-patient-chat/
│   ├── client/          # React Frontend
│   └── server/          # Node.js/Express Backend
├── Dockerfile           # Backend deployment config
└── README.md
```
