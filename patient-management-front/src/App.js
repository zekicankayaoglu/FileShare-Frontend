import logo from './logo.svg';
import './App.css';
import LoginForm from './Pages/Login/Login';
import AdminList from './Pages/Lists/AdminList';
import DoctorList from './Pages/Lists/DoctorList';
import HospitalList from './Pages/Lists/HospitalList'

import {Route, Routes} from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
          <Route path='/login-form' element={<LoginForm/>} />
          <Route path='/admins' element={<AdminList/>} />
          <Route path='/doctors' element={<DoctorList/>} />
          <Route path='/hospitals' element={<HospitalList/>} />
          </Routes>
    </div>
  );
}

export default App;
