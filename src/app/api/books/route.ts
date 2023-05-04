import { NextRequest, NextResponse } from "next/server";
import sql from "../db";

export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams

  const type = searchParams.get('type');
  const limit = searchParams.get('limit');


    let query = "SELECT * from books";

    if (type) {
        query += ` WHERE type='${type}'`;
    }

    if (limit) {
        query += ` LIMIT ${limit}`;
      }
  

    const data = await sql.unsafe(query);

    return NextResponse.json(data, { status: 200 });
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
