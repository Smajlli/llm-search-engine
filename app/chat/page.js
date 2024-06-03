'use client'

import '../globals.css'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Response from '@/components/Response';
import ChatHistory from '@/components/ChatHistory';
import { supabase } from '@/utils/supabase/supabase';
import PulseLoader from 'react-spinners/PulseLoader'
import { v4 as uuid } from 'uuid';

function Chat() {
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState([]);
    const [user, setUser] = useState();
    const [isQuestion, setIsQuestion] = useState(false);
    const [loading, setLoading] = useState(false);
    const [convoId, setConvoId] = useState(uuid());
    const [convoTitle, setConvoTitle] = useState('');
    const data = new FormData();
    const renderCount = useRef(0);
    const responseCounter = useRef(0);

    useEffect(() => {
         async function getSession() {
            const { data: {user} } = await supabase.auth.getUser();
            setUser(user);
        }
        getSession();
    }, [])

    async function createConvo() {
        if(renderCount.current === 0) {
            const { data } = await supabase.from('conversations').insert({
                id: convoId,
                title: 'New Conversation'
            }).select();
            
            renderCount.current = renderCount.current + 1;
        }
    }
    

    useEffect(() => {
        if(response.length > 0) {
            async function createDialog() {
                const {data, error} = await supabase.from('dialogs').insert({
                    question: response[responseCounter.current].question,
                    answer: response[responseCounter.current].answer,
                    conversation_id: convoId 
                })
                if(error) {
                    console.log(error)
                }
            }
            createDialog();
            responseCounter.current = responseCounter.current + 1; 
        }
    }, [response])

    useEffect(() => {
        if (convoId) {
            async function selectAndUpdateConvo() {
                const { data, error } = await supabase.from('conversations').select('*').eq('id', convoId);
                if(data.length > 0) {
                    if (data[0].title === "New Conversation" && responseCounter.current === 1) {
                        if (convoTitle) {
                            await supabase.from('conversations').update({
                                title: convoTitle,
                                profile_id: user.id
                            }).eq('id', convoId);
                        }
                        if (error) {
                            console.log(error);
                        }
                    }
                }
            }

            selectAndUpdateConvo();   
        } else {
            console.log('CANNOT UPDATE :/')
        }
    }, [convoTitle])

    const handleChange = (e) => {
        setQuestion(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        createConvo();
        
        data.append('key', question);
        data.append('userId', user.id);
        data.append('convoId', convoId);

        try {
            await axios({
                method: 'POST',
                url: '/api/chat',
                data: data
            }).then(res => setAnswer(res.data))
            
        } catch(err) {
            console.log(err)
        }

        try {
            await axios({
                method: 'POST',
                url: '/api/title',
                data: data
            }).then(res => setConvoTitle(res.data));
        } catch(err) {
            console.log(err)
        }

        setIsQuestion(!isQuestion);
        setLoading(false)
    }

    useEffect(() => {
        if (answer && question) {
            setResponse(curr => [...curr, { question, answer }]);
        }
    }, [answer])
    
    return <>
        <div className='w-screen h-screen relative flex'>
            {user ? <ChatHistory profileId={user.id} /> : null}
            <div className='w-full h-full flex flex-col items-center justify-between'>
                {response.length || loading ? null : <div className='w-full h-full flex flex-col items-center justify-center'> <div className='text-2xl font-bold mb-4 text-center'> How can I help You today ? </div> </div>}
                {
                    !response || response.length === 0 && isQuestion === false ? null :
                        <div className='w-full'>
                            {response.map(r => <Response answer={r.answer} question={r.question} userId={user.id} />)}
                        </div>
                }
                {loading ? <div className='mb-4'> <PulseLoader loading={loading} color={'#000000'} size={10} aria-label="Loading Spinner" data-testid="loader" /> </div> : null}
                <div className='w-full h-32 text-center flex items-center justify-center'>
                    <form onSubmit={handleSubmit} className='mb-11 w-9/12 text-center'>
                        <div className='flex flex-row border-solid border-2 rounded-full w-5/6 justify-between pr-2'>
                            <input type='text' className='border-none w-3/4 rounded-full' onChange={handleChange}></input>
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