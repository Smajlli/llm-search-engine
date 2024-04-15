'use client'

import '@/app/globals.css'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabase';

function Profile({params}) {
    const [profile, setProfile] = useState();
    const [chatHistory, setChatHistory] = useState([]);

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

    if(!profile || profile.length === 0) {
        return null
    } else {
        return <div className='flex flex-col items-center justify-center my-8'>
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