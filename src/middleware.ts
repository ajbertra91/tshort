import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith("/api/get-url")) {
    return;
  }

  const slug =  req.nextUrl.pathname.split("/").pop();
  // because prisma uses Rust under the hood. I can't use it here to get the slug.
  // that is why the necessity of the route /api/get-url/ is created.
  const data = await (await fetch(`${req.nextUrl.origin}/api/get-url/${slug}`)).json();

  if (data?.url) {
    return NextResponse.redirect(data.url);
  }
}