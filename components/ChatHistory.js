'use client'

import '@/app/globals.css'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Profile from './Profile';
import PopupMenu from './PopupMenu';
import Question from './Question';


function ChatHistory({profileId}) {
    const [profileHistory, setProfileHistory] = useState();
    const [popup, setPopup] = useState(false);

    useEffect(() => {
        async function getHistory() {
            const {data} = await supabase.from('conversations').select('*')
            setProfileHistory(data)
        }
        getHistory();
    }, [])

    const handlePopup = () => {
        setPopup(!popup);
    }

    if(!profileHistory || profileHistory.length === 0) {
        return null
    } else {
        return <div className='h-screen w-80 bg-slate-50 p-4 block'>
            <div className='text-xl font-bold mb-10'>Chat History</div>
            {profileHistory.map((history) => {
                return <Question text={history.title} convoId={history.id} />})}
            <div className='w-72 fixed bg-slate-200 z-10' onClick={handlePopup}>
                {popup ? <PopupMenu id={profileId}/> : null}
                <Profile id={profileId} /> 
            </div>
        </div>
    }
}

export default ChatHistory;