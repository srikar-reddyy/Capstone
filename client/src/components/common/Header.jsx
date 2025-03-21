import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAuthorContextObj } from '../contexts/UserAuthorContext';
import { useClerk, useUser } from '@clerk/clerk-react';

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
    <nav style={{ backgroundColor: 'red', padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px' }}>CapStone</Link>
        <div>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '15px', margin: '0', padding: '0' }}>
            <li>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
            </li>
            {!isSignedIn ? (
              <>
                <li>
                  <Link to="/signin" style={{ color: 'white', textDecoration: 'none' }}>Sign In</Link>
                </li>
                <li>
                  <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={currentUser?.profileImageUrl || "fallback-image.jpg"}
                    alt="Profile"
                    style={{
                      borderRadius: '50%',
                      border: '2px solid white',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      marginLeft: '15px'
                    }}
                    onClick={handleProfileClick}
                  />
                </li>
                <li>
                  <button
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      marginLeft: '15px'
                    }}
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </li>
                {currentUser.role === 'admin' && (
                  <li>
                    <Link
                      to={`/admin-profile/${currentUser.email}/all-users`}
                      style={{ color: 'white', textDecoration: 'none' }}
                    >
                      All Users
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
