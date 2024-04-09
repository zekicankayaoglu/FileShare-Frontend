import logo from './logo.svg';
import './App.css';
import LoginForm from './Pages/Login/Login';
import AdminList from './Pages/Lists/AdminList';
import DoctorList from './Pages/Lists/DoctorList'
import {Route, Routes} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Routes>
          <Route path='/login-form' element={<LoginForm/>} />
          <Route path='/admins' element={<AdminList/>} />
          <Route path='/doctors' element={<DoctorList/>} />
          </Routes>
      </header>
    </div>
  );
}

export default App;
