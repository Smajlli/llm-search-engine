import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    const reqData = await req.formData();

    const question = reqData.get('key');
    let results = [];
    let links = [];

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

   async function getContent(url) {
        try {
            await axios.get(url).then(res => console.log(res.data));
        } catch (err) {
            console.log(err)
        }
    }

    results[0].map((r) => {
        getContent(r.link);
    });


    return NextResponse.json('ALL GOOD :D')
}