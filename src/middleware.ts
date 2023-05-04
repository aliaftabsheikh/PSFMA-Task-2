import { NextRequest, NextResponse } from "next/server";



export async function verifyAuth(token: string, url: string) {
    try {
      const response = await fetch(`http://${url}/api/users`, {
        method: "POST",
        body: JSON.stringify({ token }),
      });
  
      const decodedUser = await response.json();

      
  
      return decodedUser;
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }
export async function middleware(request: NextRequest) {
  try {
    const authToken = request.headers.get("authorization")?.split(" ")[1];
    const url = request.headers.get("host")!;


    if (!authToken) {
      return NextResponse.json(
        { error: "not permitted" },
        {
          status: 401,
        }
      );
    }

    const decodedUser = await verifyAuth(authToken, url);

    const headers = new Headers(request.headers);
    headers.set("userId", JSON.stringify(decodedUser.id));

    return NextResponse.next({ headers });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}

export const config = {
  matcher: ["/api/orders/:path*"],
};
