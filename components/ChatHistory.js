'use client'

import '@/app/globals.css'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Profile from './Profile';
import PopupMenu from './PopupMenu';
import Question from './Question';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link';


function ChatHistory({profileId, handleSettings}) {
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

    const hanldeModal = () => {
        handleSettings();
    }

    if(!profileHistory || profileHistory.length === 0) {
        return null
    } else {
        return <div className='h-full w-96 bg-slate-50 p-4 block'>
            <div className='flex flex-row justify-between items-center p-4'>
                <div className='text-xl font-bold'>Chat History</div>
                <Link href={'/chat'} className=' p-2 rounded-lg hover:cursor-pointer hover:bg-slate-200 duration-200'>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3 5C3 3.34315 4.34315 2 6 2H14C17.866 2 21 5.13401 21 9V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5ZM13 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V9H13V4ZM18.584 7C17.9413 5.52906 16.6113 4.4271 15 4.10002V7H18.584Z"
                                fill="currentColor"
                            />
                        </svg> 
                </Link>
            </div>
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
                    {popup ? <PopupMenu id={profileId} hanldeModal={hanldeModal}/> : null}
                    <Profile id={profileId} />
                </div>
            </div>
        </div>
    }
}

export default ChatHistory;