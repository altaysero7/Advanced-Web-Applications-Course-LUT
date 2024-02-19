import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tab, Nav, Container, Row, Col } from 'react-bootstrap';
import UpdateUserInfo from './UpdateUserInfo';
import AllProfiles from './AllProfiles';
import UserChats from './UserChats';
import '../styles/mainPage.css';

function MainPage() {
    const { userEmail } = useParams();
    const [activeKey, setActiveKey] = useState('profiles');

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

    return (
        <Container className="mt-5">
            <h2 className="mb-3">Welcome, {userEmail}</h2>
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
