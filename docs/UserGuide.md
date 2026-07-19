# Rang Travels CRM - Operational User Guide

Guide for developers running, contributing, and testing local CRM installs.

## Running Locally

### Prerequisites
* Docker & Docker Compose
* Python 3.11+
* Node.js 18+

### Setup Commands
1. Clone workspace repos.
2. Run database services:
   `docker-compose up -d`
3. Launch Backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
4. Launch Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
