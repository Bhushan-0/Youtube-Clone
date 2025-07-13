import { useDispatch, useSelector } from 'react-redux';
import { decodeToken } from '../utils/decodeJwt.js';
import './App.css'
import AppRoutes from './routes/index.jsx';
import { useEffect } from 'react';
import { logout } from './store/slices/authSlice.js';

function App() {

  const { token } = useSelector(state => state?.auth?.user);
  
  // Calculate current epoch time
  const epochTime = Math.floor(Date.now() / 1000);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      try {
        // Decode token
        const decodedToken = decodeToken(token);

        // If token expired then dispatch the logout slice and log out the user
        if (decodedToken.exp < epochTime) {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }
    }
  }, []);

  return <AppRoutes />
}

export default App;