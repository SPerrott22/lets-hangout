import React, { createContext, useState } from 'react';
import useToken from '../src/useToken';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    // const [tokenInfo, setTokenInfo] = useState({ 
    //     token: localStorage.getItem('token'), 
    //     userId: localStorage.getItem('user_id') 
    // });

    // const setToken = (token, userId) => {
    //     localStorage.setItem('token', token);
    //     localStorage.setItem('user_id', userId);
    //     setTokenInfo({ token, userId });
    // };

    // const deleteToken = () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('user_id');
    //     setTokenInfo({ token: null, userId: null });
    // };

    const { tokenInfo, setToken, deleteToken } = useToken();

    return (
        <TokenContext.Provider value={{ tokenInfo, setToken, deleteToken }}>
            {children}
        </TokenContext.Provider>
    );

    // return (
    //     <TokenContext.Provider value={{ tokenInfo, setToken, deleteToken }}>
    //         {children}
    //     </TokenContext.Provider>
    // );
};
