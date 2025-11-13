import React, { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setInitialized } from '@/store/userSlice';
import { getRouteConfig, verifyRouteAccess } from '@/router/route.utils';

// AuthContext
const AuthContext = createContext(null);

// useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContext.Provider');
  }
  return context;
};

const Root = () => {
  const [authInitialized, setAuthInitialized] = useState(false);
  const dispatch = useDispatch();
  const { user, isInitialized } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!window.ApperSDK) {
          console.warn('ApperSDK not available');
          setAuthInitialized(true);
          dispatch(setInitialized(true));
          return;
        }

        const { ApperUI } = window.ApperSDK;
        
        await ApperUI.initialize({
          onSuccess: (userData) => {
            dispatch(setUser(userData));
            dispatch(setInitialized(true));
            setAuthInitialized(true);
            
            // Handle post-authentication navigation
            handleNavigation();
          },
          onError: (error) => {
            console.error('Authentication error:', error);
            dispatch(clearUser());
            dispatch(setInitialized(true));
            setAuthInitialized(true);
          }
        });
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        dispatch(setInitialized(true));
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Handle post-authentication navigation
  const handleNavigation = () => {
    const urlParams = new URLSearchParams(location.search);
    const redirectPath = urlParams.get("redirect");
    const authPages = ["/login", "/signup", "/callback"];
    const isOnAuthPage = authPages.some(page => location.pathname.includes(page));
    
    if (redirectPath) {
      navigate(redirectPath);
    } else if (isOnAuthPage) {
      navigate("/");
    }
  };

  // Route guard
  useEffect(() => {
    if (!isInitialized) return;

    const config = getRouteConfig(location.pathname);
    if (!config?.allow) return;

    const accessCheck = verifyRouteAccess(config, user);
    
    if (!accessCheck.allowed && accessCheck.redirectTo) {
      const redirectUrl = accessCheck.excludeRedirectQuery 
        ? accessCheck.redirectTo 
        : `${accessCheck.redirectTo}?redirect=${encodeURIComponent(location.pathname + location.search)}`;
      
      navigate(redirectUrl);
    }
  }, [isInitialized, user, location.pathname, location.search, navigate]);

  // Logout function
  const logout = async () => {
    try {
      if (window.ApperSDK?.ApperUI) {
        await window.ApperSDK.ApperUI.logout();
      }
      dispatch(clearUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(clearUser());
      navigate('/login');
    }
  };

  // Show loading spinner until auth is initialized
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const authContextValue = {
    user,
    isAuthenticated: !!user,
    isInitialized,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export default Root;