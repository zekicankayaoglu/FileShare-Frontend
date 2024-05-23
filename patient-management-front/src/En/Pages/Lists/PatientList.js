import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './PatientList.css';

function PatientList() {
  const [patients, setPatients] = useState(null); 
  const doctorId = localStorage.getItem('user');

  useEffect(() => {
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

    // Fetch patients only once when component mounts
    if (patients === null) {
      fetchPatients();
    }
  }, []);

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
                <span className="d-none d-md-block dropdown-toggle ps-2">Doctor</span>
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
            <a className="nav-link collapse" href="/en/patients">
              <i className="bi bi-person"></i>
              <span>Patients</span>
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
                    <h2>PATIENTS</h2>
                    <button className="button-33" role="button">Add New Patient</button>
                  </div>
                  <ul className="responsive-table">
                    <li className="table-header">
                      <div className="col col-2"><i className="ri ri-building-4-line"></i><span style={{ marginRight: '10px' }}></span>Patient Name</div>
                      <div className="col col-3"><i className="bi bi-person-fill"></i><span style={{ marginRight: '10px' }}></span>Mail</div>
                      <div className="col col-4"><i className="ri ri-mail-line"></i><span style={{ marginRight: '10px' }}></span>Phone</div>
                      <div className="col col-5"></div>
                    </li>
                    <div>
                      {patients === null ? (
                        <div>Loading...</div>
                      ) : (
                        <ul>
                          {patients.map((patient, index) => (
                            <li key={index} className="table-row">
                                <div className="col col-2" data-label="Patient Name">{patient.name}</div>
                                <div className="col col-3" data-label="Doctor">{patient.mail}</div>
                                <div className="col col-4" data-label="Mail">{patient.phone}</div>
                                <div className="col col-5">
                                    <div className="btn-group">
                                        <a className="btn btn-primary btn-sm" title="Open Patient" href={`/en/patients/${patient.patientId}`}>
                                            <i class="bi bi-eye"></i>
                                        </a>
                                        <span style={{marginRight: 10}} />
                                        <a className="btn btn-primary btn-sm" title="Edit Patient">
                                            <i className="ri ri-edit-2-fill"></i>
                                        </a>
                                        <span style={{marginRight: 10}} />
                                        <a className="btn btn-danger btn-sm" title="Remove Patient"><i className="bi bi-trash" /></a>
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