import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
const authToken = localStorage.getItem('auth_token');
const socket: Socket = io("http://localhost:4000");

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
    const [currentUserId, setCurrentUserId] = useState<string | undefined>("");

    // Fetch current user's ID
    useEffect(() => {
        fetch(`/api/user/account/${currentUserEmail}`, {
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
            .then(user => {
                if (typeof user === 'string') {
                    console.error('No user found:', user);
                    return;
                }
                setCurrentUserId(user.id);
            })
    }, [currentUserEmail]);

    // Fetch chat history
    useEffect(() => {
        fetch(`/api/chat/history/${currentUserId}/${selectedUser.id}`, {
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
            .catch(error => console.error('Error fetching chat history:', error));
    }, [currentUserId, selectedUser.id]);

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

    return (
        <div className="card">
            <div className="card-header">
                Chat with {selectedUser.name}
            </div>
            <div className="card-body" style={{ height: '400px', overflowY: 'scroll' }}>
                {messages.sort((a, b) => (a.timestamp && b.timestamp) ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() : 0)
                    .map((chat, index) => (
                        <div key={index} className={`message ${chat.from === currentUserId ? 'text-end' : 'text-start'}`}>
                            <div className={`badge ${chat.from === currentUserId ? 'bg-primary' : 'bg-secondary'}`}>
                                {chat.data}
                            </div>
                            <p className="text-muted small">{new Date(chat.timestamp || '').toLocaleTimeString()}</p>
                        </div>
                    ))}
            </div>
            <div className="card-footer">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Type a message..." value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} />
                    <button className="btn btn-primary" type="button" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatBox;
