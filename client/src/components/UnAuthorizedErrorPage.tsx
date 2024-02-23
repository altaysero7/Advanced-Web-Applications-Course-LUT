import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UnauthorizedErrorPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.removeItem('auth_token');
            navigate('/login');
        }, 7000); // Redirecting to login after 7 seconds
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <h1>Oops! You're not authorized anymore.</h1>
            <h3>Please login again to continue.</h3>
            <p>Redirecting you to the login page in 7 seconds...</p>
        </motion.div>
    );
};

export default UnauthorizedErrorPage;
