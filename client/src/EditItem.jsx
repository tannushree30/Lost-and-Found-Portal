import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./services/api";
import "./AddItem.css";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    status: "",
    phone: "",
  });

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const res = await API.get(`/items/${id}`);
      setForm({
        ...res.data.item,
        date: res.data.item.date?.substring(0, 10),
      });
    } catch (err) {
      alert("Failed to load item");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.put(`/items/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Item Updated Successfully!");

      navigate("/my-items");
    } catch (err) {
      alert(err.response?.data?.message || "Update Failed");
    }
  };

  return (
    <div className="add-container">
      <div className="add-card">

        <h1>Edit Item</h1>

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
            Update Item
          </button>

        </form>

      </div>
    </div>
  );
}

export default EditItem;