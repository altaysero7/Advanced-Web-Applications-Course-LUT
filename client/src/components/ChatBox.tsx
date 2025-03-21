// Referencing: all the source codes, lecture slides and videos from the Advanced Web Applications course implemented by Erno Vanhala at LUT University in 2023-2024
// Referencing: utilized the Bootstrap library from https://getbootstrap.com/

import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import UnauthorizedErrorPage from './UnAuthorizedErrorPage';
import { useTranslation } from 'react-i18next';

const socket: Socket = io("http://localhost:4000"); // Connecting to the chat server

interface ChatHistory {
    from: string | undefined;
    to: string | undefined;
    data: string;
    timestamp?: string;
}

interface ChatBoxProps {
    currentUserEmail: string | undefined;
    selectedUser: {
        id: string;
        name: string;
    }
}

const ChatBox: React.FC<ChatBoxProps> = ({ currentUserEmail, selectedUser }) => {
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messages, setMessages] = useState<ChatHistory[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string>("")
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
    const { t } = useTranslation();

    // Chat is scrolling to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    // Fetching current user's ID
    useEffect(() => {
        fetchWithAuth(`/api/user/account/${currentUserEmail}`)
            .then(response => {
                if (!response) throw new Error('FETCH_ERROR');
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(user => {
                if (typeof user === 'string') {
                    console.error('No user found:', user);
                    return;
                }
                setCurrentUserId(user.id);
            })
            .catch(error => {
                const errorMessage = error?.message ?? '';
                if (['UNAUTHORIZED', 'AUTH_EXPIRED'].some(e => errorMessage.includes(e))) {
                    setIsAuthenticated(false);
                } else {
                    console.error('Error fetching user ID:', error);
                }
            });
    }, [currentUserEmail]);

    // Fetching chat history
    useEffect(() => {
        fetchWithAuth(`/api/chat/history/${currentUserId}/${selectedUser.id}`)
            .then(response => {
                if (!response) throw new Error('FETCH_ERROR');
                if (response.ok) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(chatHistory => {
                if (typeof chatHistory === 'string') {
                    console.error('No chat history:', chatHistory);
                    return;
                }
                setMessages(chatHistory.map((chat: ChatHistory) => ({
                    from: chat.from,
                    to: chat.to,
                    data: chat.data,
                    timestamp: chat.timestamp,
                })));
            })
            .catch(error => {
                const errorMessage = error?.message ?? '';
                if (['UNAUTHORIZED', 'AUTH_EXPIRED'].some(e => errorMessage.includes(e))) {
                    setIsAuthenticated(false);
                } else {
                    console.error('Error fetching chat history:', error);
                }
            });
    }, [currentUserId, selectedUser.id]);

    // Listening for new messages
    useEffect(() => {
        socket.on("chat message", (chat: ChatHistory) => {
            if ((chat.from === selectedUser.id && chat.to === currentUserId) ||
                (chat.from === currentUserId && chat.to === selectedUser.id)) {
                setMessages((prevMessages) => [...prevMessages, { ...chat, timestamp: new Date().toISOString() }]);
            }
        });
        return () => {
            socket.off("chat message");
        };
    }, [currentUserId, selectedUser.id]);

    // Sending a message
    const sendMessage = (): void => {
        if (!currentMessage.trim()) return; // Preventing sending empty messages
        const messageData: ChatHistory = {
            from: currentUserId,
            to: selectedUser.id,
            data: currentMessage,
            timestamp: new Date().toISOString(),
        };
        socket.emit("chat message", messageData);
        setCurrentMessage("");
    };

    if (!isAuthenticated) {
        return <UnauthorizedErrorPage />;
    }

    return (
        <div className="card" style={{ maxWidth: '400px', overflow: 'hidden' }}>
            <div className="card-header">{t('Chat with')} {selectedUser.name}</div>
            <div className="card-body" style={{ height: '400px', overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        textAlign: msg.from === currentUserId ? 'right' : 'left',
                        marginBottom: '10px',
                    }}>
                        <span style={{
                            display: 'inline-block',
                            backgroundColor: msg.from === currentUserId ? '#007bff' : '#6c757d',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '5px 10px',
                            maxWidth: '70%',
                            wordBreak: 'break-word',
                            textAlign: 'left'
                        }}>
                            {msg.data}
                        </span>
                        <div style={{ fontSize: '0.75rem', marginTop: '5px' }}>
                            {new Date(msg.timestamp || '').toLocaleTimeString()}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="card-footer">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={t('Type a message...')}
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        maxLength={200}
                        style={{ marginRight: '5px' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') sendMessage();
                        }}
                    />
                    <button className="btn btn-primary" type="button" onClick={sendMessage}>
                        {t('Send')} <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
                <small style={{ display: 'block', textAlign: 'left', marginLeft: '5px', marginTop: '5px' }}>
                    {currentMessage.length}/200
                </small>
            </div>
        </div>
    );
};

export default ChatBox;
