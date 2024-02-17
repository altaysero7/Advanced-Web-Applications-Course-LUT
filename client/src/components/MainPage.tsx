import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import UpdateUserInfo from './UpdateUserInfo'
import AllProfiles from './AllProfiles';

function MainPage() {
    const { userEmail } = useParams();
    const navigate = useNavigate();
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showOtherProfiles, setShowOtherProfiles] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        navigate('/');
    };

    return (
        <div>
            <h2>Welcome to the main page, {userEmail}!</h2>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Menu
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => showOtherProfiles ? setShowOtherProfiles(false) : setShowOtherProfiles(true)}>Match with others</Dropdown.Item>
                    <Dropdown.Item onClick={() => showUpdateForm ? setShowUpdateForm(false) : setShowUpdateForm(true)}>Edit your information</Dropdown.Item>
                    <Dropdown.Item href="#/chats">List your chats</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            {showOtherProfiles && <AllProfiles currentUserEmail={userEmail} />}
            {showUpdateForm && <UpdateUserInfo userEmail={userEmail} />}
        </div>
    );
}

export default MainPage;
