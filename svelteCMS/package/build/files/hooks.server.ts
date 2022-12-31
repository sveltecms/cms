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
            // If user is not an admin or root user, redirect home page
            if(auth.role==="user" && pathname!=="/admin/auth/logout" && pathname.startsWith("/admin") ) throw redirect(302,"/")
            const user = auth ; user['_id']=user['_id'].toString()
            event.locals.user = auth
        }
        // Redirect to login page
        else if(pathname!=="/admin/auth" && pathname!=="/"){
            throw redirect(302,"/admin/auth")
        }
    }
    // Else if session do not exists in cookie, redirect to login page
    else if(pathname!=="/admin/auth" && pathname!=="/"){
        throw redirect(302,"/admin/auth")
    }
    const response = await resolve(event);
    return response;
}