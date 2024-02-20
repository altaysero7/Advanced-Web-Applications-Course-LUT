import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tab, Nav, Container, Row, Col } from 'react-bootstrap';
import UpdateUserInfo from './UpdateUserInfo';
import AllProfiles from './AllProfiles';
import UserChats from './UserChats';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmileBeam } from '@fortawesome/free-solid-svg-icons';

const authToken = localStorage.getItem('auth_token');

function MainPage() {
    const { userEmail } = useParams();
    const [activeKey, setActiveKey] = useState('profiles');
    const [userName, setuserName] = useState('');


    const renderActiveTabContent = () => {
        switch (activeKey) {
            case 'profiles':
                return <AllProfiles currentUserEmail={userEmail} />;
            case 'updateForm':
                return <UpdateUserInfo userEmail={userEmail} />;
            case 'chats':
                return <UserChats userEmail={userEmail} />;
        }
    };


    useEffect(() => {
        fetch(`/api/user/info/${userEmail}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        })
            .then(response => {
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
            .catch(error => console.error('Error fetching user name:', error));
    }, [userEmail]);


    return (
        <Container className="mt-5">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h2 className="mb-3" style={{ paddingBottom: '10px' }}>
                    Welcome to Main Page{userName && <><span style={{ color: '#007bff' }}> {userName}</span></>}
                    <FontAwesomeIcon icon={faSmileBeam} className="ms-2" color="#f0ad4e" />
                </h2>
            </motion.div>
            <Tab.Container activeKey={activeKey} onSelect={(key) => setActiveKey(key as string)}>
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="profiles">Match with others</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="updateForm">Edit your information</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="chats">List your chats</Nav.Link>
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
