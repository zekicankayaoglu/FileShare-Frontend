import logo from './logo.svg';
import './App.css';
import LoginForm from './En/Pages/Login/Login';
import SignForm from './En/Pages/Sign/Sign';


import FileUpload from './MainPage/Main';
import {Route, Routes} from 'react-router-dom'
import Friends from './En/Pages/Friends/Friends'; 
import MyFiles from './En/Pages/MyFiles/MyFiles';  

function App() {
  return (
    <div>
      <Routes>
          <Route path='/en/login-form' element={<LoginForm/>} />
          <Route path='/en/sign-form' element={<SignForm/>} />
          <Route path='/en/myfiles' element={<MyFiles/>} />
          <Route path='/upload' element={<FileUpload/>} />
          
          <Route path='/friends' element={<Friends/>} />
          
          </Routes>
    </div>
  );
}

export default App;
