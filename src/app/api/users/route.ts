import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/api/auth/auth";
import { fetcher } from "@/api/xhr";
import { HTTPResponse, UsersResponse, CreateUserData } from "@/types/global";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    const apiUrl = "/staff";

    const response = await fetcher<HTTPResponse<UsersResponse>>(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied. Admin role required." },
        { status: 403 }
      );
    }

    const userData: CreateUserData = await request.json();

    userData.role = "staff";

    const response = await fetcher<HTTPResponse>("/register", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
