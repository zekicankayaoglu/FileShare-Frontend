import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import './Main.css';

import { NavLink } from 'react-router-dom';



const FileUpload = () => {
  const [admins, setAdmins] = useState(null); 
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [showFriendsSelection, setShowFriendsSelection] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: ''
  });
  const fileInputRef = useRef(null);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
const handleFileChange = (event) => {
  setSelectedFile(event.target.files[0]);
  setShowFriendsSelection(true);
};
const [fileCount, setFileCount] = useState(0);

const handleUpload = async () => {
  if (!selectedFile) {
      alert('Lütfen bir dosya seçin');
      return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('userId', localStorage.getItem('user'));
  selectedFriends.forEach((friendId, index) => {
    formData.append(`friends[${index}]`, friendId);
  });
  
  try {
      const response = await axios.post('https://localhost:7012/File/upload', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });
      alert('File uploaded successfully.');
      setShowFriendsSelection(false);
      setSelectedFile(null);
  } catch (error) {
      alert(`Dosya yükleme hatası: ${error.response ? error.response.data : error.message}`);
  }
};
  useEffect(() => {
    const fetchFileCount = async () => {
      try {
        const response = await axios.get(`https://localhost:7012/File/userfilecount/${localStorage.getItem('user')}`); // userId'i backend'den almanız gerekecek
        setFileCount(response.data);
      } catch (error) {
        console.error('Dosya sayısı alınamadı:', error);
      }
    };
    const fetchFriends = async () => {
      try {
        const userId = localStorage.getItem('user');
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
        console.error('Arkadaşlar alınamadı:', error);
      }
    };
    fetchFriends();
    fetchFileCount();
  }, []);
  const togglePopup = () => {
    setShowAddAdminForm(!showAddAdminForm);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdminData({
      ...newAdminData,
      [name]: value
    });
  };
  const handleFriendSelection = (friendId) => {
    setSelectedFriends((prevSelectedFriends) => {
      if (prevSelectedFriends.includes(friendId)) {
        return prevSelectedFriends.filter(id => id !== friendId);
      } else {
        return [...prevSelectedFriends, friendId];
      }
    });
  };
  const handleButtonClick = () => {
    fileInputRef.current.click();
};
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New admin data:', newAdminData);
  };
  return (
    <body>
      {/* ======= Header ======= */}
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center">
            <img src="assets/img/logo.png" alt />
            <span className="d-none d-lg-block">FileShare</span>
          </a>
          <i className="bi bi-list toggle-sidebar-btn" />
        </div>{/* End Logo */}
        <div className="search-bar">
          <form className="search-form d-flex align-items-center" method="POST" action="#">
            <input type="text" name="query" placeholder="Search" title="Enter search keyword" />
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
                <span className="d-none d-md-block dropdown-toggle ps-2">xxxx xxxx</span>
              </a>{/* End Profile Iamge Icon */}
              
            </li>{/* End Profile Nav */}
          </ul>
        </nav>{/* End Icons Navigation */}
      </header>

      <aside id="sidebar" className="sidebar">

        <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
            <a className="nav-link" href="/upload">
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" href="/friends">
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
        <div className="buttons-container">
            <div className="button-wrapper">
              <button className="upload-button" onClick={handleUpload}>
                <i className="ri-upload-line"></i> Upload File
              </button>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            {selectedFile && (
                <div className="file-info">
                    <i className="ri-file-line"></i>
                    <span>{selectedFile.name}</span>
                </div>
            )}
            <div className="button-wrapper">
              <button className="send-button" onClick={() => fileInputRef.current.click()}>
                <i className="ri-send-plane-line"></i> Select File
              </button>
            </div>
          </div>
          {showFriendsSelection && (
            <div>
              <h3>Select Friends to Share With:</h3>
              <ul>
                {friends.map(friend => (
                  <li key={friend.userId}>
                    <label>
                      <input
                        type="checkbox"
                        value={friend.userId}
                        checked={selectedFriends.includes(friend.userId)}
                        onChange={() => handleFriendSelection(friend.userId)}
                      />
                      {friend.userName}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        <NavLink to="/myFiles" className="card"> {/* NavLink ekleniyor */}
            <div className="card-body">
              <div className="d-flex justify-content-start align-items-start">
                <h2>Shared Files</h2>
              </div>
              <div className="file-icon">
                <i className="ri ri-file-cloud-fill"></i>
              </div>
              <div className="file-info">
                <h5 class="card-title">{fileCount}</h5>
              </div>
            </div>
          </NavLink>

    </section>
       
      </main>
    </body>
  );
};

export default FileUpload;