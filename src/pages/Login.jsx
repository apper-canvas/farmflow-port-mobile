import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '@/layouts/Root';
import ApperIcon from '@/components/ApperIcon';

const Login = () => {
  const navigate = useNavigate();
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if (user) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get("redirect");
      navigate(redirectPath || "/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isInitialized && !user && window.ApperSDK?.ApperUI) {
      const { ApperUI } = window.ApperSDK;
      ApperUI.showLogin("#authentication");
    }
  }, [isInitialized, user]);

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="TreePine" size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to FarmFlow</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your agricultural operations</p>
        </div>

        {/* Authentication Container */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div id="authentication"></div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;