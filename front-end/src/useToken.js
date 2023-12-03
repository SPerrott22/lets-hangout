import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        return tokenString;
    }

    const [token_state, setTokenState] = useState(getToken());

    const saveToken = userToken => {
        localStorage.setItem('token', userToken.token);
        setTokenState(userToken.token);
    };

    return {
        setToken: saveToken,
        token_state
    };
}