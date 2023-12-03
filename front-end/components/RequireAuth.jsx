import { Route, useLocation, Navigate } from 'react-router-dom';
import useToken from '../src/useToken';

export default function RequireAuth({ children }) {
    const { setToken, token_state } = useToken();
    let location = useLocation();
  
    if (!token_state) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
}