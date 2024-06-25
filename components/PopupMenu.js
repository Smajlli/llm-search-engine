'use client'

import '@/app/globals.css'

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function PopupMenu({ id, hanldeModal }) {
    const [profile, setProfile] = useState();
    const router = useRouter();

    useEffect(() => {
        async function getProfile() {
            const {data} = await supabase.from('profiles').select('*').eq('id', id);
            setProfile(data);
        }
        getProfile();
    }, [])

    const handleLogout = async () => {
        const {err} = await supabase.auth.signOut();
        router.refresh();
    }

    const handleSettingsModal = () => {
        hanldeModal();
    }

    if(!profile || profile.length === 0) {
        return null
    } else {
        return <div className='p-4 flex flex-col w-72 h-36 border-solid border-2 rounded-lg drop-shadow-md absolute bottom-16 bg-white divide-y divide-slate-200'>
            <div className='text-sm py-2 px-4 text-slate-500'> {profile[0].email} </div>
            <div className='flex flex-row py-2 text-sm hover:bg-slate-100 rounded-lg hover:cursor-pointer duration-200 px-4'>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className='text-slate-700 mr-2'
                >
                    <path
                        fillRule="evenodd"
                        clilRule="evenodd"
                        d="M7 3C8.86384 3 10.4299 4.27477 10.874 6H19V8H10.874C10.4299 9.72523 8.86384 11 7 11C4.79086 11 3 9.20914 3 7C3 4.79086 4.79086 3 7 3ZM7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z"
                        fill="currentColor"
                    />
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17 20C15.1362 20 13.5701 18.7252 13.126 17H5V15H13.126C13.5701 13.2748 15.1362 12 17 12C19.2091 12 21 13.7909 21 16C21 18.2091 19.2091 20 17 20ZM17 18C18.1046 18 19 17.1046 19 16C19 14.8954 18.1046 14 17 14C15.8954 14 15 14.8954 15 16C15 17.1046 15.8954 18 17 18Z"
                        fill="currentColor"
                    />
                </svg>
                <div onClick={handleSettingsModal}> Settings </div>
            </div>
            <div className='text-sm py-2 flex flex-row hover:bg-slate-100 rounded-lg hover:cursor-pointer duration-200 px-4'>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className='text-slate-700 mr-2'
                >
                    <path
                        d="M8.51428 20H4.51428C3.40971 20 2.51428 19.1046 2.51428 18V6C2.51428 4.89543 3.40971 4 4.51428 4H8.51428V6H4.51428V18H8.51428V20Z"
                        fill="currentColor"
                    />
                    <path
                        d="M13.8418 17.385L15.262 15.9768L11.3428 12.0242L20.4857 12.0242C21.038 12.0242 21.4857 11.5765 21.4857 11.0242C21.4857 10.4719 21.038 10.0242 20.4857 10.0242L11.3236 10.0242L15.304 6.0774L13.8958 4.6572L7.5049 10.9941L13.8418 17.385Z"
                        fill="currentColor"
                    />
                </svg>
                <div onClick={handleLogout}>Log out</div>
            </div>
        </div>
    }
}

export default PopupMenu;