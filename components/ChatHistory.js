'use client'

import '@/app/globals.css'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Profile from './Profile';


function ChatHistory({profileId}) {
    const [profileHistory, setProfileHistory] = useState();

    useEffect(() => {
        async function getHistory() {
            const {data} = await supabase.from('chat_history').select('message').eq('user_id', profileId)
            setProfileHistory(data)
        }
        getHistory();
    }, [])

    if(!profileHistory || profileHistory.length === 0) {
        return null
    } else {
        return <div className='h-screen w-80 bg-slate-50 p-4'>
            <div className='text-xl font-bold mb-10'>Chat History</div>
            {profileHistory.map(history => <div className='mb-2 p-2 text-sm hover:cursor-pointer hover:bg-slate-200 duration-200 border rounded-xl border-none'>{history.message}</div>)}
            <Profile id={profileId} /> 
        </div>
    }
}

export default ChatHistory;