import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './PatientList.css';

function PatientList() {
  const [patients, setPatients] = useState(null); 
  const doctorId = localStorage.getItem('user');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    mail: '',
    phone: '',
    hospital: '',
  });
  const toggleModal = () => {
    setShowModal(!showModal);

  };
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
      fetchPatients();
  }, []);
  const fetchPatients = async () => {
    try {
      const response = await fetch(`https://localhost:7050/GetPatients?doctorId=${doctorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPatients(data); 
      } else {
        console.error('Failed to fetch patients.');
      }
    } catch (error) {
      console.error('An error occurred while fetching patients:', error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch(`https://localhost:7050/AddPatient/${doctorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Name: formData.name,
          Surname: formData.surname,
          Phone: formData.phone,
          Mail: formData.mail
        })
      });
      if (response.ok) {
        // Başarılı bir şekilde admin eklendiğinde yapılacak işlemler
        console.log('patient successfully added');
        fetchPatients();
        // Yeni bir veri çekme işlemi başlat
        // Form verilerini sıfırla
        setFormData({
          name: '',
          surname: '',
          mail: '',
          phone: ''
      
        });
        setShowModal(false);
      } else {
        console.error('Failed to add patient');
      }
    } catch (error) {
      console.error('An error occurred while adding patient:', error);
    }
  };

  const handleRemovePatient = async (patientId) => {
    const confirmation = window.confirm("Are you sure you want to remove this patient?");
    if(confirmation){
      try {
        const response = await fetch(`https://localhost:7050/RemovePatient/${patientId}`, {
          method: 'DELETE',
        });
        if (response.status === 200) {
          console.log('Admin successfully removed');
          fetchPatients(); // Fetch updated admins after successful removal
        } else {
          console.error('Failed to remove patient');
        }
      } catch (error) {
        console.error('An error occurred while removing patient:', error);
      }
    }
  };
  
  return (
    <body>
      {/* ======= Header ======= */}
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <a href="" className="logo d-flex align-items-center">
            <img src="/assets/img/logo.png" alt />
            <span className="d-none d-lg-block">Patient Management</span>
          </a>
          <i className="bi bi-list toggle-sidebar-btn" />
        </div>{/* End Logo */}
        <div className="search-bar">
          <form className="search-form d-flex align-items-center" method="POST" action="#">
            <input type="text" name="query" placeholder="Arama" title="Arama anahtar kelimesini girin" />
            <button type="submit" title="Arama"><i className="bi bi-search" /></button>
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
                <span className="d-none d-md-block dropdown-toggle ps-2">Doktor</span>
              </a>{/* End Profile Iamge Icon */}
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>Kevin Anderson</h6>
                  <span>Web Tasarımcısı</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                    <i className="bi bi-person" />
                    <span>Profilim</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="users-profile.html">
                    <i className="bi bi-gear" />
                    <span>Hesap Ayarları</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="pages-faq.html">
                    <i className="bi bi-question-circle" />
                    <span>Yardım</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <i className="bi bi-box-arrow-right" />
                    <span>Çıkış Yap</span>
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
            <a className="nav-link collapse" href="/tr/patients">
              <i className="bi bi-person"></i>
              <span>Hastalar</span>
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
                    <h2>HASTALAR</h2>
                    <button className="button-33" role="button" onClick={toggleModal}>Yeni Hasta Ekle</button>
                  </div>
                  {showModal && (
                    <div class="xxx">
                      <div class="popup-box">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Ad</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputName" name="name" defaultValue={formData.name} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Soyad</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputPhone" name="surname" defaultValue={formData.surname} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Mail</label>
                              <div class="col-sm-10">
                                <input type="email" class="form-control" id="inputEmail" name="mail" defaultValue={formData.mail} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputPassword3" class="col-sm-2 form-label">Telefon</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputPassword" name="phone" defaultValue={formData.phone} onChange={handleInputChange} />
                              </div>
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
                  <ul className="responsive-table">
                    <li className="table-header">
                      <div className="col col-2"><i className="ri ri-building-4-line"></i><span style={{ marginRight: '10px' }}></span>Hasta Adı</div>
                      <div className="col col-3"><i className="bi bi-person-fill"></i><span style={{ marginRight: '10px' }}></span>Mail</div>
                      <div className="col col-4"><i className="ri ri-mail-line"></i><span style={{ marginRight: '10px' }}></span>Telefon</div>
                      <div className="col col-5"></div>
                    </li>
                    <div>
                      {patients === null ? (
                        <div>Yükleniyor...</div>
                      ) : (
                        <ul>
                          {patients.map((patient, index) => (
                            <li key={index} className="table-row">
                                <div className="col col-2" data-label="Hasta Adı">{patient.name}</div>
                                <div className="col col-3" data-label="Mail">{patient.mail}</div>
                                <div className="col col-4" data-label="Telefon">{patient.phone}</div>
                                <div className="col col-5">
                                    <div className="btn-group">
                                        <a className="btn btn-primary btn-sm" title="Hastayı Aç" href={`/tr/patients/${patient.patientId}`}>
                                            <i class="bi bi-eye"></i>
                                        </a>
                                        
                                        <span style={{marginRight: 10}} />
                                        <a className="btn btn-danger btn-sm" title="Hastayı Sil"><i className="bi bi-trash" onClick={() => handleRemovePatient(patient.patientId)}/></a>
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
}

export default PatientList;
