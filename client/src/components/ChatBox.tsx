import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Function to scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Invoke scrollToBottom whenever messages update
    useEffect(scrollToBottom, [messages]);

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
    }, [currentUserEmail, selectedUser.id]);

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
        <div className="card" style={{ maxWidth: '400px', overflow: 'hidden' }}>
            <div className="card-header">Chat with {selectedUser.name}</div>
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
                        placeholder="Type a message..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        style={{ marginRight: '5px' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') sendMessage();
                        }}
                    />
                    <button className="btn btn-primary" type="button" onClick={sendMessage}>
                        Send <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
