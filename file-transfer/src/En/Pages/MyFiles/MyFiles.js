import React, { useState, useEffect } from 'react';

import './MyFiles.css';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { NavLink } from 'react-router-dom';


const MyFiles = () => {
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
  const [files, setFiles] = useState({ myFiles: [], sharedFiles: [] });
  useEffect(() => {
    fetchFiles();
  }, []);
  const fetchFiles = async () => {
    try {
        console.log("girdi");
      const userId = localStorage.getItem('user');
      const response = await axios.get(`https://localhost:7012/File/myfiles/${userId}`);
      console.log("cikti");
      console.log("Response received:", response.data);
      setFiles(response.data);
    } catch (error) {
      console.error('Dosyalar alınamadı:', error);
    }
  };
    

  const handleDownload = async (fileId) => {
    try {
      const response = await axios.get(`https://localhost:7012/File/download/${fileId}`, {
        responseType: 'blob', // Dosya tipi blob olarak alınacak
      });
  
      // Dosyayı indirmek için bir URL oluştur
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      // A elementi oluştur ve indirme işlemi için kullan
      const link = document.createElement('a');
      const contentDisposition = response.headers['content-disposition'];
        let fileName = 'downloadedFile';

        if (contentDisposition) {
            let fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (!fileNameMatch) {
                fileNameMatch = contentDisposition.match(/filename\*="?([^"]+)/);
            }
            if (fileNameMatch && fileNameMatch.length === 2) {
                fileName = fileNameMatch[1];
                if (fileName.startsWith("UTF-8''")) {
                    fileName = fileName.replace("UTF-8''", '');
                    fileName = decodeURIComponent(fileName);
                }
            }
        }

        link.href = url;
        link.setAttribute('download', fileName); // Dosyanın indirileceği adı belirt
        document.body.appendChild(link);
        link.click(); // Dosyayı indir
        document.body.removeChild(link); // A elementini kaldır
    } catch (error) {
      console.error('Dosya indirme hatası:', error);
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
            <a className="nav-link collapsed" href="/friends">
              <i className="bi bi-people-fill"></i>
              <span>Friends</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/en/myFiles">
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
                  
                  <ul className="responsive-table">

                    <div>
                    <h2>My Files</h2>
                        <ul>
                            {files.myFiles.map((file, index) => (
                            <li key={index}>{file}<button onClick={() => handleDownload(file)}>Download</button></li>
                            ))}
                        </ul>

                        <h2>Shared Files With Me</h2>
                        <ul>
                            {files.sharedFiles.map((file, index) => (
                            <li key={index}>{file}<button onClick={() => handleDownload(file)}>Download</button></li>
                            ))}
                        </ul>
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

export default MyFiles;