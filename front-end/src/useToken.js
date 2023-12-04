import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        return { token: tokenString, userId };
    }

    const [tokenInfo, setTokenInfo] = useState(getToken());

    const saveToken = (userToken, userId) => {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user_id', userId);
        setTokenInfo({ token: userToken, userId: userId });
    };

    const deleteToken = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        setTokenInfo({ token: null, userId: null });
    };


    return {
        setToken: saveToken,
        deleteToken,
        tokenInfo

    };
}