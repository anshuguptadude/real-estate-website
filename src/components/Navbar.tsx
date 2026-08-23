import React, { useState, useRef, useEffect } from 'react';
import { ActiveScreen, UserProfile } from '../types';
import { Landmark, Menu, X, Building2, User, LogOut, LayoutDashboard, ChevronDown, PlusCircle } from 'lucide-react';

interface NavbarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onOpenLogin: () => void;
  onOpenPostProperty: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  savedCount?: number;
  onOpenSaved?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeScreen,
  onNavigate,
  onOpenLogin,
  onOpenPostProperty,
  user,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks: { label: string; screen: ActiveScreen }[] = [
    { label: 'Buy', screen: 'properties' },
    { label: 'Sell/Rent', screen: 'sell-rent' },
    { label: 'Projects', screen: 'projects' },
    { label: 'About', screen: 'about' },
    { label: 'Contact', screen: 'contact' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0F382C] text-white shadow-md border-b border-[#164E3D]/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT: Logo Icon + ONLY "Royal Agra Estate" */}
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E4D5B7] via-[#C5A869] to-[#8C6D32] p-[1.5px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#0F382C] rounded-[6.5px] flex items-center justify-center">
                <Landmark className="w-5 h-5 text-[#E4D5B7] group-hover:scale-105 transition-transform" />
              </div>
            </div>
            <span className="text-xl sm:text-2xl tracking-wide font-brand-title font-semibold text-white group-hover:text-[#E4D5B7] transition-colors leading-none">
              Royal Agra Estate
            </span>
          </button>

          {/* MIDDLE: Standard navigation links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-3">
            {navLinks.map((link) => {
              const isActive = activeScreen === link.screen;
              return (
                <button
                  key={link.screen}
                  id={`nav-link-${link.screen}`}
                  onClick={() => onNavigate(link.screen)}
                  className="relative px-3.5 py-2.5 text-sm xl:text-base font-medium tracking-normal transition-colors group focus:outline-none"
                >
                  <span className={isActive ? 'text-white font-bold' : 'text-white/80 group-hover:text-white'}>
                    {link.label}
                  </span>
                  
                  {/* Underline ONLY the active nav tab */}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-white rounded-full shadow-xs" />
                  )}
                </button>
              );
            })}

            {/* If logged in, also show direct 'My Dashboard' link in main nav if active */}
            {user && (
              <button
                id="nav-link-dashboard"
                onClick={() => onNavigate('dashboard')}
                className="relative px-3.5 py-2.5 text-sm xl:text-base font-medium tracking-normal transition-colors group focus:outline-none text-[#E4D5B7] hover:text-white"
              >
                <span className={activeScreen === 'dashboard' ? 'text-white font-bold' : 'text-[#E4D5B7] font-semibold'}>
                  Dashboard
                </span>
                {activeScreen === 'dashboard' && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-white rounded-full shadow-xs" />
                )}
              </button>
            )}
          </nav>

          {/* RIGHT: Header Auth & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* LOGGED OUT STATE */}
            {!user ? (
              <button
                id="nav-login-btn"
                onClick={onOpenLogin}
                className="text-sm font-semibold text-white/90 hover:text-white transition-colors hover:underline underline-offset-4 focus:outline-none px-3 py-1.5 rounded-lg hover:bg-[#164E3D]/50"
              >
                Login / Sign Up
              </button>
            ) : (
              /* LOGGED IN STATE: My Dashboard Profile Menu Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  id="user-profile-menu-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 bg-[#0B2B22] hover:bg-[#164E3D] text-white px-3 py-2 rounded-full border border-[#164E3D] transition-all shadow-sm group focus:outline-none"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#C5A869]"
                  />
                  <div className="text-left hidden xl:block pr-1">
                    <span className="block text-xs font-bold text-white line-clamp-1 max-w-[120px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="block text-[10px] text-[#E4D5B7] uppercase font-semibold leading-none">
                      {user.role === 'owner' ? 'Owner' : 'Buyer'}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#E4D5B7] transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 text-gray-800 z-50 animate-fadeIn">
                    
                    {/* User Info Header in Dropdown */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-[#FAF8F5]">
                      <p className="text-xs font-bold text-[#0F382C] line-clamp-1">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E4D5B7] text-[#0F382C]">
                        {user.role === 'owner' ? 'Property Owner' : 'Investor'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        id="dropdown-my-dashboard-btn"
                        onClick={() => {
                          onNavigate('dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-emerald-50 hover:text-[#0F382C] flex items-center gap-2.5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#0F382C]" />
                        <span>My Dashboard</span>
                      </button>

                      <button
                        type="button"
                        id="dropdown-listed-props-btn"
                        onClick={() => {
                          onNavigate('dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0F382C] flex items-center gap-2.5 transition-colors"
                      >
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span>My Listed Properties</span>
                      </button>

                      <button
                        type="button"
                        id="dropdown-profile-settings-btn"
                        onClick={() => {
                          onNavigate('dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-[#0F382C] flex items-center gap-2.5 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        <span>Profile Settings</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-gray-100">
                      <button
                        type="button"
                        id="dropdown-logout-btn"
                        onClick={() => {
                          onLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Logout</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* White pill button reading "POST PROPERTY" */}
            <button
              id="nav-post-property-btn"
              onClick={onOpenPostProperty}
              className="bg-white text-[#0F382C] hover:bg-[#FAF8F5] px-5 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
            >
              POST PROPERTY
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-[#C5A869] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B2B22] border-t border-[#164E3D] px-4 pt-3 pb-6 space-y-2">
          
          {/* User badge in mobile menu if logged in */}
          {user && (
            <div className="p-3 bg-[#0F382C] rounded-xl flex items-center justify-between border border-[#164E3D] mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#C5A869]"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{user.name}</h4>
                  <p className="text-[10px] text-[#E4D5B7] uppercase font-semibold">
                    {user.role === 'owner' ? 'Property Owner' : 'Buyer'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="bg-[#164E3D] text-[#E4D5B7] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                Dashboard
              </button>
            </div>
          )}

          {navLinks.map((link) => {
            const isActive = activeScreen === link.screen;
            return (
              <button
                key={link.screen}
                id={`mobile-nav-${link.screen}`}
                onClick={() => {
                  onNavigate(link.screen);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between ${
                  isActive ? 'bg-[#0F382C] text-white font-bold border-l-4 border-white shadow-xs' : 'text-white/80 hover:bg-[#0F382C]/50 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
              </button>
            );
          })}

          {user && (
            <button
              id="mobile-nav-dashboard"
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium flex items-center justify-between ${
                activeScreen === 'dashboard' ? 'bg-[#0F382C] text-white font-bold border-l-4 border-white shadow-xs' : 'text-[#E4D5B7] hover:bg-[#0F382C]/50'
              }`}
            >
              <span>My Dashboard</span>
              <LayoutDashboard className="w-4 h-4 text-[#E4D5B7]" />
            </button>
          )}

          <div className="pt-4 border-t border-[#164E3D] flex flex-col gap-3">
            {!user ? (
              <button
                id="mobile-login-btn"
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white/90 hover:text-white border border-white/20 rounded-full"
              >
                Login / Sign Up
              </button>
            ) : (
              <button
                id="mobile-logout-btn"
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-rose-300 hover:text-rose-200 border border-rose-500/30 rounded-full flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}

            <button
              id="mobile-post-btn"
              onClick={() => {
                onOpenPostProperty();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-white text-[#0F382C] py-3 rounded-full font-bold text-xs tracking-wider uppercase shadow-md text-center"
            >
              POST PROPERTY
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
