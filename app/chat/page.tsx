'use client'

import '../globals.css'
import React, { useState, useEffect, useRef } from 'react';
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
import { Answer, Conversation, ResponseType, User } from '@/types/types';

function Chat() {

    const [answer, setAnswer] = useState<Answer>();
    const [question, setQuestion] = useState<string>('');
    const [response, setResponse] = useState<ResponseType[]>([]);
    const [user, setUser] = useState<User>();
    const [isQuestion, setIsQuestion] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [convoId, setConvoId] = useState<string>(uuid());
    const [convoTitle, setConvoTitle] = useState<string>('');
    const [settings, setSettings] = useState<boolean>(false);
    const [sidebar, setSidebar] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<boolean>(true);
    const [seed, setSeed] = useState<number | null>(null);
    const [latestConvo, setLatestConvo] = useState<Conversation>();
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const data = new FormData();
    const renderCount = useRef<number>(0);
    const responseCounter = useRef<number>(0);
    const textArea = useRef<any>(null);
    const curerntDate: Date = new Date();
    const isoDate: string = curerntDate.toISOString().split('T')[0];
    const localTime: string = curerntDate.toLocaleTimeString('zh-TW', { hour12: false });
    const date: string = `${isoDate} ${localTime}`;

    useEffect(() => {
        async function getSession() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        getSession();
    }, [])

    async function createConvo() {
        if (renderCount.current === 0) {
            const { data } = await supabase.from('conversations').insert({
                id: convoId,
                title: 'New Conversation',
                created_at: date
            }).select();

            renderCount.current = renderCount.current + 1;
        }
    }

    async function createDialog() {
        const { data, error } = await supabase.from('dialogs').insert({
            question: response[responseCounter.current].question,
            answer: response[responseCounter.current].answer,
            links: response[responseCounter.current].links,
            conversation_id: convoId
        })
        if (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (response.length > 0) {
            createDialog();
            responseCounter.current = responseCounter.current + 1;
        }
    }, [response])

    async function selectAndUpdateConvo() {
        const { data, error } = await supabase.from('conversations').select('*').eq('id', convoId);
        if (data.length > 0) {
            if (data[0].title === "New Conversation" && responseCounter.current === 1) {
                if (convoTitle) {
                    const { data } = await supabase.from('conversations').update({
                        title: convoTitle,
                        profile_id: user.id
                    }).eq('id', convoId).select('*');
                    setLatestConvo(data[0]);
                }
                if (error) {
                    console.log(error);
                }
            }
        }
    }

    useEffect(() => {
        if (convoId) {
            selectAndUpdateConvo();
        }
    }, [convoTitle])

    const handleRefresh = () => {
        setSeed(Math.random());
    }

    const handleSettings = () => {
        setSettings(!settings);
        setSidebar(!sidebar);
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(e.target.value)
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
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
            }).then(res => setAnswer({ answer: res.data[0].answer, links: res.data[0].links }))

        } catch (err) {
            console.log(err)
        }

        try {
            await axios({
                method: 'POST',
                url: '/api/title',
                data: data
            }).then(res => setConvoTitle(res.data));
        } catch (err) {
            console.log(err)
        }

        setIsQuestion(!isQuestion);
        setLoading(false);
        setQuestion('');
        handleRefresh();
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
        if (answer && question) {
            setResponse(curr => [...curr, { question, answer: answer.answer, links: answer.links }]);
        }
    }, [answer])

    useEffect(() => {
        textArea.current.style.height = "auto";
        textArea.current.style.height = textArea.current.scrollHeight + 'px';
    }, [question])
    
    return <>
        {settings || sidebar ? <Cover /> : null}
        <div className={`w-full h-full`}>
            {sidebar ? <Sidebar profileId={user.id} handleSettings={handleSettings} handleSidebar={handleSidebar} /> : null}
            <Navbar handleSidebar={handleSidebar} />
            <div className='h-dvh sm:h-full w-full overflow-hidden flex items-center justify-center dark:bg-slate-900'>
                {settings ? <Settings profile={user} handleSettings={handleSettings} mode={handleDarkMode} /> : null}
                {user && chatHistory ? <ChatHistory profileId={user.id} handleSettings={handleSettings} toggle={handleChatHistory} refresh={seed} latestConvo={latestConvo}/> : <ChatOptions chatHistory={handleChatHistory}/>}
                <div className='w-full h-full flex flex-col justify-between'>
                    <div className='w-full h-full overflow-auto flex flex-col justify-center'>
                        <div className='h-5/6 w-full overflow-auto my-8'>
                            {response.length > 0 || loading ? <InfiniteScroll dataLength={response.length} next={() => { }} hasMore={false} loader={<PulseLoader color={'#000000'} size={10} aria-label="Loading Spinner" data-testid="loader" />} className='w-full xl:px-44'>
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
                                    <textarea className={`h-8 w-3/4 rounded-full bg-inherit border-transparent focus:border-transparent focus:ring-0 resize-none overflow-hidden box-border`} rows={1} onChange={handleChange} value={question} ref={textArea} placeholder='Ask SSays'>
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