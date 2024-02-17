import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddBook from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import MainPage from './components/MainPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to FakeTinder</h1>
          <Routes>
            <Route path="/" element={<AddBook />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/user/:userEmail" element={<MainPage />} />
            <Route path="*" element={
              <div>
                <p>404: This is not the webpage you are looking for</p>
              </div>
            } />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
