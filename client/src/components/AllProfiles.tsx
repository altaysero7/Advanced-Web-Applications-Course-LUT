// Referencing: https://framerbook.com/animation/example-animations/ && https://www.geeksforgeeks.org/how-to-create-tinder-card-swipe-gesture-using-react-and-framer-motion/

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import '../styles/allProfiles.css';
const authToken = localStorage.getItem('auth_token');

interface Profile {
    userId: string;
    email: string;
    name: string;
    surname: string;
    age: string;
    favoriteFood: string;
    favoriteColor: string;
    favoriteMovieGenre: string;
}

interface ProfileStatus {
    [userId: string]: 'liked' | 'disliked';
}

function AllProfiles({ currentUserEmail }: { currentUserEmail: string | undefined }) {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [status, setStatus] = useState<ProfileStatus>({});
    const [error, setError] = useState<string>('');

    useEffect(() => {
        fetch('/api/allProfiles', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    console.log('All profiles:', data);
                    setProfiles(data.filter((profile: Profile) => profile.email !== currentUserEmail)); // Filter out the current user's profile
                }
            })
            .catch(error => setError('Error fetching profiles: ' + error.message));
    }, [currentUserEmail]);

    useEffect(() => {
        if (currentUserEmail) {
            fetch(`/api/user/interactions/${currentUserEmail}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            })
            .then(response => response.json())
            .then(data => {
                const updatedStatus: ProfileStatus = {};
                (data.liked as string[]).forEach(userId => { updatedStatus[userId] = 'liked'; });
                (data.disliked as string[]).forEach(userId => { updatedStatus[userId] = 'disliked'; });
                setStatus(updatedStatus);
            })
            .catch(error => setError('Error fetching interactions: ' + error.message));
        }
    }, [currentUserEmail]);

    const handleSwipe = (direction: string, interactedUserId: string) => {
        console.log('Swiped', direction, interactedUserId);
        setStatus(prev => ({ ...prev, [interactedUserId]: direction === 'like' ? 'liked' : 'disliked' }));

        const data = direction === 'like' ? { liked: [interactedUserId] } : { disliked: [interactedUserId] };

        fetch('/api/user/interactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                email: currentUserEmail,
                ...data
            }),
        })
            .then(response => response.text())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <h2 className="text-center mb-4">Potential Profiles for You</h2>
            <div className="row">
                {profiles.map((profile, index) => (
                    <div key={index} className="col-md-4 mb-3">
                        <motion.div
                            className="card h-100"
                            drag="x"
                            dragDirectionLock
                            dragConstraints={{ left: 0, right: 0 }}
                            whileDrag={{ scale: 1.1, boxShadow: "0px 15px 30px rgba(0,0,0,0.2)", rotate: 0 }}
                            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                            dragElastic={0.2}
                            onDragEnd={(event, info) => {
                                if (info.offset.x > 250) {
                                    handleSwipe('like', profile.userId);
                                } else if (info.offset.x < -250) {
                                    handleSwipe('dislike', profile.userId);
                                }
                            }}
                        >
                            <div className="card-body">
                                <h5 className="card-title">{profile.name} {profile.surname}</h5>
                                <p className="card-text">
                                    Age: {profile.age}<br />
                                    Favorite Food: {profile.favoriteFood}<br />
                                    Favorite Color: {profile.favoriteColor}<br />
                                    Favorite Movie Genre: {profile.favoriteMovieGenre}
                                </p>
                                <div className="reaction-icons">
                                    {status[profile.userId] === 'liked' && <FontAwesomeIcon icon={faHeart} color="green" />}
                                    {status[profile.userId] === 'disliked' && <FontAwesomeIcon icon={faHeartBroken} color="red" />}
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-danger" onClick={() => handleSwipe('dislike', profile.userId)}>Dislike</button>
                                <button className="btn btn-success me-2" onClick={() => handleSwipe('like', profile.userId)}>Like</button>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
        </div>
    );
}

export default AllProfiles;
