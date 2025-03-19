import { headers } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DefaultRespone } from "@utils/general/general";
import { VerifyJWT } from '../../utils/general/jwt.service';

// This function can be marked `async` if using `await` inside
export async function ApiMiddleware(
  req: NextRequest
) {
  const authorizationToken = req.headers.get('authorization')?.split(' ')?.[1];
  const token: string = (authorizationToken && authorizationToken !== 'null') ? authorizationToken : null;

  const accessUrls: string[] = [
    "/api/auth/user/register",
    "/api/auth/user/login"
  ];
  let tokenData: any = {}

  if (!token && !accessUrls.includes(req.nextUrl.pathname)) {
    DefaultRespone.success = -1;
    DefaultRespone.message = "Unauthorized";
    return NextResponse.json(DefaultRespone.json(), { status: 401 })
  }
  if (token) {
    tokenData = await VerifyJWT(token);
    if (!tokenData.success) {
      DefaultRespone.success = -1;
      DefaultRespone.message = "Unauthorized";
      return NextResponse.json(DefaultRespone.json(), { status: 401 })
    } else {
      req['tokent_params'] = tokenData.data
    }
  }
  return NextResponse.next(tokenData.data);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}