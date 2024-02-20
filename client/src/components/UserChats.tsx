import { useEffect, useState } from 'react';
import ChatBox from './ChatBox';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartBroken, faComments, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';

const authToken = localStorage.getItem('auth_token');

function UserChats({ userEmail }: { userEmail: string | undefined }) {
    const [matches, setMatches] = useState<string[]>([]);
    const [selectedChat, setSelectedChat] = useState<string>("");
    const [userNames, setUserNames] = useState<{ [userId: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userEmail) {
            setIsLoading(true);
            fetch(`/api/user/interactions/${userEmail}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            })
                .then(response => response.ok ? response.json() : Promise.reject(response.text()))
                .then(data => {
                    console.log('Interactions from UserChat:', data);
                    setMatches(data.matched);
                    setIsLoading(false);
                    data.matched.forEach((userId: string) => getName(userId));
                })
                .catch(error => {
                    console.error('Error fetching interactions:', error);
                    setIsLoading(false);
                });
        }
    }, [userEmail]);

    const getName = (userId: string) => {
        if (!userNames[userId]) {
            fetch(`/api/user/info/id/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            })
                .then(response => response.json())
                .then(userInfo => {
                    setUserNames(prev => ({ ...prev, [userId]: userInfo.name }));
                })
                .catch(error => console.error('Error fetching matched user info:', error));
        }
    };

    const listVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { x: -10, opacity: 0 },
        visible: { x: 0, opacity: 1 }
    };

    const emptyStateVariants = {
        hidden: { scale: 0.5, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <div className="d-flex" style={{marginTop: '20px'}}>
            <div className="flex-grow-1">
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                        <Spinner animation="border" role="status" style= {{marginTop: '10%'}}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : matches.length > 0 ? (
                    <motion.ul className="list-group" variants={listVariants} initial="hidden" animate="visible"  style={{marginRight: '30px'}}>
                        {matches.map(matchedUser => (
                            <motion.li
                                key={matchedUser}
                                className={`list-group-item list-group-item-action ${selectedChat === matchedUser ? 'active' : ''}`}
                                variants={itemVariants}
                                whileHover={{ scale: 1.03, cursor: 'pointer' }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelectedChat(matchedUser)}
                            >
                                {userNames[matchedUser] || <FontAwesomeIcon icon={faSpinner} spin />}
                            </motion.li>
                        ))}
                    </motion.ul>
                ) : (
                    <motion.div className="text-center p-5" variants={emptyStateVariants} initial="hidden" animate="visible">
                        <FontAwesomeIcon icon={faHeartBroken} size="3x" className="text-primary mb-3" />
                        <h4>No Chats Available Yet</h4>
                        <p>Try harder to get someone like you or be brave and like someone. No pain, no gain.</p>
                    </motion.div>
                )}
            </div>
            <div className="flex-grow-3">
                {selectedChat ? (
                    <ChatBox currentUserEmail={userEmail} selectedUser={{ id: selectedChat, name: userNames[selectedChat] }} />
                ) : matches.length > 0 && !isLoading ? (
                    <motion.div className="d-flex align-items-center justify-content-center" style={{ height: '100%' }} variants={emptyStateVariants} initial="hidden" animate="visible">
                        <div className="text-center" style={{marginLeft: '30px'}}>
                            <FontAwesomeIcon icon={faComments} size="4x" className="text-muted mb-3" />
                            <p><strong>Select a chat to start messaging</strong></p>
                        </div>
                    </motion.div>
                ) : null}
            </div>
        </div>
    );
}

export default UserChats;
