import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "./services/api";
import "./ItemDetails.css";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchSearched, setMatchSearched] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const matchScore = location.state?.matchScore;

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await API.get(`/items/${id}`);
      setItem(res.data.item);
    } catch (err) {
      alert("Item not found");
      navigate("/");
    }
  };

  const findMatches = async () => {
    setLoadingMatches(true);
    try {
      const res = await API.get(`/ai/matches/${id}`);
      setMatches(res.data.matches || []);
      setMatchSearched(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to find matches");
    } finally {
      setLoadingMatches(false);
    }
  };

  if (!item) return <div className="loading">Loading...</div>;

  return (
    <div className="details-container">
      <div className="details-card">
        {item.image && <img src={item.image} alt={item.title} className="details-image" />}
        <h1>{item.title}</h1>
        <p><strong>Description:</strong> {item.description}</p>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>📍 Location:</strong> {item.location}</p>
        <p><strong>📅 Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
        <p><strong>👤 Posted By:</strong> {item.postedBy?.name}</p>
        <p><strong>📧 Email:</strong> {item.postedBy?.email}</p>
        <p><strong>📞 Phone:</strong> {item.phone}</p>
        {matchScore && <p><strong>🤖 AI Match:</strong> {matchScore}%</p>}
        <p><strong>Status:</strong>{" "}<span className={`status ${item.status === "Lost" ? "lost" : item.status === "Found" ? "found" : "returned"}`}>{item.status}</span></p>

        {!matchScore && item.status !== "Returned" && (
          <div className="match-section">
            <button className="match-btn" onClick={findMatches} disabled={loadingMatches}>{loadingMatches ? "Finding Matches..." : "🤖 Find Possible Matches"}</button>
            {matchSearched && matches.length === 0 && <p className="no-matches">No strong matches found.</p>}
            {matches.length > 0 && (
              <div className="matches-container">
                <h2>🔍 Possible Matches</h2>
                {matches.map((match) => (
                  <div key={match.item._id} className="match-card">
                    {match.item.image && <img src={match.item.image} alt={match.item.title} className="match-image" />}
                    <div className="match-info">
                      <h3>{match.item.title}</h3>
                      <p><strong>Match:</strong> {match.score}%</p>
                      <p>{match.reason}</p>
                      <button onClick={() => setSelectedMatch(match)}>View Match</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

        {selectedMatch && (
          <div onClick={() => setSelectedMatch(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:1000,padding:"20px"}}>
            <div onClick={(e) => e.stopPropagation()} style={{background:"#fff",width:"100%",maxWidth:"500px",padding:"25px",borderRadius:"15px",boxShadow:"0 10px 30px rgba(0,0,0,0.2)",maxHeight:"85vh",overflowY:"auto"}}>
              <h2 style={{marginTop:0}}>{selectedMatch.item.title}</h2>
              <p><strong>Status:</strong>{" "}<span className={`status ${selectedMatch.item.status === "Lost" ? "lost" : "found"}`}>{selectedMatch.item.status}</span></p>
              <p><strong>Description:</strong>{" "}{selectedMatch.item.description?.length > 70 ? selectedMatch.item.description.substring(0,70) + "..." : selectedMatch.item.description}</p>
              <p><strong>Category:</strong> {selectedMatch.item.category}</p>
              <p><strong>📍 Location:</strong> {selectedMatch.item.location}</p>
              <p><strong>📅 Date:</strong> {new Date(selectedMatch.item.date).toLocaleDateString()}</p>
              <p><strong>👤 Posted By:</strong> {selectedMatch.item.postedBy?.name || "Unknown"}</p>
              <p><strong>🤖 AI Match:</strong> {selectedMatch.score}%</p>
              <p><strong>Why it matches:</strong> {selectedMatch.reason}</p>
              <div style={{display:"flex",gap:"10px",marginTop:"20px"}}>
                <button onClick={() => { setSelectedMatch(null); navigate(`/item/${selectedMatch.item._id}`, { state: { matchScore: selectedMatch.score } }); }} style={{flex:1,padding:"11px",border:"none",borderRadius:"8px",background:"#2563eb",color:"#fff",cursor:"pointer"}}>Open Profile</button>
                <button onClick={() => setSelectedMatch(null)} style={{flex:1,padding:"11px",border:"none",borderRadius:"8px",background:"#e5e7eb",cursor:"pointer"}}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemDetails;