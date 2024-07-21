import '@/app/globals.css'
import Link from 'next/link';

function ChatOptions(props : {chatHistory: () => void}) {

    const handleChatHistory = () => {
        props.chatHistory();
    }

    return <div className='hidden sm:flex items-start w-auto h-full p-4'>
        <div className='flex flex-row items-center justify-between'>
            <div onClick={handleChatHistory} className='p-2 rounded-lg hover:cursor-pointer hover:bg-slate-200 duration-200 mr-2 dark:hover:bg-slate-600'>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className='dark:text-white'
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M21 20H7V4H21V20ZM19 18H9V6H19V18Z"
                        fill="currentColor"
                    />
                    <path d="M3 20H5V4H3V20Z" fill="currentColor" />
                </svg>
            </div>
            <Link href={'/chat'} className='p-2 rounded-lg hover:cursor-pointer hover:bg-slate-200 duration-200 dark:hover:bg-slate-600'>
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className='dark:text-white'
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 5C3 3.34315 4.34315 2 6 2H14C17.866 2 21 5.13401 21 9V19C21 20.6569 19.6569 22 18 22H6C4.34315 22 3 20.6569 3 19V5ZM13 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V9H13V4ZM18.584 7C17.9413 5.52906 16.6113 4.4271 15 4.10002V7H18.584Z"
                        fill="currentColor"
                    />
                </svg>
            </Link>
        </div>
    </div>
}

export default ChatOptions;