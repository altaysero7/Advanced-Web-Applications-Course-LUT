// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024
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
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { t, i18n } = useTranslation();

  // Checking if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  }, []);

  // Changing the app language
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Logging out the user and removing the token from local storage
  const handleLogout = (): void => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand style={{ cursor: 'default' }}>FakeTinder <FontAwesomeIcon icon={faHeartbeat} /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated && (
                <Nav.Link as="button" onClick={handleLogout} className="px-2">
                  <FontAwesomeIcon icon={faSignOut} /> {t('Logout')}
                </Nav.Link>
              )}
              <div className="d-flex justify-content-center">
                <div style={{ height: 'auto', borderRight: '2px solid silver',  marginLeft: '5px', marginRight: '5px' }}></div>
                <Nav.Link onClick={() => changeLanguage('en')}>
                  EN
                </Nav.Link>
                <Nav.Link style={{ paddingLeft: '5px' }} onClick={() => changeLanguage('fi')}>
                  FI
                </Nav.Link>
                <Nav.Link style={{ paddingLeft: '5px' }} onClick={() => changeLanguage('cn')}>
                  CN
                </Nav.Link>
                <div style={{ height: 'auto', borderLeft: '2px solid silver', marginLeft: '5px' }}></div>
              </div>
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
              <p>{t('404: This is not the webpage you are looking for')}</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
