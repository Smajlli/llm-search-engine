'use client'

import '@/app/globals.css'
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Profile from './Profile';
import PopupMenu from './PopupMenu';
import QuestionsContainer from './QuestionsContainer';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link';
import { Transition } from '@headlessui/react';


function ChatHistory({profileId, handleSettings, toggle, mode}) {
    const [conversations, setConversations] = useState([]);
    const [todayQuestions, setTodayQuestions] = useState([]);
    const [lastWeekDates, setLastWeek] = useState([]);
    const [lastWeekQuestions, setLastWeekQuestions] = useState([]);
    const [olderQuestions, setOlderQestions] = useState([]);
    const [popup, setPopup] = useState(false);
    const date = new Date();
    const today = date.getFullYear() + '-'
        + 0 + (date.getMonth() + 1) + '-'
        + '0' + date.getDate();
    const renderCount = useRef(0);
    const dateCount = useRef(0)
    useEffect(() => {
        async function getConversations() {
            const { data } = await supabase.from('conversations').select('*').eq('profile_id', profileId)
            setConversations(data);
        }
        getConversations();
    }, [])

    useEffect(() => {
        for (let i = 1; i < 7; i++) {
            const thisDay = new Date();
            const day = new Date();
            day.setDate(thisDay.getDate() - i);
            const stringDate = day.toISOString().split('T')[0];
            setLastWeek(curr => [...curr, stringDate]);
        }
    }, [])

    useEffect(() => {
        if(renderCount.current === 2) {
           if(conversations && lastWeekDates) {
               conversations.map((q) => {
                   if (q.created_at === today) {
                       setTodayQuestions(curr => [...curr, q]);
                   } else if(lastWeekDates.includes(q.created_at)) {
                        setLastWeekQuestions(curr => [...curr, q]);
                   } else {
                       setOlderQestions(curr => [...curr, q]);
                   }
               })
           }
        }
        renderCount.current = renderCount.current + 1;
    }, [conversations])

    const handlePopup = () => {
        setPopup(!popup);
    }

    const hanldeModal = () => {
        handleSettings();
    }

    const toggleChatHistory = () => {
        toggle();
    }

    if(!conversations || conversations.length === 0) {
        return <div className='h-full w-92 bg-slate-50 p-4 hidden md:block px-2 md:px-4 dark:bg-slate-800'>
            <div className='flex flex-row justify-between items-center p-4 dark:bg-slate-800'>
                <div className='text-xl font-bold dark:text-white'>Chat History</div>
                <div className='flex flex-row items-center bg-inherit'>
                    <Link href={'/chat'} className='p-2 rounded-lg hover:cursor-pointer hover:bg-slate-200 duration-200 mr-2 dark:hover:bg-slate-600'>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className='dark:text-white'
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3 5C3 3.34315 4.34315 2 6 2H14C17.866 2 21 5.13401 21 9V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5ZM13 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V9H13V4ZM18.584 7C17.9413 5.52906 16.6113 4.4271 15 4.10002V7H18.584Z"
                                fill="currentColor"
                            />
                        </svg>
                    </Link>
                    <div onClick={toggleChatHistory} className='p-2 rounded-lg hover:cursor-pointer hover:bg-slate-200 duration-200 mr-2 dark:hover:bg-slate-600'>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className='dark:text-white'
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M21 20H7V4H21V20ZM19 18H9V6H19V18Z"
                                fill="currentColor"
                            />
                            <path d="M3 20H5V4H3V20Z" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className='h-full flex flex-col justify-between mt-4 dark:bg-slate-800'>
                <div className='w-72 bg-slate-200 z-10 dark:bg-slate-800' onClick={handlePopup}>
                    {popup ? <PopupMenu id={profileId} hanldeModal={hanldeModal} /> : null}
                    <Profile id={profileId} />
                </div>
            </div>
        </div>
    } else {
        return <div className='h-full w-92 bg-slate-50 p-4 hidden md:block px-2 md:px-4 dark:bg-slate-800'>
            <div className='flex flex-row justify-between items-center p-4'>
                <div className='text-xl font-bold dark:text-white'>Chat History</div>
                <div className='flex flex-row items-center'>
                    <Link href={'/chat'} className=' p-2 rounded-lg hover:cursor-pointer hover:bg-slate-200 duration-200 mr-2 dark:hover:bg-slate-600'>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className='dark:text-white'
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3 5C3 3.34315 4.34315 2 6 2H14C17.866 2 21 5.13401 21 9V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5ZM13 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V9H13V4ZM18.584 7C17.9413 5.52906 16.6113 4.4271 15 4.10002V7H18.584Z"
                                fill="currentColor"
                            />
                        </svg>
                    </Link>
                    <div onClick={toggleChatHistory} className='p-2 rounded-lg hover:cursor-pointer hover:bg-slate-200 duration-200 mr-2 dark:hover:bg-slate-600'>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className='dark:text-white'
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M21 20H7V4H21V20ZM19 18H9V6H19V18Z"
                                fill="currentColor"
                            />
                            <path d="M3 20H5V4H3V20Z" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className='h-full flex flex-col justify-between mt-4'>
                <div className='h-4/6 overflow-auto relative'>
                    <InfiniteScroll dataLength={conversations.length}>
                        { todayQuestions.length >= 1 ? <QuestionsContainer questions={todayQuestions} text={'Today'} /> : null } 
                        { lastWeekQuestions.length > 0 ? <QuestionsContainer questions={lastWeekQuestions} text={'Last Week'}/> : null }
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