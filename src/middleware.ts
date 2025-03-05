import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest){
    console.log('middleware is called');
    return NextResponse.next();

}

export const config = {
    matcher: '/:path*'
}