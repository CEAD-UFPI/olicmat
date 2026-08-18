import { NextRequest, NextResponse } from "next/server";

const EXAM_API_URL =
  process.env.EXAM_API_URL || "http://localhost:3334/api";

async function proxyRequest(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname.replace(/^\/api/, "");
    const backendUrl = `${EXAM_API_URL}${pathname}${url.search}`;

    const headers = new Headers();
    req.headers.forEach((value, key) => {
      // Skip host header — use backend's host
      if (key.toLowerCase() === "host") return;
      // Skip content-length — fetch will set it correctly
      if (key.toLowerCase() === "content-length") return;
      headers.set(key, value);
    });

    const body =
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined;

    const response = await fetch(backendUrl, {
      method: req.method,
      headers,
      body,
    });

    const responseBody = await response.text();
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      // Skip transfer-encoding — NextResponse handles it
      if (key.toLowerCase() === "transfer-encoding") return;
      responseHeaders.set(key, value);
    });

    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("[API Proxy] Backend unreachable:", error.message);
    return NextResponse.json(
      { message: "Serviço de provas temporariamente indisponível. Tente novamente em instantes." },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest) { return proxyRequest(req); }
export async function POST(req: NextRequest) { return proxyRequest(req); }
export async function PUT(req: NextRequest) { return proxyRequest(req); }
export async function PATCH(req: NextRequest) { return proxyRequest(req); }
export async function DELETE(req: NextRequest) { return proxyRequest(req); }
export async function HEAD(req: NextRequest) { return proxyRequest(req); }
export async function OPTIONS(req: NextRequest) { return proxyRequest(req); }
