FROM node:18-slim

# Install Python, pip, and ffmpeg
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy server files
# Note: Paths are relative to the project root
COPY doctor-patient-chat/server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy API files (Python)
WORKDIR /app
COPY API/requirements.txt ./API/
WORKDIR /app/API
# Create venv and install dependencies
RUN python3 -m venv venv && \
    ./venv/bin/pip install -r requirements.txt

# Copy source code
WORKDIR /app
COPY doctor-patient-chat/server/ ./server/
COPY API/ ./API/

# Set Environment Variables
# Point to the venv python executable
ENV PYTHON_EXECUTABLE=/app/API/venv/bin/python
ENV FFMPEG_PATH=/usr/bin/ffmpeg
ENV PORT=5001

# Expose port
EXPOSE 5001

# Start server
WORKDIR /app/server
CMD ["node", "server.js"]
