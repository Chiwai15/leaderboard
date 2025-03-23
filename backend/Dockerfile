FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

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
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt
RUN pip install watchdog && \
    ln -s /usr/local/bin/watchmedo /usr/bin/watchmedo  # ensures watchmedo is globally available

COPY . .

EXPOSE 5001

CMD ["gunicorn", "server:app", "-c", "gunicorn.conf.py"]