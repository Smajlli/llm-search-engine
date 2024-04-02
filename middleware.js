import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req) {
    const res = NextResponse.next();

    const supabase = createMiddlewareClient({req, res});

    const { data: {session} } = await supabase.auth.getSession();

    return res;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}