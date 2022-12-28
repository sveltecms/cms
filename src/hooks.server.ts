import cms from "$Cms"
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
 
export const handle:Handle = async({ event, resolve })=> {
    const session = event.cookies.get("session")
    const pathname = event.url.pathname
    // If session exists in cookies
    if(session){
        const auth = await cms.Auth.isAuth(JSON.parse(session!),event.request)
        if(auth){
            const user = auth ; user['_id']=user['_id'].toString()
            event.locals.user = auth
        }
        const isAuthAndPathAuth = !auth && pathname!=="/auth" && pathname!=="/"
        if(isAuthAndPathAuth){
            throw redirect(302,"/auth")
        }
    }
    // Else if session do not exists in cookie, redirect to login page
    else if(pathname!=="/auth"){
        throw redirect(302,"/auth")
    }
    const response = await resolve(event);
    return response;
}