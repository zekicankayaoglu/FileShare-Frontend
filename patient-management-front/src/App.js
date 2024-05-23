import logo from './logo.svg';
import './App.css';
import LoginForm from './En/Pages/Login/Login';
import AdminList from './En/Pages/Lists/AdminList';
import DoctorList from './En/Pages/Lists/DoctorList';
import HospitalList from './En/Pages/Lists/HospitalList'
import PatientList from './En/Pages/Lists/PatientList';
import PatientDetails from './En/Pages/Patient Details/PatientDetails';

import LoginFormTr from './Tr/Pages/Login/Login';
import AdminListTr from './Tr/Pages/Lists/AdminList';
import DoctorListTr from './Tr/Pages/Lists/DoctorList';
import HospitalListTr from './Tr/Pages/Lists/HospitalList'
import PatientListTr from './Tr/Pages/Lists/PatientList';
import PatientDetailsTr from './Tr/Pages/Patient Details/PatientDetails';

import {Route, Routes} from 'react-router-dom'


function App() {
  return (
    <div>
      <Routes>
          <Route path='/en/login-form' element={<LoginForm/>} />
          <Route path='/en/admins' element={<AdminList/>} />
          <Route path='/en/doctors' element={<DoctorList/>} />
          <Route path='/en/hospitals' element={<HospitalList/>} />
          <Route path='/en/patients' element={<PatientList/>} />
          <Route path='/en/patients/:id' element={<PatientDetails/>} />

          <Route path='/tr/login-form' element={<LoginFormTr/>} />
          <Route path='/tr/admins' element={<AdminListTr/>} />
          <Route path='/tr/doctors' element={<DoctorListTr/>} />
          <Route path='/tr/hospitals' element={<HospitalListTr/>} />
          <Route path='/tr/patients' element={<PatientListTr/>} />
          <Route path='/tr/patients/:id' element={<PatientDetailsTr/>} />
          </Routes>
    </div>
  );
}

export default App;
