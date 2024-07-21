'use client'

import '@/app/globals.css'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import { User } from '@/types/types';

function UserMessage(props : {question : string, userId : string}) {
    const [user, setUser] = useState<User[]>();

    useEffect(() => {
        async function getUser() {
            const {data} = await supabase.from('profiles').select('*').eq('id', props.userId)
            setUser(data);
        }
        getUser();
    }, [])

    if(!user || user.length === 0) {
        return null
    } else {
        return <div>
            <div className='flex flex-row dark:text-white'>
                <Image src={user[0].profile_image} width={20} height={20} className='mr-2' alt='profile_image'/>
                <div className='font-bold dark:text-white'> You </div>
            </div>
            <div className='mb-6 dark:text-white'>{props.question}</div>
        </div>
    }
}

export default UserMessage;