// src/components/ProfileHeader.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Settings, LogOut } from 'lucide-react';
import LogoutModal from './LogoutModal';

const ProfileHeader = ({ user }) => {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8"
            >
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
                    >
                        <span className="text-white text-xl sm:text-2xl font-bold">
                            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                    </motion.div>
                    
                    {/* User Info */}
                    <div className="flex-1 text-center sm:text-left">
                        <motion.h1 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl sm:text-2xl font-bold text-stone-800 mb-2 sm:mb-1"
                        >
                            {user?.name || 'User'}
                        </motion.h1>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-1 sm:space-y-2"
                        >
                            <div className="flex items-center justify-center sm:justify-start text-stone-600 text-sm sm:text-base">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                <span className="break-all">{user?.email}</span>
                            </div>
                            
                            <div className="flex items-center justify-center sm:justify-start text-stone-600 text-sm sm:text-base">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                <span>Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                        
                        <button 
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex items-center px-3 py-2 sm:px-4 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm"
                        >
                            <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </motion.div>
            
            <LogoutModal 
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
            />
        </>
    );
};

export default ProfileHeader;