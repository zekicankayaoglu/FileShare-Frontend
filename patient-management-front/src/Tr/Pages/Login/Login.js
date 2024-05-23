import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    UserId: 0,
    userType: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [activeForm, setActiveForm] = useState('admin');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        activeForm === 'admin'
          ? 'https://localhost:7050/AdminLogin'
          : 'https://localhost:7050/DoctorLogin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        console.log('Giriş başarılı');
        const responseData = await response.json();
        const userID = responseData.userId;
        localStorage.setItem('user', userID);
        if (userID === 0) {
          navigate('/tr/admins');
        } else if (responseData.userType === "admin") {
          navigate('/tr/doctors');
        } else {
          navigate('/tr/patients');
        }
      } else {
        console.error('Giriş başarısız');
        setErrorMessage('Yanlış e-posta veya şifre!');
      }
    } catch (error) {
      console.error('Bir hata oluştu:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFormSwitch = (form) => {
    setActiveForm(form);
    setErrorMessage('');
  };

  return (
    <div className="container">
      <div className="language-switcher">
        <span className="fi fi-gb" onClick={() => navigate('/en/login-form')}></span>
      </div>
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex justify-content-center py-4">
                <a className="logo d-flex align-items-center w-auto">
                  <img src="./assets/img/logo.png" alt="" />
                  <span className="d-none d-lg-block">Patient Management System</span>
                </a>
              </div>
              <div className="card mb-3">
                <div className="card-body">
                  <ul className="nav nav-tabs nav-tabs-bordered">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeForm === 'admin' ? 'active' : ''}`}
                        onClick={() => handleFormSwitch('admin')}
                      >
                        Yönetici
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeForm === 'doctor' ? 'active' : ''}`}
                        onClick={() => handleFormSwitch('doctor')}
                      >
                        Doktor
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content pt-2">
                    <div
                      className={`tab-pane fade show ${activeForm === 'admin' ? 'active' : ''
                        } profile-overview`}
                      id="admin-login"
                    >
                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">
                          Yönetici Hesabınıza Giriş Yapın
                        </h5>
                        <p className="text-center small">
                          Giriş yapmak için kullanıcı adınızı ve şifrenizi girin
                        </p>
                      </div>
                      <form
                        className="row g-3 needs-validation"
                        noValidate
                        onSubmit={handleSubmit}
                      >
                        <div className="col-12">
                          <label htmlFor="yourUsername" className="form-label">
                            Kullanıcı Adı
                          </label>
                          <div className="input-group has-validation">
                            <span className="input-group-text" id="inputGroupPrepend">
                              @
                            </span>
                            <input
                              type="text"
                              name="email"
                              className="form-control"
                              id="yourUsername"
                              required
                              value={formData.email}
                              onChange={handleChange}
                            />
                            <div className="invalid-feedback">
                              Lütfen kullanıcı adınızı girin.
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <label htmlFor="yourPassword" className="form-label">
                            Şifre
                          </label>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            id="yourPassword"
                            required
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <div className="invalid-feedback">
                            Lütfen şifrenizi girin!
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="remember"
                              value="true"
                              id="rememberMe"
                            />
                            <label className="form-check-label" htmlFor="rememberMe">
                              Beni hatırla
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <button className="btn btn-primary w-100" type="submit">
                            Giriş Yap
                          </button>
                        </div>
                        {errorMessage && <div className="error"> {errorMessage} </div>}
                      </form>
                    </div>
                    <div
                      className={`tab-pane fade ${activeForm === 'doctor' ? 'show active' : ''
                        } profile-overview`}
                      id="doctor-login"
                    >
                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">
                          Doktor Hesabınıza Giriş Yapın
                        </h5>
                        <p className="text-center small">
                          Giriş yapmak için kullanıcı adınızı ve şifrenizi girin
                        </p>
                      </div>
                      <form
                        className="row g-3 needs-validation"
                        noValidate
                        onSubmit={handleSubmit}
                      >
                        <div className="col-12">
                          <label htmlFor="yourUsername" className="form-label">
                            Kullanıcı Adı
                          </label>
                          <div className="input-group has-validation">
                            <span className="input-group-text" id="inputGroupPrepend">
                              @
                            </span>
                            <input
                              type="text"
                              name="email"
                              className="form-control"
                              id="yourUsername"
                              required
                              value={formData.email}
                              onChange={handleChange}
                            />
                            <div className="invalid-feedback">
                              Lütfen kullanıcı adınızı girin.
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <label htmlFor="yourPassword" className="form-label">
                            Şifre
                          </label>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            id="yourPassword"
                            required
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <div className="invalid-feedback">
                            Lütfen şifrenizi girin!
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="remember"
                              value="true"
                              id="rememberMe"
                            />
                            <label className="form-check-label" htmlFor="rememberMe">
                              Beni hatırla
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <button className="btn btn-primary w-100" type="submit">
                            Giriş Yap
                          </button>
                        </div>
                        {errorMessage && <div className="error"> {errorMessage} </div>}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginForm;
