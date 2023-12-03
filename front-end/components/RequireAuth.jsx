// import { Route, useLocation, Navigate } from 'react-router-dom';
// import useToken from '../src/useToken';

// export default function RequireAuth({ children }) {
//     const { setToken, token_state } = useToken();
//     let location = useLocation();
  
//     if (!token_state) {
//       return <Navigate to="/login" state={{ from: location }} replace />;
//     }
  
//     return children;
// }

import { useLocation, Navigate } from 'react-router-dom';
import useToken from '../src/useToken';

export default function RequireAuth({ children }) {
    const { tokenInfo } = useToken();
    let location = useLocation();
  
    // Check if tokenInfo has a valid token
    if (!tokenInfo || !tokenInfo.token) {
      // If not authenticated, redirect to login page
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    // If authenticated, render the child components
    return children;
}
