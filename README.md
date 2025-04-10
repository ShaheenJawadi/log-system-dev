
## Prerequisites

- Node.js (v16 or higher) and npm/yarn
- Python (v3.9 or higher) and pip
- Docker and Docker Compose (optional, for containerized deployment)

## Running Locally

### Backend Setup (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Start the Django server:
   ```bash
   python manage.py runserver
   ```
   The backend will run on http://localhost:8000.

### Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
    ```bash
   yarn
   ```

3. Start the React app:
   ```bash
   npm start
   ```
      or
    ```bash
   yarn start
   ```
   The frontend will run on http://localhost:3000.

### Access the App

- Open your browser and go to http://localhost:3000 to use the app.
- The frontend will communicate with the backend at http://localhost:8000.

## Running with Docker

### 1. Ensure Docker and Docker Compose are installed

- Install Docker: [Docker Installation Guide](https://docs.docker.com/get-docker/)
- Install Docker Compose: [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

### 2. Build and Run with Docker Compose

1. From the root directory run:
   ```bash
   docker-compose up --build
   ```

2. Access the app:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

