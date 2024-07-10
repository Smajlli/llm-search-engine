'use client'

import '@/app/globals.css'
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Profile from './Profile';
import PopupMenu from './PopupMenu';
import Question from './Question';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from 'next/link';
import QuestionsContainer from './QuestionsContainer';

function Sidebar({profileId, handleSettings, handleSidebar}) {
    const [profileHistory, setProfileHistory] = useState([]);
    const [popup, setPopup] = useState(false);
    const [todayQuestions, setTodayQuestions] = useState([]);
    const [lastWeekDates, setLastWeek] = useState([]);
    const [lastWeekQuestions, setLastWeekQuestions] = useState([]);
    const [olderQuestions, setOlderQestions] = useState([]);
    const date = new Date();
    const today = date.getFullYear() + '-'
        + 0 + (date.getMonth() + 1) + '-'
        + '0' + date.getDate();
    const renderCount = useRef(0);
    const dateCount = useRef(0)

    useEffect(() => {
        async function getHistory() {
            const { data } = await supabase.from('conversations').select('*')
            setProfileHistory(data)
        }
        getHistory();
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
        if (renderCount.current === 2) {
            if (profileHistory && lastWeekDates) {
                profileHistory.map((q) => {
                    if (q.created_at === today) {
                        setTodayQuestions(curr => [...curr, q]);
                    } else if (lastWeekDates.includes(q.created_at)) {
                        setLastWeekQuestions(curr => [...curr, q]);
                    } else {
                        setOlderQestions(curr => [...curr, q]);
                    }
                })
            }
        }
        renderCount.current = renderCount.current + 1;
    }, [profileHistory])

    const handlePopup = () => {
        setPopup(!popup);
    }

    const hanldeModal = () => {
        handleSettings();
    }

    const sidebarOpenClose = () => {
        handleSidebar();
    }

    if (!profileHistory || profileHistory.length === 0) {
        return null
    } else {
        return <div className='h-full sm:h-full w-96 bg-slate-50 p-4 block md:hidden px-2 md:px-4 absolute z-30 dark:bg-slate-900 dark:text-white'>
                <div className='flex flex-row justify-between items-center p-4'>
                    <div className='text-xl font-bold dark:text-white'>Chat History</div>
                    <div className="flex flex-row items-center">
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
                        <div onClick={sidebarOpenClose}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className='h-full flex flex-col justify-between mt-4'>
                    <div className='h-4/6 overflow-auto relative'>
                        <InfiniteScroll dataLength={profileHistory.length}>
                            {todayQuestions.length >= 1 ? <QuestionsContainer questions={todayQuestions} text={'Today'} /> : null}
                            {lastWeekQuestions.length > 0 ? <QuestionsContainer questions={lastWeekQuestions} text={'Last Week'} /> : null}
                            {olderQuestions.length > 0 ? <QuestionsContainer questions={olderQuestions} text={'Older'} /> : null}
                        </InfiniteScroll>
                    </div>
                    <div className='w-72 bg-slate-200 z-10' onClick={handlePopup}>
                        {popup ? <PopupMenu id={profileId} hanldeModal={hanldeModal} /> : null}
                        <Profile id={profileId} />
                    </div>
                </div>
            </div>
    }
}

export default Sidebar;