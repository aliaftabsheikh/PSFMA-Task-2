import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import sql from "../db";

type Fields = {
  clientName?: string;
  clientEmail?: string;
};

// submit a new order
export async function POST(request: NextRequest) {
  try {
    const { clientName, clientEmail } = (await request.json()) as Fields;

    if (!clientName || !clientEmail) {
      return NextResponse.json(
        { error: "required fields missing." },
        {
          status: 401,
        }
      );
    }

    const query = `INSERT INTO "users" (name, email) VALUES ('${clientName}', '${clientEmail}') returning *`;
    await sql.unsafe(query);

    const accessToken = jwt.sign(
      {
        email: clientEmail,
      },
      process.env.ACCESS_TOKEN_SECRET || "",
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      { accessToken },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { error: "API client already registered." },
      {
        status: 409,
      }
    );
  }
}
