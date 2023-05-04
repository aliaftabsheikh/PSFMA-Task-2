import { NextRequest, NextResponse } from "next/server";
import sql from "../../db";

type Params = {
  orderId?: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
    try {
        const {orderId} = params
        const userId = JSON.parse(request.headers.get("userId")!);

        const query = `SELECT * from orders WHERE id = ${orderId} AND createdby = ${userId}`;

        const response = await sql.unsafe(query);

        return NextResponse.json(response, {
            status: 200,
          });

    } catch (error: any) {
        console.log(error);

        return NextResponse.json({error: error.message || "Something went wrong"}, {
            status: 500
        })
        
    }
   
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Params }
  ) {
    try {
      const { orderId } = params;
      const { customerName } = await request.json();
      const userId = JSON.parse(request.headers.get("userId")!);
  
      if (!customerName) {
        return NextResponse.json(
          { error: "required fields missing." },
          {
            status: 401,
          }
        );
      }
  
      const query = `
      UPDATE orders
      SET customerName = '${customerName}'
      WHERE id = ${orderId}
      AND createdBy = ${userId}
      returning *
      ;
      `;
  
      const data = await sql.unsafe(query);
  
      return NextResponse.json(data, {
        status: 200,
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
  
  export async function DELETE(
    request: NextRequest,
    { params }: { params: Params }
  ) {
    try {
      const { orderId } = params;
      const userId = JSON.parse(request.headers.get("userId")!);
  
      const query = `DELETE from orders WHERE id = ${orderId} AND createdBy = ${userId}`;
  
      await sql.unsafe(query);
  
      return NextResponse.json(
        { message: "deleted successfully" },
        {
          status: 200,
        }
      );
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