import React, { useState, useEffect } from 'react';
import './DoctorList.css';
import './assets/vendor/bootstrap/css/bootstrap.min.css'
import './assets/vendor/bootstrap-icons/bootstrap-icons.css'
import './assets/vendor/boxicons/css/boxicons.min.css'
import './assets/vendor/quill/quill.snow.css'
import './assets/vendor/quill/quill.bubble.css'
import './assets/vendor/remixicon/remixicon.css'
import './assets/vendor/simple-datatables/style.css'
import './assets/img/favicon.png'
import './assets/img/apple-touch-icon.png'
import './assets/css/style.css'


import { NavLink} from 'react-router-dom';


const DoctorList = () => {
  const [doctors, setDoctors] = useState(null); // Başlangıçta null olarak başlatıldı
  const adminId = localStorage.getItem('user');
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(`https://localhost:7050/GetDoctors?adminId=${adminId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
            });
        if (response.ok) {
          const data = await response.json();
          setDoctors(data); // Backend'den gelen admin verilerini state'e kaydet
          console.log(data);
        } else {
          console.error('Failed to fetch doctors.');
        }
      } catch (error) {
        console.error('An error occurred while fetching doctors:', error);
      }
    };

    // Sadece bir kere veri çekme işlemini gerçekleştir
    if (doctors === null) {
      fetchAdmins();
    }
  }, []);
  return (    
    <div>
    <div className="d-flex align-items-center justify-content-between">
      <a href="index.html" className="logo d-flex align-items-center">
        <img src="assets/img/logo.png" alt=""/>
        <span className="d-none d-lg-block">Patient Management</span>
      </a>
      <i className="bi bi-list toggle-sidebar-btn"></i>
    </div>

    <div className="search-bar">
      <form className="search-form d-flex align-items-center" method="POST" action="#">
        <input type="text" name="query" placeholder="Search" title="Enter search keyword"/>
        <button type="submit" title="Search"><i className="bi bi-search"></i></button>
      </form>
    </div>

    <nav className="header-nav ms-auto">
      <ul className="d-flex align-items-center">

        <li className="nav-item d-block d-lg-none">
          <a className="nav-link nav-icon search-bar-toggle " href="#">
            <i className="bi bi-search"></i>
          </a>
        </li>

        <li className="nav-item dropdown">


          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">

            <li>
              <hr className="dropdown-divider"></hr>
            </li>
            <li>
              <hr className="dropdown-divider"></hr>
            </li>

          </ul>

        </li>

        <li className="nav-item dropdown pe-3">

          <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <img src="assets/img/profile-img.jpg" alt="Profile" className="rounded-circle"/>
            <span className="d-none d-md-block dropdown-toggle ps-2">Super Admin</span>
          </a>

          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            <li className="dropdown-header">
              <h6>Kevin Anderson</h6>
              <span>Web Designer</span>
            </li>
            <li>
              <hr className="dropdown-divider"></hr>
            </li>

            <li>
              <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                <i className="bi bi-person"></i>
                <span>My Profile</span>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider"></hr>
            </li>

            <li>
              <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                <i className="bi bi-gear"></i>
                <span>Account Settings</span>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider"></hr>
            </li>

            <li>
              <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                <i className="bi bi-question-circle"></i>
                <span>Need Help?</span>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider"></hr>
            </li>

            <li>
              <a className="dropdown-item d-flex align-items-center" href="#">
                <i className="bi bi-box-arrow-right"></i>
                <span>Sign Out</span>
              </a>
            </li>

          </ul>
        </li>

      </ul>
    </nav>

  <aside id="sidebar" className="sidebar">

    <ul className="sidebar-nav" id="sidebar-nav">

      <li className="nav-item">
        <a className="nav-link collapsed" href="index.html">
          <i className="ri ri-building-4-line"></i>
          <span>Hospitals</span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="pages-faq.html">
          <i className="bi bi-person"></i>
          <span>Admins</span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link collapsed" href="pages-patients.html">
          <i className="bi bi-person"></i>
          <span>Patients</span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link collapsed" href="users-profile.html">
          <i className="bi bi-person"></i>
          <span>Patient</span>
        </a>
      </li>


      <li className="nav-item">

        <ul id="icons-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li>
            <a href="icons-bootstrap.html">
              <i className="bi bi-circle"></i><span>Bootstrap Icons</span>
            </a>
          </li>
          <li>
            <a href="icons-remix.html">
              <i className="bi bi-circle"></i><span>Remix Icons</span>
            </a>
          </li>
          <li>
            <a href="icons-boxicons.html">
              <i className="bi bi-circle"></i><span>Boxicons</span>
            </a>
          </li>
        </ul>
      </li>

      <li className="nav-item">
        <a className="nav-link collapsed" href="pages-login.html">
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
                <h2>DOCTORS</h2>
                <button className="button-33" role="button">Add New Admin</button>
              </div>
              <ul className="responsive-table">
                <li className="table-header">
                  <div className="col col-2"><i className="ri ri-building-4-line"></i><span style={{marginRight: '10px'}}></span>Doctor Name</div>
                  <div className="col col-3"><i className="bi bi-person-fill"></i><span style={{marginRight: '10px'}}></span>Mail
                  </div>
                  <div className="col col-4"><i className="ri  ri-mail-line"></i><span style={{marginRight: '10px'}}></span>Phone
                  </div>
                  <div className="col col-5"></div>
                </li>
                <div>
    {doctors === null ? (
      <div>Loading...</div>
    ) : (
      <ul>
        {doctors.map((doctor, index) => (
          <li key={index} className="table-row">
            <div className="col col-2" data-label="Hospital Name">{doctor.hospitalId}</div>
            <div className="col col-3" data-label="Admin">{doctor.name}</div>
            <div className="col col-4" data-label="Mail">{doctor.mail}</div>
            <div className="col col-5"> 
              {/* Düzenle ve Sil butonları */}
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
  </div>
  );
};

export default DoctorList;