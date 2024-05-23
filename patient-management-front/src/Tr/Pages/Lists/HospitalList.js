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
  const [selectedHospitalId, setHospitalId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editHospitalId, setEditHospitalId] = useState(null);
  
  useEffect(() => {
    fetchHospitals(); // Bileşen yüklendiğinde hastaneleri getir
  }, []);
  
  const fetchHospitals = async () => {
    try {
      const response = await fetch('https://localhost:7050/GetHospitals');
      if (response.ok) {
        const data = await response.json();
        setHospitals(data); // Backend'den gelen hospital verilerini state'e kaydet
        console.log(data);
      } else {
        console.error('Hastaneler getirilemedi');
      }
    } catch (error) {
      console.error('Hastaneler getirilirken bir hata oluştu:', error);
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
        console.log('Hastane başarıyla eklendi');
        fetchHospitals();
        setFormData({
          hospitalName: '',
          phone: '',
          address: ''
        });
        setShowModal(false);
      } else {
        console.error('Hastane eklenemedi');
      }
    } catch (error) {
      console.error('Hastane eklenirken bir hata oluştu:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch('https://localhost:7050/HospitalUpdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Name: formData.hospitalName,
          Phone: formData.phone,
          Address: formData.address,
          HospitalId: selectedHospitalId
        })
      });
      if (response.ok) {
        console.log('Hastane başarıyla güncellendi');
        fetchHospitals();
        setFormData({
          hospitalName: '',
          phone: '',
          mail: '',
          address: ''
        });
        setEditMode(false);
      } else {
        console.error('Hastane güncellenemedi');
      }
    } catch (error) {
      console.error('Hastane güncellenirken bir hata oluştu:', error);
    }
  };

  const handleRemoveHospital = async (hospitalId) => {
    const confirmation = window.confirm("Bu hastaneyi silmek istediğinizden emin misiniz?");
    if (confirmation) {
      try {
        const response = await fetch(`https://localhost:7050/RemoveHospital?hospitalId=${hospitalId}`, {
          method: 'DELETE',
        });
        if (response.status === 200) {
          console.log('Hastane başarıyla silindi');
          fetchHospitals(); // Silme işleminden sonra hastaneleri tekrar getir
        } else {
          console.error('Hastane silinemedi');
        }
      } catch (error) {
        console.error('Hastane silinirken bir hata oluştu:', error);
      }
    }
  };

  const handleEditHospital = (hospitalIndex) => {
    const hospital = hospitals[hospitalIndex];
    setFormData({
      hospitalName: hospital.name,
      phone: hospital.phone,
      address: hospital.address
    });
    setEditMode(true);
    setHospitalId(hospital.hospitalId);
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
            <input type="text" name="query" placeholder="Arama" title="Arama kelimesi girin" />
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
                    <span>Yardıma mı ihtiyacınız var?</span>
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
            <a className="nav-link collapse" href="/tr/hospitals">
              <i className="ri ri-building-4-line"></i>
              <span>Hastaneler</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link collapsed" href="/tr/admins">
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
                    <h2>HASTANELER</h2>
                    <button className="button-33" role="button" onClick={toggleModal}>Yeni Hastane Ekle</button>
                  </div>
                  {showModal && (
                    <div class="xxx">
                      <div class="popup-box">
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Hastane Adı</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="hospitalName" defaultValue={formData.hospitalName} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Telefon</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="phone" defaultValue={formData.phone} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Adres</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="address" defaultValue={formData.address} onChange={handleInputChange} />
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
                  {editMode && (
                    <div class="xxx">
                      <div class="popup-box">
                        <form onSubmit={handleUpdate}>
                        <div className="row mb-3">
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Hastane Adı</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="hospitalName" defaultValue={formData.hospitalName} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Telefon</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="phone" defaultValue={formData.phone} onChange={handleInputChange} />
                              </div>
                            </div>
                            <div class="row mb-3">
                              <label for="inputEmail3" class="col-sm-2 col-form-label">Adres</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="inputText" name="address" defaultValue={formData.address} onChange={handleInputChange} />
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <button type="submit" className="btn btn-primary">Güncelle</button>
                            <button className="btn-close-popup" onClick={toggleModal2}>Kapat</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  <ul className="responsive-table">
                    <li className="table-header">
                      <div className="col col-2"><i className="ri ri-building-4-line"></i><span style={{ marginRight: '10px' }}></span>Hastane</div>
                      <div className="col col-3"><i className="bi bi-person-fill"></i><span style={{ marginRight: '10px' }}></span>Adres
                      </div>
                      <div className="col col-4"><i className="ri  ri-mail-line"></i><span style={{ marginRight: '10px' }}></span>Telefon
                      </div>
                      <div className="col col-5"></div>
                    </li>
                    <div>
                      {hospitals === null ? (
                        <div>Yükleniyor...</div>
                      ) : (
                        <ul>
                          {hospitals.map((hospital, index) => (
                            <li key={index} className="table-row">
                              <div className="col col-2" data-label="Hospital Name">{hospital.name}</div>
                              <div className="col col-3" data-label="Address">{hospital.address}</div>
                              <div className="col col-4" data-label="Mail">{hospital.phone}</div>
                              <div className="col col-5">
                                <div className="btn-group">
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