# 🔎 Lost & Found Portal

> A full-stack web application that provides a centralized platform for reporting, discovering, and managing lost & found items.

---

## 🚀 Live Demo

🌐 **Live Website:**  
https://lost-and-found-portal-5erb.onrender.com

---

## 📌 About The Project

Lost & Found Portal is a full-stack web application designed to make the process of reporting and finding lost items easier and more organized.

Users can register and log in, report lost or found items, upload images, browse available listings, and manage their own submissions.

The application uses a React-based frontend, Node.js and Express for the backend, and MongoDB for data storage.

---

## ✨ Features

- 🔐 **User Authentication**
  - User registration
  - Secure login
  - Protected routes

- 📌 **Report Lost Items**
  - Add details about lost items
  - Add location, category, date, description, and contact information
  - Upload item images

- 📦 **Report Found Items**
  - Create listings for found items
  - Add relevant item details and images

- 🔍 **Browse & Discover**
  - Explore lost and found listings
  - View detailed information about items

- ✏️ **Manage Listings**
  - Edit submitted items
  - Manage personal listings

- 🖼️ **Image Uploads**
  - Item images are uploaded and managed using Cloudinary

- 🤖 **AI-Powered Functionality**
  - AI functionality to assist with item-related discovery and matching

- 📱 **Responsive Interface**
  - User-friendly interface designed for different screen sizes

---

## 🛠️ Tech Stack

### Frontend

- ⚛️ React.js
- ⚡ Vite
- 🎨 CSS
- 🌐 JavaScript

### Backend

- 🟢 Node.js
- 🚂 Express.js
- 🔐 JWT Authentication
- 📡 REST APIs

### Database & Services

- 🍃 MongoDB
- ☁️ Cloudinary
- 🤖 AI API

### Deployment & Tools

- 🚀 Render
- 🐙 Git & GitHub
- 💻 VS Code

---

## 📂 Project Structure

```text
Lost-and-Found-Portal/
│
├── client/                       # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── services/
│   │   ├── AddItem.jsx
│   │   ├── EditItem.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── MyItems.jsx
│   │   ├── ItemDetails.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                       # Node.js + Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md