import sql from "../db";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    console.log("user", process.env.ACCESS_TOKEN_SECRET);
    

    const decodedToken = verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as Record<string, string>;

    const query = `SELECT * from users WHERE email = '${decodedToken.email}'`;

    const decodedUser = await sql.unsafe(query);

    return NextResponse.json(decodedUser[0]);
  } catch (error) {
    console.log(error);
    throw new Error("You are not permitted");
  }
}
