import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./services/api";
import "./home.css";

function Home() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setItems(res.data.items);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="home-container">
      <h1 className="home-title">Lost & Found Items</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
          <option value="All">All</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
          <option value="Returned">Returned</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <h3 className="no-items">No Items Found</h3>
      ) : (
        <div className="items-container">
          {filteredItems.map((item) => (
            <div key={item._id} className="item-card">
              {item.image && <img src={item.image} alt={item.title} className="item-image" />}
              <h2>{item.title}</h2>
              <p><strong>Description:</strong> {item.description.length > 80 ? item.description.substring(0, 80) + "..." : item.description}</p>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${item.status === "Lost" ? "lost" : item.status === "Found" ? "found" : "returned"}`}>
                  {item.status}
                </span>
              </p>
              <p><strong>Posted By:</strong> {item.postedBy?.name}</p>
              <button className="details-btn" onClick={() => navigate(`/item/${item._id}`)}>View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;