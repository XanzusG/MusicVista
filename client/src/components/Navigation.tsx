import { Link, useLocation } from 'react-router-dom';
import { Search, Music, User, LogOut, Settings, Heart, TrendingUp, BookOpen, Brain, Home, Compass } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function Navigation() {
  const location = useLocation();
  // const [searchQuery, setSearchQuery] = useState('');
  // const [showUserMenu, setShowUserMenu] = useState(false);
  // const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Close user menu when clicking outside
  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
  //       setShowUserMenu(false);
  //     }
  //   }
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, []);



  return (
    <>
      <nav className="sticky top-0 z-50 bg-surface border-b border-neutral-200 transition-shadow">
        <div className="container mx-auto px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Music className="w-10 h-10 text-primary-500" />
            <span className="text-xl font-semibold text-neutral-900">MusicVista</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link
              to="/"
              className={`text-body font-medium transition-all flex items-center gap-1 ${
                isActive('/')
                  ? 'text-neutral-900 font-bold'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/explore"
              className={`text-body font-medium transition-all flex items-center gap-1 ${
                isActive('/explore')
                  ? 'text-neutral-900 font-bold'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore
            </Link>
            <Link
              to="/insights"
              className={`text-body font-medium transition-all flex items-center gap-1 ${
                isActive('/insights')
                  ? 'text-neutral-900 font-bold'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              <Brain className="w-4 h-4" />
              Insights
            </Link>
            {/* {isAuthenticated && (
              <Link
                to="/my-likes"
                className={`text-body font-medium transition-all flex items-center gap-1 ${
                  isActive('/my-likes')
                    ? 'text-neutral-900 font-bold'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <Heart className="w-4 h-4" />
                My Likes
              </Link>
            )} */}
            {/* {isAuthenticated && (
              <Link
                to="/like-stats"
                className={`text-body font-medium transition-all flex items-center gap-1 ${
                  isActive('/like-stats')
                    ? 'text-neutral-900 font-bold'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                收藏统计
              </Link>
            )} */}
          </div>

          {/* Search Bar */}
          {/* <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search artists, albums, or tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 h-12 pl-12 pr-4 rounded-md border border-neutral-200 bg-surface text-body text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
          </div> */}

          {/* User Actions */}
          {/* <div className="flex items-center gap-4">
            {isAuthenticated ? (
              
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-neutral-100 transition-colors"
                >
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=6366F1&color=fff`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-body font-medium text-neutral-900 hidden md:block">
                    {user?.name}
                  </span>
                </button>


                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-neutral-200 rounded-lg shadow-lg py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-neutral-200">
                      <p className="text-body font-medium text-neutral-900">{user?.name}</p>
                      <p className="text-small text-neutral-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-body text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/my-likes"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-body text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      My Collection
                    </Link>
                    <Link
                      to="/like-stats"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-body text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Collection Stats
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-body text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-2 border-neutral-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-body text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-body font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-primary-500 text-surface font-semibold rounded-md hover:bg-primary-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}


            <button className="md:hidden p-2 text-neutral-700 hover:text-neutral-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div> */}
        </div>
      </nav>
    </>
  );
}