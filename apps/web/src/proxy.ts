import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const publicRoutes = ["/login"];
    const { pathname } = request.nextUrl;
    if (publicRoutes.includes(pathname)) return NextResponse.next();

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            headers: {
                cookie: request.headers.get("cookie") || "",
            },
        });

        if (!res.ok) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',]
};
