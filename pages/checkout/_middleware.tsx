import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { jwt } from '../../utils';


export async function middleware( req: NextRequest, ev: NextFetchEvent ) {

    const { token = '' } = req.cookies;

    try {
        await jwt.isValidToken( token );
        return NextResponse.next();

    } catch (error) {
        //Version < 12.0.0
        // return Response.redirect('/auth/login');
        //Version 12.0.0
        // const requestedPage = req.page.name;
        // return NextResponse.redirect(`/auth/login?p=${ requestedPage }`);

        //Version 12.1
        const { origin, pathname } = req.nextUrl.clone();
        return NextResponse.redirect(`${ origin }/auth/login?p=${ pathname }`);
    }

}
