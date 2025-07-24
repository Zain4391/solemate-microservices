// src/pages/Profile.jsx
import React from 'react';
import { useLoaderData } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import StatsCards from '../components/StatsCard';
import RecentOrders from '../components/RecentOrders';

const Profile = () => {
    const { user, stats, recentOrders } = useLoaderData();

    return (
        <div className="min-h-screen bg-stone-50 py-4 sm:py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProfileHeader user={user} />
                <StatsCards stats={stats} />
                <RecentOrders orders={recentOrders} />
            </div>
        </div>
    );
};

export default Profile;