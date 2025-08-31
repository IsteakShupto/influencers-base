import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }
}
