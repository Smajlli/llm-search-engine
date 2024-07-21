import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const allwaysAccessibleRoutes = ['http://localhost:3000/login', 'http://localhost:3000/signup']

    const supabase = createMiddlewareClient({req, res});

    const { data: {session} } = await supabase.auth.getSession();

    if(!session && !allwaysAccessibleRoutes.includes(req.url)) {
        return NextResponse.rewrite(new URL('http://localhost:3000/login'))
    }
    return res;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
}