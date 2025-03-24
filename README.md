# 🏆 Leaderboard App

This is a full-stack leaderboard web application built with **Flask** (backend), **React + Vite** (frontend), **MySQL**, and **Redis**. It supports real-time updates via **WebSockets**, authentication with **JWT**, and is fully Dockerized.

---

## 🚀 Features

- Admin/user roles with JWT authentication
- Real-time leaderboard updates via WebSocket
- Admin CRUD and export (CSV, PDF)
- Docker-based local development (frontend, backend, MySQL, Redis)

---

## 🧰 Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Socket.IO
- **Backend:** Python, Flask, SQLAlchemy, Celery, Redis
- **Database:** MySQL 8
- **Async Task Queue:** Redis + Celery
- **Asynchronous event logging** using **Celery + Redis**
- **DevOps:** Docker, Docker Compose

---

## 📮 API Documentation (Postman)
### You can test the API using the provided Postman Collection.

```bash
Open Postman and import the file:
Leaderboard.postman_collection.json
```

## 🧑‍💻 Getting Started

### 🏞️ Preview
![Login](public/login.jpg)
![Leaderboard](public/admin-leaderboard.jpg)
![Leaderboard](public/leaderboard.jpg)
![csv](public/csv.jpg)
![pdf](public/pdf.jpg)

### 📦 Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

### 📁 Project Structure

```bash
.
├── backend/         # Flask backend
├── frontend/        # React frontend (Vite)
├── .env             # Environment variables
├── docker-compose.yml
```

---
## ⚙️ Setup (with Docker)
### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Copy and configure environment variables
```bash
cp backend/.env.example backend/.env
# Edit .env if needed (e.g., DB password, secret keys)
```

### 3. Build and start all services
```bash
docker-compose up --build
```

### 4. Access the app
```bash
Frontend: http://localhost:5173

Backend API: http://localhost:5001

MySQL: localhost:3306
user: root
password: root default
```

## 🗑 Clean up
### Stop and remove all containers, networks, and volumes:
```bash
docker-compose down -v
```