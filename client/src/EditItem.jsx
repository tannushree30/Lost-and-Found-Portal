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

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const res = await API.get(`/items/${id}`);
      const item = res.data.item;

      setForm({
        title: item.title || "",
        description: item.description || "",
        category: item.category || "",
        location: item.location || "",
        date: item.date?.substring(0, 10) || "",
        status: item.status || "",
        phone: item.phone || "",
      });

      setImagePreview(item.image || "");
    } catch (err) {
      alert("Failed to load item");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) {
        formData.append("image", image);
      }

      await API.put(`/items/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
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
          <input className="add-input" type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />

          <textarea className="add-textarea" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />

          <div className="form-row">
            <div>
              <input className="add-input" type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
            </div>

            <div>
              <select className="add-select" name="status" value={form.status} onChange={handleChange} required>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>
          </div>

          <input className="add-input" type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} required />

          <div className="form-row">
            <div>
              <input className="add-input" type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>

            <div>
              <input className="add-input" type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="image-upload">
            <label htmlFor="image">📷 Change Item Image</label>
            <input id="image" type="file" accept="image/*" onChange={handleImageChange} />

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Item preview" />
              </div>
            )}
          </div>

          <button className="add-btn" type="submit">Update Item</button>
        </form>
      </div>
    </div>
  );
}

export default EditItem;