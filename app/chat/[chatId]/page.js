'use client'

import '@/app/globals.css'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Response from '@/components/Response';
import ChatHistory from '@/components/ChatHistory';
import PulseLoader from 'react-spinners/PulseLoader'

function Chat({params}) {
    const [conversation, setConversation] = useState([]);
    const [user, setUser] = useState();

    useEffect(() => {
        async function getSession() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        getSession();
    }, [])

    useEffect(() => {
        async function getConvo() {
            const {data, err} = await supabase.from('dialogs').select('*').eq('conversation_id', params.chatId);
            setConversation(data);
        }
        getConvo();
    }, [])

    return <>
        <div className='w-screen h-screen relative flex'>
            {user ? <ChatHistory profileId={user.id} /> : null}
            <div className='w-full h-full flex flex-col items-center justify-between'>
                <div className='w-full'>
                    {conversation.map(convo => <Response answer={convo.answer} question={convo.question} userId={user.id} />)}
                </div>
                <div className='w-full h-32 text-center flex items-center justify-center'>
                    <form className='mb-11 w-9/12 text-center'>
                        <div className='flex flex-row border-solid border-2 rounded-full w-5/6 justify-between pr-2'>
                            <input type='text' className='border-none w-3/4 rounded-full'></input>
                            <button>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className='text-slate-500 h-9 w-9'
                                >
                                    <path
                                        d="M14.8285 11.9481L16.2427 10.5339L12 6.29122L7.7574 10.5339L9.17161 11.9481L11 10.1196V17.6568H13V10.1196L14.8285 11.9481Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M19.7782 4.22183C15.4824 -0.0739415 8.51759 -0.0739422 4.22183 4.22183C-0.0739415 8.51759 -0.0739422 15.4824 4.22183 19.7782C8.51759 24.0739 15.4824 24.0739 19.7782 19.7782C24.0739 15.4824 24.0739 8.51759 19.7782 4.22183ZM18.364 5.63604C14.8492 2.12132 9.15076 2.12132 5.63604 5.63604C2.12132 9.15076 2.12132 14.8492 5.63604 18.364C9.15076 21.8787 14.8492 21.8787 18.364 18.364C21.8787 14.8492 21.8787 9.15076 18.364 5.63604Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default Chat;