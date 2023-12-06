import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        const userEmail = localStorage.getItem('email');
        return { token: tokenString, userId, userEmail };
    }

    const [tokenInfo, setTokenInfo] = useState(getToken());

    const saveToken = (userToken, userId, userEmail) => {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user_id', userId);
        localStorage.setItem('email', userEmail)
        setTokenInfo({ token: userToken, userId: userId, userEmail: userEmail });
    };

    const deleteToken = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('email');
        setTokenInfo({ token: null, userId: null, userEmail: null });
    };


    return {
        setToken: saveToken,
        deleteToken,
        tokenInfo

    };
}