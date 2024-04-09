import React, { useState } from 'react';
import './Login.css';
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
import { useNavigate } from 'react-router-dom';


import { NavLink} from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    UserId: 0,
    userType: ''
  });
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log(formData)
      formData.UserId=0;
      formData.userType='s';
      console.log(formData)
      const response = await fetch('https://localhost:7050/AdminLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('Login successful');
        const responseData = await response.json();
        const userID = responseData.userId;
        console.log(responseData);
        localStorage.setItem('user', userID);
        console.log(localStorage.getItem('user'));
        navigate('/admins');
 
        // Burada giriş başarılıysa yapılacak işlemleri gerçekleştirebilirsiniz.
      } else {
        console.error('Login failed');
        setErrorMessage("Wrong mail or password!")
        // Giriş başarısız olduğunda yapılacak işlemleri gerçekleştirebilirsiniz.
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
    console.log(formData)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="container">
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
                  <ul class="nav nav-tabs nav-tabs-bordered">
                      <li class="nav-item">
                        <button class="nav-link active" data-bs-toggle="tab"
                          data-bs-target="#admin-login">Admin</button>
                      </li>
                      <li class="nav-item">
                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#doctor-login">Doctor
                          </button>
                      </li>
                    </ul>
                  <div className="tab-content pt-2">
                    <div className="tab-pane fade show active profile-overview" id="admin-login">
                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">Login To Your Admin Account</h5>
                        <p className="text-center small">Enter your username & password to login</p>
                      </div>
                      <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                        <div className="col-12">
                          <label htmlFor="yourUsername" className="form-label">Username</label>
                          <div className="input-group has-validation">
                            <span className="input-group-text" id="inputGroupPrepend">@</span>
                            <input type="text" name="email" className="form-control" id="yourUsername" required value={formData.email} onChange={handleChange} />
                            <div className="invalid-feedback">Please enter your username.</div>
                          </div>
                        </div>
                        <div className="col-12">
                          <label htmlFor="yourPassword" className="form-label">Password</label>
                          <input type="password" name="password" className="form-control" id="yourPassword" required value={formData.password} onChange={handleChange} />
                          <div className="invalid-feedback">Please enter your password!</div>
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe" />
                            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <button className="btn btn-primary w-100" type="submit">Login</button>
                        </div>
                        {errorMessage && <div className="error"> {errorMessage} </div>}
                      </form>
                    </div>
                    <div class="tab-pane fade show active profile-overview"id="doctor-login">
                  <div class="pt-4 pb-2">
                    <h5 class="card-title text-center pb-0 fs-4">Login to Your Doctor Account</h5>
                    <p class="text-center small">Enter your username & password to login</p>
                  </div>

                  <form class="row g-3 needs-validation" novalidate>

                    <div class="col-12">
                      <label for="yourUsername" class="form-label">Username</label>
                      <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="text" name="username" class="form-control" id="yourUsername" required/>
                        <div class="invalid-feedback">Please enter your username.</div>
                      </div>
                    </div>

                    <div class="col-12">
                      <label for="yourPassword" class="form-label">Password</label>
                      <input type="password" name="password" class="form-control" id="yourPassword" required/>
                      <div class="invalid-feedback">Please enter your password!</div>
                    </div>

                    <div class="col-12">
                      <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe"/>
                        <label class="form-check-label" for="rememberMe">Remember me</label>
                      </div>
                    </div>
                    <div class="col-12">
                      <button class="btn btn-primary w-100" type="submit">Login</button>
                    </div>  
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