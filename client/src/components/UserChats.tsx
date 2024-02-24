// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024
// Referencing: https://www.framer.com/motion/

import React, { useEffect, useState } from 'react';
import ChatBox from './ChatBox';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartBroken, faComments, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import UnauthorizedErrorPage from './UnAuthorizedErrorPage';
import { useTranslation } from 'react-i18next';

interface UserChatsProps {
    userEmail?: string;
}

interface UserNameMap {
    [userId: string]: string;
}

const UserChats: React.FC<UserChatsProps> = ({ userEmail }) => {
    const [matches, setMatches] = useState<string[]>([]);
    const [selectedChat, setSelectedChat] = useState<string>("");
    const [userNames, setUserNames] = useState<UserNameMap>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const { t } = useTranslation();

    // Fetching the user's interactions
    useEffect(() => {
        if (userEmail) {
            setIsLoading(true);
            fetchWithAuth(`/api/user/interactions/${userEmail}`)
                .then(response => {
                    if (!response) throw new Error('FETCH_ERROR');
                    if (response.ok) {
                        return response.json();
                    } else {
                        return Promise.reject(response.text());
                    }
                })
                .then(data => {
                    setMatches(data.matched);
                    setIsLoading(false);
                    data.matched.forEach((userId: string) => getName(userId));
                })
                .catch(error => {
                    setIsLoading(false);
                    const errorMessage = error?.message ?? '';
                    if (['UNAUTHORIZED', 'AUTH_EXPIRED'].some(e => errorMessage.includes(e))) {
                        setIsAuthenticated(false);
                    } else {
                        console.error('Error fetching interactions:', error);
                    }
                });
        }
    }, [userEmail]);

    // Fetching the user's name
    const getName = (userId: string) => {
        if (!userNames[userId]) {
            fetchWithAuth(`/api/user/info/id/${userId}`)
                .then(response => {
                    if (!response) throw new Error('FETCH_ERROR');
                    return response.json();
                })
                .then(userInfo => {
                    setUserNames(prev => ({ ...prev, [userId]: userInfo.name }));
                })
                .catch(error => {
                    const errorMessage = error?.message ?? '';
                    if (['UNAUTHORIZED', 'AUTH_EXPIRED'].some(e => errorMessage.includes(e))) {
                        setIsAuthenticated(false);
                    } else {
                        console.error('Error fetching matched user info:', error);
                    }
                });
        }
    };

    // Variants for the list and list items to amek them cooler
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

    if (!isAuthenticated) {
        return <UnauthorizedErrorPage />;
    }

    return (
        <div className="d-flex" style={{ marginTop: '20px' }}>
            <div className="flex-grow-1">
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
                        <Spinner animation="border" role="status" style={{ marginTop: '10%' }}>
                            <span className="visually-hidden">{t('Loading...')}</span>
                        </Spinner>
                    </div>
                ) : matches.length > 0 ? (
                    <motion.ul className="list-group" variants={listVariants} initial="hidden" animate="visible" style={{ marginRight: '30px' }}>
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
                        <h4>{t('No Chats Available Yet')}</h4>
                        <p>{t('Try harder to get someone like you or be brave and like someone. No pain, no gain.')}</p>
                    </motion.div>
                )}
            </div>
            <div className="flex-grow-3">
                {selectedChat ? (
                    <ChatBox currentUserEmail={userEmail} selectedUser={{ id: selectedChat, name: userNames[selectedChat] }} />
                ) : matches.length > 0 && !isLoading ? (
                    <motion.div className="d-flex align-items-center justify-content-center" style={{ height: '100%' }} variants={emptyStateVariants} initial="hidden" animate="visible">
                        <div className="text-center" style={{ marginLeft: '30px' }}>
                            <FontAwesomeIcon icon={faComments} size="4x" className="text-muted mb-3" />
                            <p><strong>{t('Select a chat to start messaging')}</strong></p>
                        </div>
                    </motion.div>
                ) : null}
            </div>
        </div>
    );
}

export default UserChats;
