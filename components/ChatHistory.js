'use client'

import '@/app/globals.css'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Profile from './Profile';
import PopupMenu from './PopupMenu';
import Question from './Question';
import InfiniteScroll from 'react-infinite-scroll-component';


function ChatHistory({profileId}) {
    const [profileHistory, setProfileHistory] = useState([]);
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
        return <div className='h-full w-96 bg-slate-50 p-4 block'>
            <div className='text-xl font-bold'>Chat History</div>
            <div className='h-full flex flex-col justify-between mt-4'>
                <div className='h-4/6 overflow-auto relative'>
                    <InfiniteScroll dataLength={profileHistory.length}>
                        {profileHistory.map((history) => {
                            if (profileId === history.profile_id) {
                                return <Question text={history.title} convoId={history.id} />
                            }
                        })}
                    </InfiniteScroll>
                </div>
                <div className='w-72 bg-slate-200 z-10' onClick={handlePopup}>
                    {popup ? <PopupMenu id={profileId}/> : null}
                    <Profile id={profileId} />
                </div>
            </div>
        </div>
    }
}

export default ChatHistory;