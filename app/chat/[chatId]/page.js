'use client'

import '@/app/globals.css'
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Response from '@/components/Response';
import ChatHistory from '@/components/ChatHistory';
import PulseLoader from 'react-spinners/PulseLoader'
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Cover from '@/components/Cover';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Settings from '@/components/Settings';
import ChatOptions from '@/components/ChatOptions';

function Chat({params}) {
    const [answer, setAnswer] = useState('');
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState([]);
    const [isQuestion, setIsQuestion] = useState(false);
    const [loading, setLoading] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [user, setUser] = useState();
    const [settings, setSettings] = useState(false);
    const [sidebar, setSidebar] = useState(false);
    const [chatHistory, setChatHistory] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const data = new FormData();
    const responseCounter = useRef(0);
    const textArea = useRef(null);

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

    useEffect(() => {
        if(conversation.length > 0) {
            async function sendRequest() {
                data.append('id', params.chatId)
                await axios({
                    method: 'POST',
                    url: '/api/convo',
                    data: data
                }).then(res => setAnswer(res.data))
            }
            sendRequest();
        }
    }, [conversation])

    useEffect(() => {
        if (response.length > 0) {
            async function createDialog() {
                const { data, error } = await supabase.from('dialogs').insert({
                    question: response[responseCounter.current].question,
                    answer: response[responseCounter.current].answer,
                    conversation_id: params.chatId
                })
                if (error) {
                    console.log(error)
                }
            }
            createDialog();
            responseCounter.current = responseCounter.current + 1;
        }
    }, [response])

    useEffect(() => {
        if (answer && question) {
            setResponse(curr => [...curr, { question, answer }]);
        }
    }, [answer])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        data.append('key', question);
        data.append('userId', user.id);
        data.append('convoId', params.chatId);

        try {
            await axios({
                method: 'POST',
                url: '/api/chat',
                data: data
            }).then(res => setAnswer(res.data));
        } catch(err) {
            console.log(err);
        }

        setIsQuestion(!isQuestion);
        setLoading(false);
    }

    const handleChange = (e) => {
        setQuestion(e.target.value)
    }

    const handleSettings = () => {
        setSettings(!settings);
        setSidebar(!sidebar);
    }

    const handleSidebar = () => {
        setSidebar(!sidebar);
    }

    const handleChatHistory = () => {
        setChatHistory(!chatHistory);
    }

    const handleDarkMode = () => {
        setDarkMode(!darkMode);
    }

    useEffect(() => {
        textArea.current.style.height = "auto";
        textArea.current.style.height = textArea.current.scrollHeight + 'px';
    }, [question])

    return <>
        {settings || sidebar ? <Cover /> : null}
        <div className={`w-full h-full ${darkMode && 'dark'}`}>
            {sidebar ? <Sidebar profileId={user.id} handleSettings={handleSettings} handleSidebar={handleSidebar} /> : null}
            <Navbar handleSidebar={handleSidebar} />
            <div className='h-full w-full overflow-hidden flex items-center justify-center dark:bg-slate-900'>
                {settings ? <Settings profile={user} handleSettings={handleSettings} mode={handleDarkMode} /> : null}
                {user && chatHistory ? <ChatHistory profileId={user.id} handleSettings={handleSettings} toggle={handleChatHistory}/> : <ChatOptions chatHistory={handleChatHistory}/>}
                <div className='w-full h-full flex flex-col justify-between'>
                    <div className='w-full h-full overflow-auto px-2 flex flex-col'>
                        <div className='h-5/6 w-full overflow-auto my-8'>
                            <InfiniteScroll dataLength={response.length} className='w-full xl:px-44'>
                                {conversation.map(convo => <Response answer={convo.answer} question={convo.question} userId={user.id} />)}
                                {!response || response.length === 0 && isQuestion === false ? null : response.map(res => <Response answer={res.answer} question={res.question} userId={user.id} />)}
                                {loading ? <div className='mb-4'> <PulseLoader loading={loading} color={'#000000'} size={10} aria-label="Loading Spinner" data-testid="loader" /> </div> : null}
                            </InfiniteScroll>
                        </div>
                        <div className='w-full h-12 sm:h-24 text-center flex flex-col items-center justify-center p-16 fixed bottom-0 bg-white relative z-20 dark:bg-slate-900'>
                            <form onSubmit={handleSubmit} className='w-full sm:w-2/4 text-center flex items-center justify-center'>
                                <div className='flex flex-row border-solid rounded-full w-5/6 justify-between items-center pr-2 bg-gray-100 p-1.5 dark:bg-slate-600 absolute'>
                                    <textarea className={`h-8 w-3/4 rounded-full bg-inherit border-transparent focus:border-transparent focus:ring-0 resize-none overflow-hidden box-border`} rows="1" onChange={handleChange} value={question} ref={textArea} placeholder='Ask SSays'>
                                    </textarea>
                                    <button className={`py-px px-2 rounded-full ${question.length > 0 ? 'bg-gray-500' : 'bg-gray-400'} duration-200 h-10 w-10 flex items-center justify-center`}>
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className='text-white font-black'
                                        >
                                            <path
                                                d="M17.6568 8.96219L16.2393 10.3731L12.9843 7.10285L12.9706 20.7079L10.9706 20.7059L10.9843 7.13806L7.75404 10.3532L6.34314 8.93572L12.0132 3.29211L17.6568 8.96219Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Chat;