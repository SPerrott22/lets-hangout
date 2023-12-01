import { Route, useLocation, Navigate } from 'react-router-dom';
import useToken from '../src/useToken';

export default function RequireAuth({ children }) {
    const { token, setToken } = useToken();
    let location = useLocation();
  
    if (!token) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    return children;
}