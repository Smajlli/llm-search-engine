'use client'

import '@/app/globals.css'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import EditAvatar from '@/components/EditAvatar';
import Image from 'next/image';


function Profile({params}) {
    const [profile, setProfile] = useState();
    const [chatHistory, setChatHistory] = useState([]);
    const [editAvatar, setEditAvatar] = useState(false);

    useEffect(() => {
        async function getProfile() {
            const { data } = await supabase.from('profiles').select('*').eq('id', params.profileId)
            setProfile(data);
        }
        async function getChatHistory() {
            const {data} = await supabase.from('chat_history').select('message').eq('user_id', params.profileId);
            setChatHistory(data);
        }
        getProfile();
        getChatHistory();
    }, [])

    const handleAvatar = () => {
        setEditAvatar(!editAvatar);
    }

    if(!profile || profile.length === 0) {
        return null
    } else {
        return <div className='flex flex-col items-center justify-center my-8'>
            <div onClick={handleAvatar} className='cursor-pointer'>
                {profile[0].profile_image.length === 0 ? <div className='w-32 h-32 border-2 border-solid rounded-full flex justify-center items-center text-3xl mb-4'> + </div> : <Image src={profile[0].profile_image} width={150} height={150} /> }
            </div>
            {editAvatar ? <EditAvatar profile={profile[0]}/> : null}
            <div className='text-3xl font-bold'>
                {profile[0].full_name}
            </div>
            <div className='text-xl mb-12'>Username: {profile[0].username}</div>
            <div className='text-xl font-bold'>Chat History</div>
            {chatHistory ? <div>
                {chatHistory.slice(0, 6).map(c => <div className='p-2 border-solid border border-teal-200 my-6 rounded-xl hover:border-orange-400 hover:-translate-y-2 duration-200 hover:cursor-pointer hover:shadow-lg'> {c.message} </div>)}
            </div> : null}
        </div>
    }
}

export default Profile;