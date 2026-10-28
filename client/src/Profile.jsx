
import { useEffect, useState } from "react";
import API from "./services/api";
import "./Profile.css";

function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your profile.");
          return;
        }

        const res = await API.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data.user;

        setName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setOriginalPhone(user.phone || "");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setPhone(originalPhone);
    setIsEditing(false);
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in again.");
        return;
      }

      const res = await API.put(
        "/auth/profile",
        { phone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const savedPhone = res.data.user.phone || phone;

      setPhone(savedPhone);
      setOriginalPhone(savedPhone);
      setIsEditing(false);

      alert("Phone number updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save phone number. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">👤</div>

        <h1>My Profile</h1>

        {error && (
          <p role="alert" className="profile-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSave}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            value={name}
            placeholder="Your registered name"
            readOnly
          />

          <label htmlFor="email">College Email</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="yourname@igdtuw.ac.in"
            readOnly
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value.replace(/\D/g, "").slice(0, 10)
              )
            }
            placeholder="Enter your phone number"
            maxLength={10}
            inputMode="numeric"
            readOnly={!isEditing}
            required
          />

          {!isEditing ? (
            <button
              type="button"
              className="profile-save-btn"
              onClick={handleEdit}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="profile-actions">
              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                className="profile-cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;
