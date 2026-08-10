import { useState } from "react";
import API from "./services/api";
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

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

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

  const handleAnalyzeImage = async () => {
    if (!image) {
      alert("Please upload an image first");
      return;
    }

    setAnalyzing(true);

    try {
      const imageData = new FormData();
      imageData.append("image", image);

      const res = await API.post("/ai/analyze-image", imageData);

      const data = res.data.data;

      setForm((prev) => ({
        ...prev,
        title: data.title || prev.title,
        category: data.category || prev.category,
        description: data.description
          ? `${data.color ? `Color: ${data.color}. ` : ""}${data.description}`
          : prev.description,
      }));

      alert("AI analysis completed!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (image) formData.append("image", image);

      const res = await API.post("/items/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      setImage(null);
      setImagePreview("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add item");
    }
  };

  return (
    <div>
      <h1>Add New Item</h1>

      <form onSubmit={handleSubmit}>
        <input className="add-input" type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />

        <textarea className="add-textarea" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />

        <div className="form-row">
          <div>
            <input className="add-input" type="text" name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          </div>
          <div>
            <select className="add-select" name="status" value={form.status} onChange={handleChange} required>
              <option value="">Select Status</option>
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
          <label htmlFor="image">Upload Item Image</label>
          <input id="image" type="file" accept="image/*" onChange={handleImageChange} />

          {imagePreview && (
            <>
              <div className="image-preview">
                <img src={imagePreview} alt="Item preview" />
              </div>

              <button type="button" className="ai-btn" onClick={handleAnalyzeImage} disabled={analyzing}>
                {analyzing ? "Analyzing..." : "✨ Analyze Image with AI"}
              </button>
            </>
          )}
        </div>

        <button className="add-btn" type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default AddItem;