import React, { useState, useEffect } from 'react';

import './AdminList.css';

import { NavLink } from 'react-router-dom';


const AdminList = () => {
  const [admins, setAdmins] = useState(null); // Başlangıçta null olarak başlatıldı
  const [showModal, setShowModal] = useState(false);
  const [selectedAdminId, setAdminId] = useState(null);

  const [formData, setFormData] = useState({
    adminName: '',
    phone: '',
    mail: '',
    password: '',
    hospital: ''
  });
  const [hospitals, setHospitals] = useState([]);
  const [editMode, setEditMode] = useState(false);
const [editHospitalId, setEditHospitalId] = useState(null);
  useEffect(() => {
    fetchAdmins(); // Fetch admins on component mount
    fetchHospitals();
  }, []);


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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.hospital === undefined) {
      alert("Please select a hospital");
      return;
    }
    console.log(formData);
    try {
      const response = await fetch('https://localhost:7050/AdminSign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Name: formData.adminName,
          Phone: formData.phone,
          Mail: formData.mail,
          Password: formData.password,
          HospitalName: formData.hospital // Assuming hospitalId is selected from the form
        })
      });
      if (response.ok) {
        // Başarılı bir şekilde admin eklendiğinde yapılacak işlemler
        console.log('Admin successfully added');
        // Yeni bir veri çekme işlemi başlat
        fetchAdmins();
        // Form verilerini sıfırla
        setFormData({
          adminName: '',
          password: '',
          mail: '',
          phone: '',
          hospital: ''
        });
        setShowModal(false);
      } else {
        console.error('Failed to add admin');
      }
    } catch (error) {
      console.error('An error occurred while adding admin:', error);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.hospital === undefined) {
      alert("Please select a hospital");
      return;
    }
    console.log(formData);
    try {
      const response = await fetch('https://localhost:7050/AdminUpdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Name: formData.adminName,
          Phone: formData.phone,
          Mail: formData.mail,
          Password: formData.password,
          HospitalName: formData.hospital, // Assuming hospitalId is selected from the form
          AdminId: selectedAdminId
        })
      });
      if (response.ok) {
        // Başarılı bir şekilde admin eklendiğinde yapılacak işlemler
        console.log('Admin successfully updated');
        // Yeni bir veri çekme işlemi başlat
        fetchAdmins();
        // Form verilerini sıfırla
        setFormData({
          adminName: '',
          password: '',
          mail: '',
          phone: '',
          hospital: ''
        });
        setEditMode(false);
      } else {
        console.error('Failed to update admin');
      }
    } catch (error) {
      console.error('An error occurred while updating admin:', error);
    }
  };
  const fetchHospitals = async () => {
    try {
      const response = await fetch('https://localhost:7050/GetHospitals');
      if (response.ok) {
        const data = await response.json();
        // API'den gelen verileri state'e kaydet
        setHospitals(data);
      } else {
        console.error('Failed to fetch states');
      }
    } catch (error) {
      console.error('An error occurred while fetching states:', error);
    }
  };
  const handleRemoveAdmin = async (adminId) => {
    const confirmation = window.confirm("Are you sure you want to remove this admin?");
    if(confirmation){
      try {
        const response = await fetch(`https://localhost:7050/RemoveAdmin?adminId=${adminId}`, {
          method: 'DELETE',
        });
        if (response.status === 200) {
          console.log('Admin successfully removed');
          fetchAdmins(); // Fetch updated admins after successful removal
        } else {
          console.error('Failed to remove admin');
        }
      } catch (error) {
        console.error('An error occurred while removing admin:', error);
      }
    }
    
  };
  const handleEditAdmin = (adminIndex) => {
    const admin = admins[adminIndex]; 
    setFormData({
      adminName: admin.name,
      phone: admin.phone,
      mail: admin.mail,
      password: admin.password,
      hospital : hospitals.find(hospital => hospital.hospitalId === admin.hospitalId)?.name || ""
    });
    setEditMode(true); 
    setAdminId(admin.adminId);
    toggleModal2();
  };
  const toggleModal = () => {
    setShowModal(!showModal);
    
  };
  const toggleModal2 = () => {
    setEditMode(!editMode);
    
  };

  return (
    <body>
      {/* ======= Header ======= */}
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center">
            <img src="/assets/img/logo.png" alt />
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
                <img src="/assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" />
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
            <a className="nav-link collapsed" href="/tr/hospitals">
              <i className="ri ri-building-4-line"></i>
              <span>Hastaneler</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/admins">
              <i className="bi bi-person"></i>
              <span>Yöneticiler</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" href="/tr/login-form">
              <i className="bi bi-box-arrow-in-right"></i>
              <span>Çıkış Yap</span>
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
                    <h2>YÖNETİCİLER</h2>
                    <button className="button-33" role="button" onClick={toggleModal}>Yönetici Ekle</button>
                  </div>
                  {showModal && (
                    <div class="xxx">
                      <div class="popup-box">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Yönetici İsmi</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="adminName" defaultValue={formData.adminName} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Telefon</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="phone" defaultValue={formData.phone} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Mail</label>
                              <div class="col-sm-10">
                                <input type="email" class="form-control" id="inputEmail" name="mail" defaultValue={formData.mail} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputPassword3" class="col-sm-2 form-label">Şifre</label>
                              <div class="col-sm-10">
                                <input type="password" class="form-control" id="inputPassword" name="password" defaultValue={formData.password} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div className="row mb-3">
                              
                              <label htmlFor="inputState" className="form-label">Hastane</label>
                              <select id="inputState" className="form-select" name="hospital" defaultValue={formData.hospital} onChange={handleInputChange}>
                                <option value="" >Choose...</option>
                                {/* State'leri döngü ile doldur */}
                                {hospitals.map((hospital, index) => (
                                  <option key={index}>{hospital.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="text-center">
                            <button type="submit" className="btn btn-primary">Kaydet</button>
                            <button className="btn-close-popup" onClick={toggleModal}>Kapat</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  {editMode && (
                    <div class="xxx">
                      <div class="popup-box">
                        <form onSubmit={handleUpdate}>
                          <div className="row mb-3">
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Yönetici İsmi</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="adminName" defaultValue={formData.adminName} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Telefon</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="phone" defaultValue={formData.phone} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Mail</label>
                              <div class="col-sm-10">
                                <input type="email" class="form-control" id="inputEmail" name="mail" defaultValue={formData.mail} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputPassword3" class="col-sm-2 form-label">Şifre</label>
                              <div class="col-sm-10">
                                <input type="password" class="form-control" id="inputPassword" name="password" defaultValue={formData.password} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div className="row mb-3">
                              
                              <label htmlFor="inputState" className="form-label">Hastane</label>
                              <select id="inputState" className="form-select" name="hospital" defaultValue={formData.hospital} onChange={handleInputChange}>
                                <option value="" >Choose...</option>
                                {/* State'leri döngü ile doldur */}
                                {hospitals.map((hospital, index) => (
                                  <option key={index}>{hospital.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="text-center">
                            <button type="submit" className="btn btn-primary">Kaydet</button>
                            <button className="btn-close-popup" onClick={toggleModal2}>Close</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  <ul className="responsive-table">
                    <li className="table-header">
                      <div className="col col-2"><i className="ri ri-building-4-line"></i><span style={{ marginRight: '10px' }}></span>Hastane</div>
                      <div className="col col-3"><i className="bi bi-person-fill"></i><span style={{ marginRight: '10px' }}></span>Yönetici
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
                              <div className="col col-2" data-label="Hospital Name">{hospitals.find(hospital => hospital.hospitalId === admin.hospitalId)?.name || ""}</div>
                              <div className="col col-3" data-label="Admin">{admin.name}</div>
                              <div className="col col-4" data-label="Mail">{admin.mail}</div>
                              <div className="col col-5">
                                <div className="btn-group">
                                  <span style={{ marginRight: 10 }} />
                                  <a className="btn btn-primary btn-sm" title="Edit Admin" onClick={() => handleEditAdmin(index)}>
                                    <i className="ri ri-edit-2-fill"></i>
                                  </a>
                                  <span style={{ marginRight: 10 }} />
                                  <button className="btn btn-danger btn-sm" title="Remove Admin" onClick={() => handleRemoveAdmin(admin.adminId)}>
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

export default AdminList;