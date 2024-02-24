// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024
// Referencing: https://getbootstrap.com/docs/5.0/components/navs-tabs/

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tab, Nav, Container, Row, Col } from 'react-bootstrap';
import UpdateUserInfo from './UpdateUserInfo';
import AllProfiles from './AllProfiles';
import UserChats from './UserChats';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmileBeam } from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import UnauthorizedErrorPage from './UnAuthorizedErrorPage';
import { useTranslation } from 'react-i18next';

const MainPage: React.FC = () => {
    const { userEmail } = useParams();
    const [activeKey, setActiveKey] = useState<string>('profiles');
    const [userName, setuserName] = useState<string>('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const { t } = useTranslation();

    // Rendering the active tab content
    const renderActiveTabContent = () => {
        switch (activeKey) {
            case 'profiles':
                return <AllProfiles currentUserEmail={userEmail} />;
            case 'updateForm':
                return <UpdateUserInfo userEmail={userEmail} onUserInfoUpdated={handleUserInfoUpdated} />;
            case 'chats':
                return <UserChats userEmail={userEmail} />;
        }
    };

    // Fetching the user's name
    useEffect(() => {
        fetchWithAuth(`/api/user/info/${userEmail}`)
            .then(response => {
                if (!response) throw new Error('FETCH_ERROR');
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(userInfo => {
                if (typeof userInfo === 'string') {
                    console.error('No user found:', userInfo);
                    return;
                }
                setuserName(userInfo.name);
            })
            .catch(error => {
                const errorMessage = error?.message ?? '';
                if (['UNAUTHORIZED', 'AUTH_EXPIRED'].some(e => errorMessage.includes(e))) {
                    setIsAuthenticated(false);
                } else {
                    console.error('Error fetching user name:', error);
                }
            });
    }, [userEmail]);

    // Handling the updated user information from the UpdateUserInfo component
    const handleUserInfoUpdated = (updatedName: string) => {
        setuserName(updatedName);
    };

    if (!isAuthenticated) {
        return <UnauthorizedErrorPage />;
    }

    return (
        <Container className="mt-5">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h2 className="mb-3" style={{ paddingBottom: '10px' }}>
                    {t('Welcome to Main Page')}{userName && <><span style={{ color: '#007bff' }}> {userName}</span></>}
                    <FontAwesomeIcon icon={faSmileBeam} className="ms-2" color="#f0ad4e" />
                </h2>
            </motion.div>
            <Tab.Container activeKey={activeKey} onSelect={(key) => setActiveKey(key as string)}>
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="profiles">{t('Match with others')}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="updateForm">{t('Edit your information')}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="chats">{t('List your chats')}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            {renderActiveTabContent()}
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    );
}

export default MainPage;
