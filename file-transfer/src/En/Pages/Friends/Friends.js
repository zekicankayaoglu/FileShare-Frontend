import React, { useState, useEffect } from 'react';

import './Friends.css';
import { FaUser, FaLock } from 'react-icons/fa';

import { NavLink } from 'react-router-dom';


const Friends = () => {
  const [friends, setFriends] = useState(null); 
  const adminId = localStorage.getItem('user');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    friendName: '',
    mail: '',
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  useEffect(() => {
    fetchFriends(); // Fetch admins on component mount
  }, []);

    const fetchFriends = async () => {
      try {
        const response = await fetch(`https://localhost:7012/GetFriends/${localStorage.getItem('user')}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFriends(data);
          console.log(data);
        } else {
          console.error('Failed to fetch friends.');
        }
      } catch (error) {
        console.error('An error occurred while fetching doctors:', error);
      }
    };

    if (friends === null) {
      fetchFriends();
    }
  
    const handleRemoveFriend = async (friendId) => {
      const userId = localStorage.getItem('user');
      console.log(friendId);
      try {
        const response = await fetch(`https://localhost:7012/DeleteFriend/${userId}?friendIdy=${friendId}`, {
          method: 'DELETE',
        });
        if (response.status === 200) {
          console.log('Friend successfully removed');
          fetchFriends(); 
        } else {
          console.error('Failed to remove friend');
        }
      } catch (error) {
        console.error('An error occurred while removing friend:', error);
      }
    };
    
  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      fetchFriendRequests();
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  };
  const handleSearch = async () => {
    const userId = localStorage.getItem('user');
    try {
      const response = await fetch(`https://localhost:7012/searchUsers/${userId}?query=${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Failed to search users.');
      }
    } catch (error) {
      console.error('An error occurred while searching users:', error);
    }
  };

  const sendFriendRequest = async (receiverId) => {
    const userId = localStorage.getItem('user');
    try {
      const response = await fetch(`https://localhost:7012/FriendRequest/${userId}?receiverId=${receiverId}`, {
        method: 'POST'
      });
      if (response.ok) {
        console.log('Friend request sent successfully');
        fetchFriendRequests();
        setSentRequests([...sentRequests, receiverId]);
        console.log(sentRequests);
      } else {
        console.error('Failed to send friend request.');
      }
    } catch (error) {
      console.error('An error occurred while sending friend request:', error);
    }
    
  };

  const acceptFriendRequest = async (receiverId) => {
    const userId = localStorage.getItem('user');
    try {
      const response = await fetch(`https://localhost:7012/ApproveRequest/${userId}?receiverId=${receiverId}`, {
        method: 'POST'
      });
      if (response.ok) {
        console.log('Friend request accepted successfully');
        fetchFriendRequests();
        fetchFriends();
      } else {
        console.error('Failed to accept friend request.');
      }
    } catch (error) {
      console.error('An error occurred while accepting friend request:', error);
    }
  };

  const rejectFriendRequest = async (receiverId) => {
    const userId = localStorage.getItem('user');
    try {
      const response = await fetch(`https://localhost:7012/RejectRequest/${userId}?receiverId=${receiverId}`, {
        method: 'POST'
      });
      if (response.ok) {
        console.log('Friend request rejected successfully');
        fetchFriendRequests();
        fetchFriends();
      } else {
        console.error('Failed to reject friend request.');
      }
    } catch (error) {
      console.error('An error occurred while rejecting friend request:', error);
    }
  };

  const fetchFriendRequests = async () => {
    const userId = localStorage.getItem('user');
    try {
      const response = await fetch(`https://localhost:7012/GetRequests/${localStorage.getItem('user')}`);
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data);
      } else {
        console.error('Failed to fetch friend requests.');
      }
    } catch (error) {
      console.error('An error occurred while fetching friend requests:', error);
    }
  };
  return (
    <body>
      {/* ======= Header ======= */}
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-betw  een">
          <a href="index.html" className="logo d-flex align-items-center">
            <img src="/assets/img/logo.png" alt />
            <span className="d-none d-lg-block">FileShare</span>
          </a>
          <i className="bi bi-list toggle-sidebar-btn" />
        </div>{/* End Logo */}
        <div className="search-bar">
          <form className="search-form d-flex align-items-center" method="POST" action="#">
            <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
            <button type="submit" title="Search"><i className="bi bi-search" /></button>
          </form>
        </div>{/* End Search Bar */}
        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item d-block d-lg-none">
              <a className="nav-link nav-icon search-bar-toggle " href="#">
                <i className="bi bi-search" />
              </a>
            </li>{/* End Search Icon*/}
            <li className="nav-item dropdown">
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
              </ul>{/* End Notification Dropdown Items */}
            </li>{/* End Notification Nav */}
            <li className="nav-item dropdown pe-3">
              <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                <span className="d-none d-md-block dropdown-toggle ps-2">Admin</span>
              </a>{/* End Profile Iamge Icon */}
              
            </li>{/* End Profile Nav */}
          </ul>
        </nav>{/* End Icons Navigation */}
      </header>

      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
            <a className="nav-link collapsed" href="/upload">
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/friends">
              <i className="bi bi-people-fill"></i>
              <span>Friends</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" href="/en/myFiles">
              <i className="bx bxs-file-blank"></i>
              <span>My Files</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" href="/en/login-form">
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Logout</span>
            </a>
          </li>
        </ul>

      </aside>

      <main id="main" className="main">
    
        <section className="section dashboard">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="container">
                  <div className="d-flex justify-content-between align-items-center">
                    <h2>FRIENDS</h2>
                    <button className="button-33" role="button" onClick={toggleModal}>Add Friend</button>
                  </div>
                  {showModal && (
                    <div class="xxx">
                      <div class="popup-box">
                      <div className="friends-container">
                        <div className="search-container">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for users..."
                          />
                          <button onClick={handleSearch}>Search</button>
                        </div>
                        <div className="search-results">
                          {searchResults.map((user) => (
                            <div key={user.userId} className="search-result-item">
                              <span>{user.userName}</span>
                              {sentRequests.includes(user.userId) ? <span>Request Sent</span> : <button onClick={() => sendFriendRequest(user.userId)}>Send Request</button>}
                            </div>
                          ))}
                        </div>
                        <div className="friend-requests">
                          {friendRequests.length === 0 ? (
                            <p>No friend requests</p>
                          ) : (
                            friendRequests.map((request) => (
                              <div key={request.id} className="friend-request-item">
                                <span>{request.userName}</span>
                                <button className="accept-button" onClick={() => acceptFriendRequest(request.userId)}>Accept</button>
                                <button className="reject-button" onClick={() => rejectFriendRequest(request.userId)}>Reject</button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                          <div className="text-center">
                            <button className="btn-close-popup" onClick={toggleModal}>Kapat</button>
                          </div>
                      </div>
                    </div>
                  )}
                  <ul className="responsive-table">

                    <div>
                      {friends === null ? (
                        <div>Loading...</div>
                      ) : (
                        <ul>
                          {friends.map((friend, index) => (
                            <li key={index} className="table-row">
                              <div className="col col-1" data-label="Hospital Name">{friend.userName}</div>
                              <div className="col col-2" data-label="Admin">{friend.mail}</div>
                              <div className="col col-4">
                                <div className="btn-group">                             
                                  <span style={{ marginRight: 10 }} />
                                  <button className="btn btn-danger btn-sm" title="Remove Admin" onClick={() => handleRemoveFriend(friend.userId)}>
                                  <i className="bi bi-trash" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </ul>
                </div>
              </div>
              
            </div>
          </div>
        </section>
      </main>
    </body>
  );
};

export default Friends;