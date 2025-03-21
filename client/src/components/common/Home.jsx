import { useContext, useEffect, useState } from "react";
import { userAuthorContextObj } from "../contexts/UserAuthorContext";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");

  useEffect(() => {
    if (isSignedIn) {
      setCurrentUser({
        ...currentUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
      });
    }
  }, [isLoaded]);

  async function onSelectRole(e) {
    setError("");
    const selectedRole = e.target.value;
    let res = null;

    currentUser.role = selectedRole;

    try {
      if (selectedRole === "author") {
        res = await axios.post("http://localhost:3003/author-api/author", currentUser);
      } else if (selectedRole === "user") {
        res = await axios.post("http://localhost:3003/user-api/user", currentUser);
      } else if (selectedRole === "admin") {
        res = await axios.post("http://localhost:3003/admin-api/admin", currentUser);
      }

      if (res) {
        let { message, payload } = res.data;
        if (message === selectedRole) {
          setCurrentUser({ ...currentUser, ...payload });
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          navigate(`/${selectedRole}-profile/${currentUser.email}`);
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      {!isSignedIn ? (
        <div style={{
          backgroundColor: "#f8f9fa",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          margin: "0 auto",
          animation: "fadeIn 1s ease-in-out"
        }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" , color:'orangered' }}>Welcome to CapStone</h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>Explore the Amazing Content Here</p>
          <p style={{ fontSize: "1rem", marginBottom: "20px" }}></p>
          <button 
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 20px",
              fontSize: "1.1rem",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
        </div>
      ) : (
        <div>
          <div>
            <img src={user.imageUrl} alt="Profile" style={{ borderRadius: "50%", width: "100px", height: "100px" }} />
            <h3>{user.firstName}</h3>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div>
            <h4>Select Your Role</h4>
            <label>
              <input type="radio" name="role" value="author" onChange={onSelectRole} /> Author
            </label>
            <label>
              <input type="radio" name="role" value="user" onChange={onSelectRole} /> User
            </label>
            <label>
              <input type="radio" name="role" value="admin" onChange={onSelectRole} /> Admin
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;