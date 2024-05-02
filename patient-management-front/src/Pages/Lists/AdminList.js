import React, { useState, useEffect } from 'react';

import './AdminList.css';

import { NavLink } from 'react-router-dom';


const AdminList = () => {
  const [admins, setAdmins] = useState(null); // Başlangıçta null olarak başlatıldı
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    adminName: '',
    phone: '',
    mail: '',
    password: ''
  });

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('https://localhost:7050/GetAdmins');
        if (response.ok) {
          const data = await response.json();
          setAdmins(data); // Backend'den gelen admin verilerini state'e kaydet
          console.log(data);
        } else {
          console.error('Failed to fetch admins');
        }
      } catch (error) {
        console.error('An error occurred while fetching admins:', error);
      }
    };

    // Sadece bir kere veri çekme işlemini gerçekleştir
    if (admins === null) {
      fetchAdmins();
    }
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch('https://localhost:7050/AddAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Başarılı bir şekilde admin eklendiğinde yapılacak işlemler
        console.log('Admin successfully added');
        // Yeni bir veri çekme işlemi başlat
        //fetchAdmins();
        // Form verilerini sıfırla
        setFormData({
          username: '',
          password: '',
          mail: '',
          phone: ''
        });
        setShowModal(false);
      } else {
        console.error('Failed to add admin');
      }
    } catch (error) {
      console.error('An error occurred while adding admin:', error);
    }
  };
  const toggleModal = () => {
    setShowModal(!showModal);

  };
  
  return (
    <body>
      {/* ======= Header ======= */}
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center">
            <img src="assets/img/logo.png" alt />
            <span className="d-none d-lg-block">Patient Management</span>
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
                <img src="assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" />
                <span className="d-none d-md-block dropdown-toggle ps-2">Super Admin</span>
              </a>{/* End Profile Iamge Icon */}
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>Kevin Anderson</h6>
                  <span>Web Designer</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                    <i className="bi bi-person" />
                    <span>My Profile</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                    <i className="bi bi-gear" />
                    <span>Account Settings</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                    <i className="bi bi-question-circle" />
                    <span>Need Help?</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <i className="bi bi-box-arrow-right" />
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>{/* End Profile Dropdown Items */}
            </li>{/* End Profile Nav */}
          </ul>
        </nav>{/* End Icons Navigation */}
      </header>

      <aside id="sidebar" className="sidebar">

        <ul className="sidebar-nav" id="sidebar-nav">

          <li className="nav-item">
            <a className="nav-link collapsed" href="/hospitals">
              <i className="ri ri-building-4-line"></i>
              <span>Hospitals</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/admins">
              <i className="bi bi-person"></i>
              <span>Admins</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" href="/login-form">
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
                    <h2>ADMINS</h2>
                    <button className="button-33" role="button" onClick={toggleModal}>Add New Admin</button>
                  </div>
                  {showModal && (
                    <div class="xxx">
                    <div class="popup-box">
                      <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                        <div class="row mb-3">
                          <label for="inputEmail3" class="col-sm-2 col-form-label">Admin Name</label>
                          <div class="col-sm-10">
                            <input type="text" class="form-control" id="inputText" value={formData.adminName} onChange={handleInputChange}/>
                          </div>
                        </div>
                        <div class="row mb-3">
                          <label for="inputEmail3" class="col-sm-2 col-form-label">Phone</label>
                          <div class="col-sm-10">
                            <input type="text" class="form-control" id="inputText" value={formData.phone} onChange={handleInputChange}/>
                          </div>
                        </div>
                          <div class="row mb-3">
                            <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
                            <div class="col-sm-10">
                              <input type="email" class="form-control" id="inputEmail" value={formData.mail} onChange={handleInputChange}/>
                            </div>
                          </div>
                          <div class="row mb-3">
                            <label for="inputPassword3" class="col-sm-2 form-label">Password</label>
                            <div class="col-sm-10">
                              <input type="password" class="form-control" id="inputPassword" value={formData.password} onChange={handleInputChange}/>
                            </div>
                          </div> 
                        </div>
                        <div className="text-center">
                          <button type="submit" className="btn btn-primary">Submit</button>
                          <button className="btn-close-popup" onClick={toggleModal}>Close</button>
                        </div>
                      </form>
                    </div>
                    </div>
                )}
                  <ul className="responsive-table">
                    <li className="table-header">
                      <div className="col col-2"><i className="ri ri-building-4-line"></i><span style={{ marginRight: '10px' }}></span>Hospital</div>
                      <div className="col col-3"><i className="bi bi-person-fill"></i><span style={{ marginRight: '10px' }}></span>Admin
                      </div>
                      <div className="col col-4"><i className="ri  ri-mail-line"></i><span style={{ marginRight: '10px' }}></span>Mail
                      </div>
                      <div className="col col-5"></div>
                    </li>
                    <div>
                      {admins === null ? (
                        <div>Loading...</div>
                      ) : (
                        <ul>
                          {admins.map((admin, index) => (
                            <li key={index} className="table-row">
                              <div className="col col-2" data-label="Hospital Name">{admin.hospitalId}</div>
                              <div className="col col-3" data-label="Admin">{admin.name}</div>
                              <div className="col col-4" data-label="Mail">{admin.mail}</div>
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
    </body>
  );
};

export default AdminList;