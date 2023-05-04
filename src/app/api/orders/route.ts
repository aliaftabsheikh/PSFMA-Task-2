import { NextRequest, NextResponse } from "next/server";
import sql from "../db";

type Fields = {
  bookId?: string;
  customerName?: string;
};


export async function GET(request: NextRequest){
    try {
        const userId = JSON.parse(request.headers.get("userId")!);

        const query =  `SELECT * from orders WHERE createdBy = ${userId};`

        const response = await sql.unsafe(query);

        return NextResponse.json(response, {status: 200})
    } catch (error) {
        
    }
}

export async function POST(request: NextRequest) {
  try {
    const { bookId, customerName } = (await request.json()) as Fields;
    const userId = JSON.parse(request.headers.get("userId")!);

console.log("USERID", userId);


    if (!bookId || !customerName) {
      return NextResponse.json(
        { error: "required fields missing." },
        {
          status: 403,
        }
      );
    }

    const query = `INSERT INTO "orders" (createdBy, bookId, customerName, quantity)
          VALUES (${userId}, ${bookId}, '${customerName}', 1) returning *`;

    const response = await sql.unsafe(query);

    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { error: error.message || "Somethineg went wrong" },
      {
        status: 500,
      }
    );
  }
}
