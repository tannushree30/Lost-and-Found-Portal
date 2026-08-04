import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./services/api";
import "./ItemDetails.css";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const res = await API.get(`/items/${id}`);
      setItem(res.data.item);
    } catch (err) {
      alert("Item not found");
      navigate("/");
    }
  };

  if (!item) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <div className="details-container">
      <div className="details-card">

        <h1>{item.title}</h1>

        <p>
          <strong>Description:</strong> {item.description}
        </p>

        <p>
          <strong>Category:</strong> {item.category}
        </p>

        <p>
          <strong>📍 Location:</strong> {item.location}
        </p>

        <p>
          <strong>📅 Date:</strong>{" "}
          {new Date(item.date).toLocaleDateString()}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`status ${
              item.status === "Lost"
                ? "lost"
                : item.status === "Found"
                ? "found"
                : "returned"
            }`}
          >
            {item.status}
          </span>
        </p>

        <p>
          <strong>👤 Posted By:</strong>{" "}
          {item.postedBy?.name}
        </p>

        <p>
          <strong>📧 Email:</strong>{" "}
          {item.postedBy?.email}
        </p>

        <p>
          <strong>📞 Phone:</strong> {item.phone}
        </p>

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

      </div>
    </div>
  );
}

export default ItemDetails;