import { NextResponse } from "next/server"
import { supabase } from "@/utils/supabase/supabase";
import Groq from "groq-sdk";
import axios from "axios";
import { convert } from "html-to-text";

const groq = new Groq({apiKey: process.env.GROQ_KEY});

export async function POST(req) {
    
    const reqData = await req.formData();

    const question = reqData.get('key');
    const userId = reqData.get('userId');
    const convoId = reqData.get('convoId');

    let chatHistory = [];
    let results = [];
    let links = [];
    let requestPromises = [];
    let request = [];

    try {
        await axios.get(`https://www.googleapis.com/customsearch/v1`, {
            params: {
                'q': question,
                'key': process.env.GOOGLE_SEARCH_KEY,
                'cx': process.env.GOOGLE_SEARCH_ENGINE_ID
            }
        }).then(res => results.push(res.data.items))
    } catch (err) {
        console.log(err);
    }

    try {
        await supabase.from('chat_history').insert({
            role: "user",
            content: question,
            user_id: userId,
            convo_id: convoId
        })
    } catch(err) {
        console.log(err)
    }

    try {
        const {data} = await supabase.from('chat_history').select().eq('convo_id', convoId);
        data.map((res) => {
            return chatHistory.push({role: res.role, content: res.content});
        })
    } catch (err) {
        console.log(err)
    }

    /* async function chat() {
        return groq.chat.completions.create({
            messages: chatHistory,
            model: "llama3-8b-8192",
            temperature: 0.5,
            max_tokens: 1024,
            stop: null,
            stream: false,
        });
    }; */

    async function chat() {
        return groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: `I will give you content of different web pages. Can you write me summary of the content focusing only on the main content of given pages and avoiding all brackets, just plain content: ${allContent}`
                }
            ],
            model: "llama3-8b-8192",
            temperature: 0.5,
            max_tokens: 1024,
            stop: null,
            stream: false,
        });
    };

    async function response() {
        const chatCompletion = await chat();
        return NextResponse.json([{answer: chatCompletion.choices[0]?.message?.content, links}]);
    }

    async function getContent() {
        for (let i = 0; i < links.length - 7; i++) {
            requestPromises.push(
                axios.get(links[i]).then((res) => {
                    const htmlContent = res.data;
                    const plainContent = convert(htmlContent, {
                        selectors: [
                            { selector: 'img', format: 'skip' },
                            { selector: 'button', format: 'skip' },
                            { selector: 'aside', format: 'skip' },
                            { selector: 'nav', format: 'skip' },
                            { selector: 'table', format: 'skip' },
                            { selector: 'ol', format: 'skip' },
                            { selector: 'ul', format: 'skip' },
                            { selector: 'wbr', format: 'skip' },
                            { selector: 'a', format: 'skip' },
                            { selector: 'article', format: 'skip' },
                            { selector: 'footer', format: 'skip' },
                            { selector: 'form', format: 'skip' },
                            { selector: 'blockquote', format: 'skip' },
                            { selector: 'pre', format: 'skip' }
                        ]
                    });
                    return plainContent;
                })
            );
        }
        request = await axios.all(requestPromises);
        return request;
    }

    results[0].map((r) => {
        links.push(r.link);
    });

    await getContent();

    const allContent = request.toString();
    links.toString();
    

    return response()
}