import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const UnauthorizedErrorPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.removeItem('auth_token');
            navigate('/login');
        }, 5000); // Redirecting to login after 5 seconds
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <h1>{t('Oops! You are not authorized anymore.')}</h1>
            <h3>{t('Please login again to continue.')}</h3>
            <p>{t('Redirecting you to the login page in 5 seconds...')}</p>
        </motion.div>
    );
};

export default UnauthorizedErrorPage;
