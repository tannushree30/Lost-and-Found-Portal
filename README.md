# 🔎 Lost & Found Portal

> A full-stack web application that provides a centralized platform for reporting, discovering, and managing lost & found items.

---

## 🚀 Live Demo

🌐 **Live Website:**  
https://lost-and-found-portal-5erb.onrender.com

---


## 📌 About the Project

Lost & Found Portal is designed to make finding lost belongings and reporting found items easier, faster, and more organized.

Users can create accounts, report lost or found items, upload item images, browse listings, manage their submissions, and use AI-powered functionality to assist with item discovery and matching.

The application also includes a personal profile section where authenticated users can view their registered details and update their phone number.

The project is built using React.js, Node.js, Express.js, and MongoDB.

---

## ✨ Features

### 🔐 User Authentication
- User registration and login
- JWT-based authentication
- Protected routes for authenticated users
- Registration restricted to official IGDTUW email addresses (`@igdtuw.ac.in`)
- Forgot-password functionality

### 📌 Lost & Found Listings
- Report lost items with relevant details
- Report found items
- Add item title, description, category, location, date, and contact information
- Upload item images
- Browse available listings
- View detailed information about individual items

### 📦 My Items
- View your own submitted listings
- Manage your item submissions
- Edit item details

### 👤 My Profile
- View registered name and college email
- Keep name and email read-only
- Edit your phone number using the Edit Phone Number option
- Save phone number changes to MongoDB
- Display a success popup after a successful update
- Access the profile page through a protected route

### 🤖 AI-Powered Item Discovery
- AI-assisted image analysis
- Extract relevant item attributes
- Suggest potentially matching lost and found items

### 🖼️ Image Uploads
- Upload item images
- Store and manage images using Cloudinary

### 📱 Responsive Interface
- Clean and user-friendly interface
- Responsive profile form and navigation
- Designed for desktop and mobile screens

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- React Router

### Backend
- Node.js
- Express.js
- REST APIs
- JSON Web Tokens (JWT)
- bcrypt

### Database and Services
- MongoDB
- Mongoose
- Cloudinary
- Google Gemini API for AI functionality

### Development and Deployment
- Git
- GitHub
- VS Code
- Render

---

## 📂 Project Structure

```text
Lost-and-Found-Portal/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── Navbar.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Profile.css
│   │   ├── AddItem.jsx
│   │   ├── MyItems.jsx
│   │   ├── EditItem.jsx
│   │   ├── ItemDetails.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🔮 Future Improvements

- Improved item-matching accuracy
- Notifications for potential item matches
- Enhanced search and filtering
- Additional account-management features
- More detailed item-status tracking
- Further accessibility and mobile usability improvements

---