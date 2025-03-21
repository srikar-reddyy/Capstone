import { useContext, useEffect, useState } from "react";
import { userAuthorContextObj } from "../contexts/UserAuthorContext";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import axios from "axios";
import "./Home.css";

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
      }else if (selectedRole === "admin") {
        res = await axios.post("http://localhost:3003/admin-api/admin", currentUser);
      }

      if (res) {
        let { message, payload } = res.data;
        if (message === selectedRole) {
          setCurrentUser({ ...currentUser, ...payload });
          // save the details to local storage
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
    <div className="home-container">
      {!isSignedIn ? (
        <div className="welcome-text">
          <h2>Welcome to Our Platform</h2>
          <p>Join us and explore amazing content as an Author or a User.</p>
          <p>Create, share, and discover new ideas.</p>
        </div>
      ) : (
        <div className="content-container">
          <div className="profile-card">
            <img src={user.imageUrl} alt="Profile" />
            <h3>{user.firstName}</h3>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="role-selection">
            <h4>Select Your Role</h4>
            <label className="form-check">
              <input type="radio" name="role" value="author" onChange={onSelectRole} />
              Author
            </label>
            <label className="form-check">
              <input type="radio" name="role" value="user" onChange={onSelectRole} />
              User
            </label>
            <label className="form-check">
              <input type="radio" name="role" value="admin" onChange={onSelectRole} />
              Admin
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
