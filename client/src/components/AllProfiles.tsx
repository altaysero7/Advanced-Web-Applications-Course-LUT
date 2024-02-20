// Referencing: https://framerbook.com/animation/example-animations/ && https://www.geeksforgeeks.org/how-to-create-tinder-card-swipe-gesture-using-react-and-framer-motion/

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleAlt, faArrowLeft, faArrowRight, faBirthdayCake, faFilm, faHeart, faHeartBroken, faPalette } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';

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
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        setIsLoading(true);
        fetch('/api/allProfiles', {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setProfiles(data.filter((profile: Profile) => profile.email !== currentUserEmail)); // Filter out the current user's profile
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching profiles: ' + error.message)
                setIsLoading(false);
            });
    }, [currentUserEmail]);

    useEffect(() => {
        if (currentUserEmail) {
            fetch(`/api/user/interactions/${currentUserEmail}`, {
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
                .then(data => {
                    if (typeof data === 'string') {
                        console.error('No interactions for this user:', data);
                        return;
                    }
                    console.log('Interactions from AllProfiles:', data);
                    const updatedStatus: ProfileStatus = {};
                    (data.liked as string[]).forEach(userId => { updatedStatus[userId] = 'liked'; });
                    (data.disliked as string[]).forEach(userId => { updatedStatus[userId] = 'disliked'; });
                    setStatus(updatedStatus);
                })
                .catch(error => console.error('Error fetching interactions: ' + error.message));
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

    // Enhanced card appearance and swipe feedback
    const cardVariants = {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
        whileHover: { scale: 1.05 },
    };

    return (
        <div>
            <div className="row">
                {isLoading ? (
                    <div className="d-flex justify-content-center" style={{ height: '100%' }}>
                        <Spinner animation="border" role="status" style={{ marginTop: '10%' }}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : profiles.length > 0 ? profiles.map((profile, index) => (
                    <div key={index} className="col-md-4 mb-3" style={{ cursor: 'grab' }}>
                        <motion.div
                            className="card h-100 shadow-sm"
                            variants={cardVariants}
                            initial="initial"
                            animate="animate"
                            whileHover="whileHover"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
                            onDragEnd={(event, info) => {
                                if (info.offset.x > 100) {
                                    handleSwipe('like', profile.userId);
                                } else if (info.offset.x < -100) {
                                    handleSwipe('dislike', profile.userId);
                                }
                            }}
                        >
                            <div className="card-body">
                                <h5 className="card-title">{profile.name} {profile.surname}</h5>
                                <hr style={{
                                    height: '2px',
                                    borderWidth: 0,
                                    color: 'gray',
                                    backgroundColor: 'gray',
                                    margin: '10px 0'
                                }} />
                                <ul className="list-unstyled">
                                    <li className="card-text mb-2">
                                        <FontAwesomeIcon icon={faBirthdayCake} className="me-2" />Age: {profile.age}
                                    </li>
                                    <li className="card-text mb-2">
                                        <FontAwesomeIcon icon={faAppleAlt} className="me-2" />Favorite Food: {profile.favoriteFood}
                                    </li>
                                    <li className="card-text mb-2">
                                        <FontAwesomeIcon icon={faPalette} className="me-2" />Favorite Color: {profile.favoriteColor}
                                    </li>
                                    <li className="card-text">
                                        <FontAwesomeIcon icon={faFilm} className="me-2" />Favorite Movie Genre: {profile.favoriteMovieGenre}
                                    </li>
                                </ul>
                                <div className="reaction-icons text-center">
                                    {status[profile.userId] === 'liked' ? (
                                        <FontAwesomeIcon icon={faHeart} size="lg" color="green" />
                                    ) : status[profile.userId] === 'disliked' ? (
                                        <FontAwesomeIcon icon={faHeartBroken} size="lg" color="red" />
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faArrowLeft} size="lg" color="red" className="me-2" />
                                            <FontAwesomeIcon icon={faArrowRight} size="lg" color="green" />
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-between">
                                <button className="btn btn-light btn-sm" onClick={() => handleSwipe('dislike', profile.userId)}>
                                    <FontAwesomeIcon icon={faHeartBroken} color="red" /> Dislike
                                </button>
                                <button className="btn btn-light btn-sm" onClick={() => handleSwipe('like', profile.userId)}>
                                    <FontAwesomeIcon icon={faHeart} color="green" /> Like
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )) : (
                    <div className="text-center w-100">
                        <FontAwesomeIcon icon={faHeartBroken} size="3x" color="grey" />
                        <p>No profiles available.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllProfiles;
