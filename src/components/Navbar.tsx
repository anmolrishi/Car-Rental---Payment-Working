import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, UserCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">JamRock</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <UserCircle className="h-5 w-5" />
                  <span>{user.email}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
