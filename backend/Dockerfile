FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    libffi-dev \
    libmariadb-dev-compat \
    libmariadb-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN pip install watchdog && \
    ln -s /usr/local/bin/watchmedo /usr/bin/watchmedo  # ensures watchmedo is globally available

# Copy app
COPY . .

# Default command (can be overridden by docker-compose.override.yml)
CMD gunicorn --worker-class eventlet -w 1 app:app
