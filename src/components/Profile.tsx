import React from 'react'
import { useSpotifyService } from '../services/SpotifyService';

export const Profile = () => {

    const { getUserData } = useSpotifyService();

    return (
        <div>Profile
            <button onClick={getUserData}>Get User Data</button>
        </div>

    )
}
