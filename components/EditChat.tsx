import '@/app/globals.css'

import { supabase } from '@/utils/supabase/supabase';

function EditChat(props : {id : string, handleEdit : () => void}) {

    const handleDelete = async () => {
        const {error} = await supabase.from('conversations').delete().eq('id', props.id);
        if(error) {
            console.log(error)
        }
        props.handleEdit();
        location.reload()
    }

    return <div className='block hover:cursor-pointer'>
        <div onClick={handleDelete} className='flex flex-row items-center text-red-500 text-xs hover:bg-slate-200 dark:hover:bg-slate-700 hover:rounded-lg p-2'>
            <div className='mr-2'>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17 5V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V5H4C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H5V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V7Z"
                        fill="currentColor"
                    />
                    <path d="M9 9H11V17H9V9Z" fill="currentColor" />
                    <path d="M13 9H15V17H13V9Z" fill="currentColor" />
                </svg>
            </div>
            <div>Delete</div>
        </div>
    </div>
}

export default EditChat;