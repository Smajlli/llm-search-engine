import { NextResponse } from "next/server";
import { CohereClient } from "cohere-ai";
import { supabase } from "@/utils/supabase/supabase";

const cohere = new CohereClient({token: process.env.COHERE_KEY});

export async function POST(req) {
    const reqData = await req.formData();

    const id = reqData.get('id');

    let chatHistory = [];

    const { data, error } = await supabase.from('chat_history').select('*').eq('convo_id', id);
    data.map(convo => chatHistory.push(convo));
    if(error) {
        console.log(error);
    }

    console.log(chatHistory);

    async function response() {
        return cohere.chat({
            chatHistory,
            message: chatHistory[chatHistory.length - 1].message,
            connectors: [{id: 'web-search'}]
        })
    }

    response().then(res => console.log(res.text))


    return NextResponse.json('ALL GOOD :D')
}