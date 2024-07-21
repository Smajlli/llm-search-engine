export type Answer = {
    answer?: string,
    links?: string[],
}

export type ResponseType = { 
    question?: string, 
    answer?: string, 
    links?: string[]
}

export type User = {
    id?: string, 
    email?: string, 
    username?: string,
    full_name?: string,
    profile_image?:string,
}

export type Conversations = {
    id?: string,
    title?: string, 
    created_at?: string,
    profile_id?: string,
}

export type ChatHistory = {
    role: string, 
    content: string,
}

export type Logo = { value?: number }

export type Dialog = {
    id? : string,
    question? : string,
    answer? : string,
    links? : string[],
    conversation_id? : string,
}