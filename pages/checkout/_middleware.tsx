import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { jwt } from '../../utils';

export async function middleware( req: NextRequest | any, ev: NextFetchEvent ) {
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if ( !session ) {
        const { origin, pathname } = req.nextUrl.clone();
        return NextResponse.redirect(`${ origin }/auth/login?p=${ pathname }`);
        // const requestedPage = req.page.name;
        // return NextResponse.redirect(`/auth/login?p=${ requestedPage }`);
    }

    return NextResponse.next();
}

// export async function middleware( req: NextRequest, ev: NextFetchEvent ) {

//     const { token = '' } = req.cookies;

//     try {
//         await jwt.isValidToken( token );
//         return NextResponse.next();

//     } catch (error) {
//         //Version 12.1
//         const { origin, pathname } = req.nextUrl.clone();
//         return NextResponse.redirect(`${ origin }/auth/login?p=${ pathname }`);
//     }

// }
