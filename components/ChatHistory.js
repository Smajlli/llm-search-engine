'use client'

import '@/app/globals.css'
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Profile from './Profile';
import PopupMenu from './PopupMenu';
import QuestionsContainer from './QuestionsContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link';


function ChatHistory({profileId, handleSettings}) {
    const [conversations, setConversations] = useState([]);
    const [todayQuestions, setTodayQuestions] = useState([]);
    const [olderQuestions, setOlderQestions] = useState([]);
    const [popup, setPopup] = useState(false);
    const date = new Date();
    const today = date.getFullYear() + '-'
        + 0 + (date.getMonth() + 1) + '-'
        + '0' + date.getDate();
    const renderCount = useRef(0);

    useEffect(() => {
        async function getConversations() {
            const { data } = await supabase.from('conversations').select('*').eq('profile_id', profileId)
            setConversations(data);
        }
        getConversations();
    }, [])

    useEffect(() => {
        if(renderCount.current === 2) {
           if(conversations.length) {
               conversations.map((q) => {
                   if (q.created_at === today) {
                       setTodayQuestions(curr => [...curr, q]);
                   } else {
                       setOlderQestions(curr => [...curr, q]);
                   }
                   console.log('Inside statement')
               })
           }
            console.log('Oneee ;)')
        } else {
            console.log('Anything but one :(')
        }
        renderCount.current = renderCount.current + 1;
    }, [conversations])

    const handlePopup = () => {
        setPopup(!popup);
    }

    const hanldeModal = () => {
        handleSettings();
    }

    if(!conversations || conversations.length === 0) {
        return null
    } else {
        return <div className='h-full w-96 bg-slate-50 p-4 hidden md:block px-2 md:px-4'>
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
                    <InfiniteScroll dataLength={conversations.length}>
                        { todayQuestions.length >= 1 ? <QuestionsContainer questions={todayQuestions} text={'Today'} /> : null } 
                        { olderQuestions.length > 0 ? <QuestionsContainer questions={olderQuestions} text={'Older'} /> : null }
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