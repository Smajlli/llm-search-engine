import { NextResponse } from "next/server"
import { CohereClient } from "cohere-ai";
import { supabase } from "@/utils/supabase/supabase";

const cohere = new CohereClient({token: process.env.COHERE_KEY});

export async function POST(req) {
    
    const reqData = await req.formData();

    const question = reqData.get('key');
    const userId = reqData.get('userId');
    const convoId = reqData.get('convoId');

    let chatHistory = [];

    try {
        await supabase.from('chat_history').insert({
            role: "USER",
            message: question,
            user_id: userId,
            convo_id: convoId
        })
    } catch(err) {
        console.log(err)
    }

    try {
        const {data} = await supabase.from('chat_history').select().eq('user_id', userId);
        data.map((res) => {
            return chatHistory.push({role: res.role, message: res.message});
        })
    } catch (err) {
        console.log(err)
    }

    async function response() {
        return cohere.chat({
            chatHistory,
            message: question,
            connectors: [{ id: 'web-search' }]
        })
    }

    return response().then((res) => {
        return NextResponse.json(res.text);
    });
}