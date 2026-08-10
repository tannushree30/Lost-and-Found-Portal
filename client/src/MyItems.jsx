import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./services/api";
import "./MyItems.css";

function MyItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/items/my-items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data.items);
    } catch (err) {
      alert("Failed to fetch items");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item deleted successfully");
      fetchMyItems();
    } catch (err) {
      alert(err.response?.data?.message || "Delete Failed");
    }
  };

  const handleReturn = async (id, status) => {
    const message = status === "Returned"
      ? "Mark this item as Unreturned?"
      : "Mark this item as Returned?";

    if (!window.confirm(message)) return;

    try {
      const token = localStorage.getItem("token");
      await API.patch(`/items/return/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(status === "Returned" ? "Item marked as Unreturned!" : "Item marked as Returned!");
      fetchMyItems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="myitems-container">
      <h1 className="myitems-title">My Items</h1>
      {items.length === 0 ? (
        <h3 className="no-items">No Items Added Yet</h3>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <div key={item._id} className="item-card">
              {item.image && <img src={item.image} alt={item.title} className="item-image" />}
              <h2>{item.title}</h2>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${item.status === "Lost" ? "lost" : item.status === "Found" ? "found" : "returned"}`}>
                  {item.status}
                </span>
              </p>
              <div className="button-group">
                <button className="edit-btn" onClick={() => navigate(`/edit-item/${item._id}`)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                <button className="view-btn" onClick={() => navigate(`/item/${item._id}`)}>View Details</button>
                <button className="return-btn" onClick={() => handleReturn(item._id, item.status)}>
                  {item.status === "Returned" ? "Mark Unreturned" : "Mark Returned"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyItems;