import { useState } from "react";
import API from "./Services/api";
import "./AddItem.css";

function AddItem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    status: "",
    phone: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await API.post(
        "/items/add",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      setForm({
        title: "",
        description: "",
        category: "",
        location: "",
        date: "",
        status: "",
        phone: "",
      });

    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item");
    }
  };

  return (
    <div className="add-container">
      <div className="add-card">

        <h1>Add New Item</h1>

        <form onSubmit={handleSubmit}>

          <input
            className="add-input"
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            className="add-textarea"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <div className="form-row">

            <div>
              <input
                className="add-input"
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <select
                className="add-select"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>

          </div>

          <input
            className="add-input"
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <div className="form-row">

            <div>
              <input
                className="add-input"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <input
                className="add-input"
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <button
            className="add-btn"
            type="submit"
          >
            Add Item
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddItem;