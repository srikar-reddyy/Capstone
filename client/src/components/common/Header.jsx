import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAuthorContextObj } from '../contexts/UserAuthorContext';
import { useClerk, useUser } from '@clerk/clerk-react';
import '../../App.css';
import '../admin/Users'

function Header() {
  const { signOut } = useClerk();
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  async function handleSignOut() {
    await signOut();
    setCurrentUser(null);
    navigate('/');
  }

  function handleProfileClick() {
    navigate('/profile');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">LOGO</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {!isSignedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signin">Sign In</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item d-flex align-items-center">
                  <img
                    src={currentUser?.profileImageUrl || "fallback-image.jpg"}
                    alt="Profile"
                    className="rounded-circle border"
                    width="40"
                    height="40"
                    style={{ cursor: 'pointer', marginLeft: '15px' }}
                    onClick={handleProfileClick}
                  />
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger ms-3" onClick={handleSignOut}>
                    Sign Out
                  </button>
                </li>
                { currentUser.role === 'admin' && (
                    <li className="nav-item">
                      <Link className="nav-link" to={`/admin-profile/${currentUser.email}/all-users`}>
                      All Users
                    </Link>
                    </li>
                  )
                }
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;