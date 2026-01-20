FROM node:22-bullseye-slim

# Install system dependencies (Python, ffmpeg)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy all project files
# We verify the context is the root of the repo
COPY . .

# Setup Python Environment
WORKDIR /app/API
RUN python3 -m venv venv
RUN ./venv/bin/pip install -r requirements.txt

# Setup Node Server
WORKDIR /app/doctor-patient-chat/server
RUN npm install

# Expose the server port
EXPOSE 5001

# Set Environment Variables
# PYTHON_EXECUTABLE must point to the venv python
ENV PYTHON_EXECUTABLE=/app/API/venv/bin/python
ENV PORT=5001
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
