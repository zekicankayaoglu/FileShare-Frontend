import React, { useState, useEffect } from 'react';

import './HospitalList.css';

import { NavLink } from 'react-router-dom';


const HospitalList = () => {
  const [hospitals, setHospitals] = useState(null); // Başlangıçta null olarak başlatıldı

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    hospitalName: '',
    phone: '',
    mail: '',
    address: ''
  });
  const [editMode, setEditMode] = useState(false);
const [editHospitalId, setEditHospitalId] = useState(null);
  useEffect(() => {
    fetchHospitals(); // Fetch admins on component mount
  }, []);
  
    const fetchHospitals = async () => {
      try {
        const response = await fetch('https://localhost:7050/GetHospitals');
        if (response.ok) {
          const data = await response.json();
          setHospitals(data); // Backend'den gelen hospital verilerini state'e kaydet
          console.log(data);
        } else {
          console.error('Failed to fetch hospitals');
        }
      } catch (error) {
        console.error('An error occurred while fetching hospitals:', error);
      }
    };

    // Sadece bir kere veri çekme işlemini gerçekleştir
    if (hospitals === null) {
      fetchHospitals();
    }

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(formData);
      try {
        const response = await fetch('https://localhost:7050/HospitalRegister', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Name: formData.hospitalName,
            Phone: formData.phone, //mail eklenebilir
            Address: formData.address,
          })
        });
        if (response.ok) {
          // Başarılı bir şekilde admin eklendiğinde yapılacak işlemler
          console.log('Admin successfully added');
          // Yeni bir veri çekme işlemi başlat
          fetchHospitals();
          // Form verilerini sıfırla
          setFormData({
            hospitalName: '',
            phone: '',
            address: ''
          });
          setShowModal(false);
        } else {
          console.error('Failed to add admin');
        }
      } catch (error) {
        console.error('An error occurred while adding admin:', error);
      }
    };
  const handleRemoveHospital = async (hospitalId) => {
    try {
      const response = await fetch(`https://localhost:7050/RemoveHospital?hospitalId=${hospitalId}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        console.log('Admin successfully removed');
        fetchHospitals(); // Fetch updated admins after successful removal
      } else {
        console.error('Failed to remove admin');
      }
    } catch (error) {
      console.error('An error occurred while removing admin:', error);
    }
  };
  const handleEditHospital = (hospitalIndex) => {
    const hospital = hospitals[hospitalIndex]; // İlgili hastanenin bilgilerini al
    setFormData({
      hospitalName: hospital.name,
      phone: hospital.phone,
      address: hospital.address
    });
    setEditMode(true); // Düzenleme modunu etkinleştir
    toggleModal(); // Modalı aç
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
            <a className="nav-link collapse" href="/hospitals">
              <i className="ri ri-building-4-line"></i>
              <span>Hospitals</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" href="/admins">
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
                    <h2>HOSPITALS</h2>
                    <button className="button-33" role="button" onClick={toggleModal}>Add New Hospital</button>
                  </div>
                  {showModal && (
                    <div class="xxx">
                      <div class="popup-box">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Hospital Name</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="hospitalName" defaultValue={formData.hospitalName} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Phone</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="phone" defaultValue={formData.phone} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Address</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="address" defaultValue={formData.address} onChange={handleInputChange} />
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
                      <div className="col col-3"><i className="bi bi-person-fill"></i><span style={{ marginRight: '10px' }}></span>Address
                      </div>
                      <div className="col col-4"><i className="ri  ri-mail-line"></i><span style={{ marginRight: '10px' }}></span>Phone
                      </div>
                      <div className="col col-5"></div>
                    </li>
                    <div>
                      {hospitals === null ? (
                        <div>Loading...</div>
                      ) : (
                        <ul>
                          {hospitals.map((hospital, index) => (
                            <li key={index} className="table-row">
                              <div className="col col-2" data-label="Hospital Name">{hospital.name}</div>
                              <div className="col col-3" data-label="Address">{hospital.address}</div>
                              <div className="col col-4" data-label="Mail">{hospital.phone}</div>
                              <div className="col col-5">
                                <div className="btn-group">
                                  <a className="btn btn-primary btn-sm" title="Open Admin" href=''>
                                    <i class="bi bi-eye"></i>
                                  </a>
                                  <span style={{ marginRight: 10 }} />
                                  <a className="btn btn-primary btn-sm" title="Edit Admin" onClick={() => handleEditHospital(index)}>
                                    <i className="ri ri-edit-2-fill"></i>
                                  </a>
                                  <span style={{ marginRight: 10 }} />
                                  <button className="btn btn-danger btn-sm" title="Remove Admin" onClick={() => handleRemoveHospital(hospital.hospitalId)}>
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

export default HospitalList;