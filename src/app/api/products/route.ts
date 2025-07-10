import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();

    const authorization = request.headers.get("Authorization");

    if (!authorization) {
      return NextResponse.json(
        { error: "Authorization header required" },
        {
          status: 401,
          headers: corsHeaders,
        }
      );
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products${
      searchParams ? `?${searchParams}` : ""
    }`;

    const headers: HeadersInit = {
      Authorization: authorization,
      "Content-Type": "application/json",
    };

    let body: string | undefined;
    if (method !== "GET" && method !== "DELETE") {
      body = await request.text();
    }

    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return handleRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, "PUT");
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, "DELETE");
}
