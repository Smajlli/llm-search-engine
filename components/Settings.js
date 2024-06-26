'use client'

import '@/app/globals.css'

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Image from 'next/image';
import avatar from '@/public/Avatar1.svg'
import axios from 'axios';
import PulseLoader from 'react-spinners/PulseLoader'

function Settings({profile, handleSettings}) {
    const [avatarImg, setAvatarImg] = useState('');
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const data = new FormData();

    useEffect(() => {
        async function getUser() {
            const { data } = await supabase.from('profiles').select('*').eq('id', profile.id);
            setUser(data);
        }
        getUser();
    }, [])

    const handleNewAvatar = async () => {
        data.append('user', profile.id);
        setLoading(true);
        setTimeout(() => setLoading(false), 1000)
        try {
            await axios({
                method: 'POST',
                url: '/api/avatar',
                data: data
            }).then(res => setAvatarImg(res.data))
        } catch (err) {
            console.log(err);
        }
    }

    const handleSaveAvatar = async () => {
        try {
            await supabase.from('profiles').update({ profile_image: `/${avatarImg}.svg` }).eq('id', profile.id)
        } catch(err) {
            console.log(err)
        }       
    }

    const deleteChats = async () => {
        try {
            const {error} = await supabase.from('conversations').delete().eq('profile_id', profile.id)
        } catch(error) {
            console.log(error);
        }
    }

    const closeSettings = () => {
        handleSettings();
    }

    return <div className='flex flex-col w-full sm:w-3/4 xl:w-1/3 h-96 bg-white boder-solid border-2 rounded-lg absolute z-20 '>
        <div className='flex flex-row justify-between items-center p-4 border-solid border-b-2'>
            <div className=''>Settings</div>
            <div onClick={closeSettings} className='cursor-pointer hover:bg-slate-100 hover:rounded-full p-2 duration-200'>
                <svg
                    width="18"
                    height="18"
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
        <div className='flex flex-row items-center justify-between p-10 w-full h-full'>
            <div className='flex flex-col h-full justify-evenly grow'>
                <div className='flex justify-center items-center'>
                    {loading ? <div className='h-24 w-24 flex items-center justify-center'> <PulseLoader loading={loading} color={'#000000'} size={10} aria-label="Loading Spinner" data-testid="loader" /> </div> : avatarImg ? <Image src={`/${avatarImg}.svg`} width={100} height={100} alt='profileImage' className='mb-4' /> : <Image src={avatar} width={100} height={100} alt='profileImage' className='mb-4' />}
                </div>
                <button onClick={handleNewAvatar} className='text-xs sm:text-md p-2 border-solid border-2 rounded-lg hover:bg-slate-700 hover:text-white duration-200 mb-2 w-full text-sm'>Generate random avatar</button>
                <button onClick={handleSaveAvatar} className='text-xs sm:text-md p-2 border-solid border-2 rounded-lg hover:bg-slate-700 hover:text-white duration-200 w-full text-sm'>Set as avatar</button>
            </div>
            <div className='flex flex-col justify-center items-start h-full w-8/12 pl-12'>
                <div className='flex flex-col h-full w-full divide-y divide-slate-200'>
                    {user ? <div className='text-xs sm:text-md text-slate-500 flex items-center p-2'>Full Name: {user[0].full_name}</div> : null}
                    {user ? <div className=' text-xs md:text-md text-slate-500 flex items-center p-2'>Username: {user[0].username} </div> : null}
                    <div className=' text-xs md:text-md flex-items-center p-2'>Language: English</div>
                </div>  
                <div className='text-xs sm:text-md flex flex-row justify-between items-center w-full'>
                    <div>Delete all chats</div>
                    <button onClick={deleteChats} className='bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-800'>Delete</button>
                </div>
            </div>
        </div>
    </div>
}

export default Settings;