import { Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./Navbar";
import ForgotPassword from "./ForgetPassword";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import AddItem from "./AddItem";
import MyItems from "./MyItems";
import EditItem from "./EditItem";
import ItemDetails from "./ItemDetails";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <div className="app">

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Home />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/add-item"
          element={
            <ProtectedRoute>
              <AddItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-items"
          element={
            <ProtectedRoute>
              <MyItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-item/:id"
          element={
            <ProtectedRoute>
              <EditItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/item/:id"
          element={<ItemDetails />}
        />

      </Routes>

    </div>
  );
}

export default App;