# 🏥 Stroke Diagnoser

A comprehensive full-stack application for stroke diagnosis support, enabling patients to submit health data and doctors/neurologists to analyze results and provide consultations.

## 🛠️ Tech Stack

- **Backend:** FastAPI, SQLModel, JWT Authentication
- **Frontend:** React, TypeScript
- **Database:** SQLite (development)

## 📦 Project Structure

```bash
stroke-diagnoser/
├── backend/           # FastAPI Backend
│   ├── main.py       # API endpoints and business logic
│   ├── models.py     # Database models and schemas
│   ├── auth.py       # Authentication logic
│   ├── utils.py      # Utility functions
│   ├── requirements.txt
│   └── medstroker.db # SQLite database
├── frontend/         # React + TypeScript Frontend
│   └── main-frontend/
└── README.md         # This file
```

## 🚀 Backend Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Patient, Doctor, Neurologist)
  - Secure password hashing with bcrypt

- **Patient Features**
  - Submit vital signs (blood pressure, heart rate, etc.)
  - Upload lab results (CBC, BMP, coagulation)
  - View personal medical history
  - Receive neurologist consultations

- **Medical Professional Features**
  - View patient vitals and lab results
  - Provide diagnoses and treatment plans
  - Approve/deny tPA treatment
  - Track patient progress

- **Data Models**
  - User profiles with role-based access
  - Comprehensive vital signs tracking
  - Detailed lab results
  - Neurologist consultation records

## ⚙️ Backend Setup

1. **Create and activate virtual environment**
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Run the server**
```bash
uvicorn main:app --reload
```

The API will be available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 💻 Frontend Features

- **User Interface**
  - Modern, responsive design
  - Role-based navigation
  - Secure authentication flow
  - Real-time data updates

- **Patient Dashboard**
  - Submit medical data
  - View consultation history
  - Track treatment progress

- **Medical Professional Dashboard**
  - Patient management
  - Data analysis tools
  - Treatment planning interface

## ⚙️ Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend/main-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The frontend will be available at:
- http://localhost:3000

## 🔐 API Authentication

- **Login**: POST `/token` - Obtain JWT token
- **Registration**: POST `/users` - Create new user account
- **Protected Routes**: Include `Authorization: Bearer <token>` header

## 📊 API Endpoints

### Authentication
- `POST /token` - User login
- `POST /users` - User registration

### Patient Endpoints
- `POST /vitals` - Submit vital signs
- `POST /lab_results` - Submit lab results
- `GET /consultations` - View consultations

### Medical Professional Endpoints
- `GET /vitals/{user_id}` - View patient vitals
- `GET /lab_results/{user_id}` - View patient lab results
- `POST /consultations` - Create consultation
- `PUT /consultations/{id}` - Update consultation

## 🛠️ Development Requirements

- Python 3.8+
- Node.js 16+
- SQLite3
- Modern web browser

## 🔮 Future Enhancements

- Real-time notifications
- Advanced data visualization
- Machine learning integration for risk assessment
- Mobile application support
- Multi-language support

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🚀 Backend (FastAPI)

### Features:
- JWT Authentication (Login / Sign Up)
- Password Hashing with bcrypt
- Role-Based Access Control:
  - **Patients**: Submit vitals and lab results
  - **Doctors/Neurologists**: View patient data
- One-to-One relationship between User and Vitals/LabResult
- Fully documented API (Swagger UI)

### ⚙️ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

Create a `.env` file:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./medstroke.db
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Run the server:

```bash
uvicorn main:app --reload
```

Available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

### 🔑 API Authentication Flow

- `POST /token` ➔ Obtain JWT Token (login)
- `POST /users` ➔ Create new user (Patient, Doctor, Neurologist)
- All protected endpoints require `Authorization: Bearer <token>` header

---

### 🏥 Backend API Endpoints

| Method | Endpoint                 | Role                | Description |
|:-------|:--------------------------|:--------------------|:------------|
| POST   | `/token`                   | All                 | Login to get JWT |
| POST   | `/users`                   | Public              | Register user |
| GET    | `/users/me`                | All (auth required) | View own profile |
| POST   | `/vitals/`                 | Patient             | Submit vitals |
| POST   | `/lab_results/`            | Patient             | Submit lab results |
| GET    | `/vitals/{user_id}`        | Doctor/Neurologist  | View patient's vitals |
| GET    | `/lab_results/{user_id}`   | Doctor/Neurologist  | View patient's lab results |

---

## 💻 Frontend (React + TypeScript)

### Features:
- Modern SPA built with Vite
- Authentication with JWT tokens
- Role-Based Conditional UI
- Protected Routes with React Router
- Axios API integration
- TypeScript interfaces for API responses

### ⚙️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend available at:

```bash
http://localhost:3000
```

---

### 🧐 Frontend Pages (Example)

| Path         | Component              | Description |
|:-------------|:------------------------|:------------|
| `/login`     | `LoginPage.tsx`          | User login |
| `/register`  | `RegisterPage.tsx`       | Patient registration |
| `/profile`   | `ProfilePage.tsx`        | User profile info |
| `/vitals`    | `VitalsPage.tsx`         | Submit/View vitals (patient) |
| `/labresults`| `LabResultsPage.tsx`     | Submit/View lab results (patient) |
| `/patients`  | `PatientListPage.tsx`    | (Doctor) List all patients |
| `/patients/:id` | `PatientDetailPage.tsx` | (Doctor) View patient's vitals and labs |

### 🌐 Axios Example Setup

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 🛠️ Development Environment

- Python 3.12+
- Node.js 18+
- Vite (for React)
- SQLite3 (local database)

---

## 🔥 Future Roadmap

- Forgot Password functionality
- Admin dashboard for doctors
- Patient historical data trend visualization
- Cloud deployment (AWS, Vercel, or Railway)
- PostgreSQL for production database

---

## 👨‍💻 Author

Kwabena Asare Boström  
Elikem Hamenoo
Full Stack Developer | Backend Engineer | Healthcare Technology Enthusiast 🌟

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

