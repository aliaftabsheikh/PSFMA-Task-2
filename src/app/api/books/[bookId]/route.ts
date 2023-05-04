import { NextRequest, NextResponse } from "next/server";
import sql from "../../db";

type Params = {
  bookId: string;
};

export async function GET({ params }: { params: Params }) {
  try {
    const { bookId } = params;

    const query = `SELECT * FROM books WHERE id = ${bookId}`;

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
