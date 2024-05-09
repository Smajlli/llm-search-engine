import '@/app/globals.css'

import { supabase } from '@/utils/supabase/supabase';
import { useState, useEffect } from 'react';
import Image from 'next/image';

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
        return <div className=' flex flex-row items-center w-72 p-2 bottom-0 fixed overflow-hidden bg-slate-50 hover:cursor-pointer hover:bg-slate-200 duration-200 border rounded-xl border-none'>
            <Image className='mr-4' src={profile[0].profile_image} width={35} height={35} />
            <div> {profile[0].full_name} </div>
        </div>
    }
}

export default Profile;