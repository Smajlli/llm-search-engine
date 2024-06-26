'use client'

import '@/app/globals.css'

import { useState } from 'react';
import { supabase } from '@/utils/supabase/supabase';
import Image from 'next/image';
import avatar from '@/public/Avatar1.svg'
import axios from 'axios';
import PulseLoader from 'react-spinners/PulseLoader'

function EditAvatar({profile}) {
    const [avatarImg, setAvatarImg] = useState('');
    const [loading, setLoading] = useState(false);
    const data = new FormData();

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

    return <div className='flex flex-col items-center justify-evenly w-60 h-52 bg-white boder-solid border-2 rounded-lg absolute z-10'>
        <div className='flex justify-center items-center'>
            {loading ? <div className='h-24 w-24 flex items-center justify-center'> <PulseLoader loading={loading} color={'#000000'} size={10} aria-label="Loading Spinner" data-testid="loader" /> </div> : avatarImg ? <Image src={`/${avatarImg}.svg`} width={100} height={100} alt='profileImage' /> : <Image src={avatar} width={100} height={100} alt='profileImage' />}
        </div>
        <button onClick={handleNewAvatar} className='p-2 border-solid border-2 rounded-lg hover:bg-slate-700 hover:text-white duration-200'>Generate random avatar</button>
        <button onClick={handleSaveAvatar} className='p-2 border-solid border-2 rounded-lg hover:bg-slate-700 hover:text-white duration-200'>Set as avatar</button>
    </div>
}

export default EditAvatar;