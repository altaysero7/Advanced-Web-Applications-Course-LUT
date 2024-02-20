//Referencing: https://getbootstrap.com/docs/4.0/components/navbar/

import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import MainPage from './components/MainPage';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/HomePage';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faHeartbeat } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('auth_token') ? true : false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  console.log('Is authenticated:', isAuthenticated)

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand>FakeTinder <FontAwesomeIcon icon={faHeartbeat} /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <>

                  <Nav.Link as="button" onClick={handleLogout}><FontAwesomeIcon icon={faSignOut} /> Logout</Nav.Link>
                </>
              ) : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/user/:userEmail" element={<MainPage />} />
          <Route path="*" element={
            <div className="NotFound">
              <p>404: This is not the webpage you are looking for</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
