import '@/app/globals.css'

import { supabase } from '@/utils/supabase/supabase';
import { useState, useEffect } from 'react';
import Link from 'next/link';

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
        return <div className='p-4 bottom-0 fixed overflow-hidden hover:cursor-pointer hover:bg-slate-200 duration-200 border rounded-xl border-none'>
            <Link href={`/profile/${id}`}> <div> {profile[0].full_name} </div> </Link>
        </div>
    }
}

export default Profile;