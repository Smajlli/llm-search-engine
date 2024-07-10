import '@/app/globals.css'

import { supabase } from '@/utils/supabase/supabase';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import PopupMenu from './PopupMenu';

function Profile({id}) {
    const [profile, setProfile] = useState();
  

    useEffect(() => {
        async function getProfile() {
            const {data} = await supabase.from('profiles').select('*').eq('id', id);
            setProfile(data);
        }
        getProfile();
    }, [])


    if(!profile || profile.length === 0) {
        return null
    } else {
        return <>
            <div className='flex flex-row items-center w-72 p-2 bottom-0 absolute overflow-hidden bg-slate-50 hover:cursor-pointer hover:bg-slate-200 duration-200 border rounded-xl border-none dark:bg-slate-800 dark:hover:bg-slate-700'>
                {profile[0].profile_image ? <Image className='mr-4' src={profile[0].profile_image} width={35} height={35} /> : <div className='w-9 h-9 bg-slate-300 rounded-full flex items-center justify-center mr-4'> <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className='dark:text-white'
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM14 7C14 8.10457 13.1046 9 12 9C10.8954 9 10 8.10457 10 7C10 5.89543 10.8954 5 12 5C13.1046 5 14 5.89543 14 7Z"
                        fill="currentColor"
                    />
                    <path
                        d="M16 15C16 14.4477 15.5523 14 15 14H9C8.44772 14 8 14.4477 8 15V21H6V15C6 13.3431 7.34315 12 9 12H15C16.6569 12 18 13.3431 18 15V21H16V15Z"
                        fill="currentColor"
                    />
                </svg> </div> }
                <div className='dark:text-white'> {profile[0].full_name} </div>
            </div>
        </>
        
        
    }
}

export default Profile;