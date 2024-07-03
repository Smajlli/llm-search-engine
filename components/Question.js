'use client'

import '@/app/globals.css'

import EditChat from './EditChat';
import { useState } from 'react';
import Link from 'next/link';

function Question({text, convoId}) {
    const [edit, setEdit] = useState(false);

    const handleEdit = () => {
        setEdit(!edit);
    }

    return <>
        <div className='group mb-2 py-4 px-2 w-72  h-12 text-xs hover:cursor-pointer hover:bg-slate-200 hover:py-4 duration-200 border rounded-xl border-none flex flex-row items-center justify-between bg-gradient-to-r from-slate-100 dark:from-slate-800 dark:hover:bg-slate-600'>
            <div className='inline-block whitespace-nowrap overflow-hidden'> <Link href={`/chat/${convoId}`} className='dark:text-white'> {text} </Link> </div>
            <div onClick={handleEdit} className='group-hover:inline-block dark:text-white'>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className='hover:text-slate-600 dark:text-white'
                >
                    <path
                        d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z"
                        fill="currentColor"
                    />
                    <path
                        d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                        fill="currentColor"
                    />
                    <path
                        d="M18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12C16 13.1046 16.8954 14 18 14Z"
                        fill="currentColor"
                    />
                </svg>
            </div>
        </div>
        {edit ? <EditChat id={convoId} handleEdit={handleEdit} /> : null}
    </>
}

export default Question;