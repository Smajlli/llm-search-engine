'use client'

import '../globals.css'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Response from '@/components/Response';
import ChatHistory from '@/components/ChatHistory';
import { supabase } from '@/utils/supabase/supabase';
import PulseLoader from 'react-spinners/PulseLoader'
import { v4 as uuid } from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import Settings from '@/components/Settings';
import Cover from '@/components/Cover';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ChatOptions from '@/components/ChatOptions';
import Logo from '@/components/Logo';

function Chat() {
    const [answer, setAnswer] = useState([]);
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState([]);
    const [user, setUser] = useState();
    const [isQuestion, setIsQuestion] = useState(false);
    const [loading, setLoading] = useState(false);
    const [convoId, setConvoId] = useState(uuid());
    const [convoTitle, setConvoTitle] = useState('');
    const [settings, setSettings] = useState(false);
    const [sidebar, setSidebar] = useState(false);
    const [chatHistory, setChatHistory] = useState(true);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved !== null ? JSON.parse(saved) : false;
    });
    const data = new FormData();
    const renderCount = useRef(0);
    const responseCounter = useRef(0);
    const textArea = useRef(null);
    const currentDate = new Date();
    const date = currentDate.toISOString().toLocaleString('zh-TW');

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode])

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
                title: 'New Conversation',
                created_at: date
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
                    links: response[responseCounter.current].links,
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
            }).then(res => setAnswer({answer: res.data[0].answer, links: res.data[0].links}))
            
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
        setLoading(false);
        setQuestion('');
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
        if (answer  && question) {
            setResponse(curr => [...curr, { question, answer: answer.answer, links: answer.links }]);
        }
    }, [answer])

    useEffect(() => {
        textArea.current.style.height = "auto";
        textArea.current.style.height = textArea.current.scrollHeight + 'px';
    }, [question])
    
    return <>
        {settings || sidebar ? <Cover /> : null}
        <div className={`w-full h-full ${darkMode && 'dark'}`}>
            {sidebar ? <Sidebar profileId={user.id} handleSettings={handleSettings} handleSidebar={handleSidebar} /> : null}
            <Navbar handleSidebar={handleSidebar} />
            <div className='h-dvh sm:h-full w-full overflow-hidden flex items-center justify-center dark:bg-slate-900'>
                {settings ? <Settings profile={user} handleSettings={handleSettings} mode={handleDarkMode} /> : null}
                {user && chatHistory ? <ChatHistory profileId={user.id} handleSettings={handleSettings} today={date} toggle={handleChatHistory}/> : <ChatOptions chatHistory={handleChatHistory}/>}
                <div className='w-full h-full flex flex-col justify-between'>
                    <div className='w-full h-full overflow-auto flex flex-col justify-center'>
                        <div className='h-5/6 w-full overflow-auto my-8'>
                            {response.length > 0 || loading ? <InfiniteScroll dataLength={response.length} className='w-full xl:px-44'>
                                {!response || response.length === 0 && isQuestion === false ? null : response.map(res => <Response answer={res.answer} question={res.question} sources={res.links} userId={user.id} />)}
                                {loading ? <div className='mb-4 w-full h-full text-center flex flex-col justify-center items-center'> <PulseLoader loading={loading} color={'#000000'} size={10} aria-label="Loading Spinner" data-testid="loader" /> </div> : null}
                            </InfiniteScroll> : <div className='w-full h-full text-center flex flex-col justify-center items-center'>
                                    <div className='flex flex-row items-center'> <Logo width={170} height={170}/></div>
                                <div className='mt-4 dark:text-white'>How can I help you today ?</div>
                            </div>}
                        </div>
                        <div className='w-full h-12 sm:h-24 text-center flex flex-col items-center justify-center p-16 fixed bottom-0 bg-white relative dark:bg-slate-900'>
                            <form onSubmit={handleSubmit} className='w-full sm:w-2/4 text-center flex items-center justify-center'>
                                <div className='flex flex-row border-solid rounded-full w-5/6 justify-between items-center pr-2 bg-gray-100 dark:bg-slate-600 p-1.5 absolute'>
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