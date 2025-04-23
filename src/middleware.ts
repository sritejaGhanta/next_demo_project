import { NextRequest, NextResponse } from "next/server";
// import { ApiMiddleware } from "./app/api/middleware"

export function middleware(req: NextRequest) {
    // console.log('middleware is called');
    if (req.nextUrl.pathname.startsWith('/api')) {
        // return ApiMiddleware(req)
    }
    return NextResponse.next();

}

export const config = {
    matcher: '/:path*'
}