import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PatientDetails.css';

const PatientDetails = () => {
    const { id } = useParams(); // Extract patient ID from URL
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        // Fetch patient data from server using the patient ID
        fetch(`https://localhost:7050/patients/${id}`)
            .then(response => response.json())
            .then(data => setPatient(data))
            .catch(error => console.error('Error fetching patient data:', error));
    }, [id]); // Fetch data whenever the ID changes

    return (
        <div>
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
                        <li className="nav-item dropdown pe-3">
                            <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                                <img src="/assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" />
                                <span className="d-none d-md-block dropdown-toggle ps-2">K. Anderson</span>
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
            </header>{/* End Header */}
            {/* ======= Sidebar ======= */}
            <aside id="sidebar" className="sidebar">
                <ul className="sidebar-nav" id="sidebar-nav">
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/patients">
                            <i className="bi bi-person" />
                            <span>Patients</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            <i className="bi bi-person" />
                            <span>Patient Profile</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link collapsed" href="/login-form">
                            <i className="bi bi-box-arrow-in-right" />
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </aside>
            {/* ======= Sidebar End ======= */}
            <main id="main" className="main">
                <div className="pagetitle">
                    <div className="row align-items-center">
                        <div className="col-auto">
                            {/* Add the image here */}
                            <img src="/assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" style={{ width: 60, height: 60 }} />
                        </div>
                        <div className="col">
                            {patient ? (
                                <><div className="row align-items-center">
                                    <div className="col-auto">
                                        <a className="nav-link nav-profile d-flex align-items-center pe-0">
                                            <span className="d-none d-md-block">{patient.name} {patient.surname}</span>
                                        </a>{/* End Profile Image Icon */}
                                    </div>
                                </div>
                                    <div className="row mt-1">

                                        <div className="col-auto">
                                            <h6><strong>Age:</strong> {patient.age}</h6>
                                        </div><div className="col">
                                            <h6><strong>BMI:</strong> {patient.bmi}</h6>
                                        </div>

                                    </div></>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </div>
                </div>{/* End Page Title */}
                <section className="section profile">
                    <div className="row">
                        {/* <div class="col-xl-4">

            <div class="card">
                <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">

                <img src="assets/img/profile-img.jpg" alt="Profile" class="rounded-circle">
                <h2>Mustafa Dereci</h2>
                <h3>Male</h3>
                </div>
            </div>

            </div> */}
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-body pt-3">
                                    {/* Bordered Tabs */}
                                    <ul className="nav nav-tabs nav-tabs-bordered">
                                        <li className="nav-item">
                                            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#medical-history">Medical
                                                History</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#planned-operation">PreOP</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#operation-process">OP Process</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#post-operation">PostOP</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#monitoring">Monitoring</button>
                                        </li>
                                    </ul>
                                    <div className="tab-content pt-2">
                                        <div className="tab-pane fade show active profile-overview" id="profile-overview">
                                            {patient ? (
                                                <div className="row mb-3">
                                                    <div className="col-lg-6">
                                                        <h5 className="card-title">Demographic Information</h5>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Age</div>
                                                            <div className="col-lg-9 col-md-8">{patient.age}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Sex</div>
                                                            <div className="col-lg-9 col-md-8">{patient.sex === 1 ? 'Male' : 'Female'}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Name</div>
                                                            <div className="col-lg-9 col-md-8">{patient.name}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Surname</div>
                                                            <div className="col-lg-9 col-md-8">{patient.surname}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Phone</div>
                                                            <div className="col-lg-9 col-md-8">{patient.phone}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Address</div>
                                                            <div className="col-lg-9 col-md-8">{patient.address}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <h5 className="card-title">Anthropometric Information</h5>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Size</div>
                                                            <div className="col-lg-9 col-md-8">{patient.size} cm</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Weight</div>
                                                            <div className="col-lg-9 col-md-8">{patient.weight} kg</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">BMI</div>
                                                            <div className="col-lg-9 col-md-8">{patient.bmi}</div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-lg-3 col-md-4 label">Body Mass</div>
                                                            <div className="col-lg-9 col-md-8">{patient.bodyMass}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p>Loading...</p>
                                            )}
                                            {/* Hidden form for editing */}
                                            <form className="hidden-form">
                                                {/* Form fields for editing demographic information */}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div></section>
            </main>{/* End #main */}
            {/* ======= Footer ======= */}
            <footer id="footer" className="footer">
                <div className="copyright">
                    © Copyright <strong><span>Patient Management</span></strong>. All Rights Reserved
                </div>
                <div className="credits">
                    {/* All the links in the footer should remain intact. */}
                    {/* You can delete the links only if you purchased the pro version. */}
                    {/* Licensing information: https://bootstrapmade.com/license/ */}
                    {/* Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ */}
                    Designed by <a>Zekican and Ozan</a>
                </div>
            </footer>{/* End Footer */}
            <a href="#" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short" /></a>
            {/* Vendor JS Files */}
            {/* Template Main JS File */}
        </div>

    );
};

export default PatientDetails;


