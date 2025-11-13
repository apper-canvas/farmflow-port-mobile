import React, { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    if (window.ApperSDK?.ApperUI) {
      const { ApperUI } = window.ApperSDK;
      ApperUI.showSSOVerify("#authentication-callback");
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Completing Authentication</h2>
            <p className="text-gray-600 mt-2">Please wait while we verify your account...</p>
          </div>
          <div id="authentication-callback"></div>
        </div>
      </div>
    </div>
  );
};

export default Callback;