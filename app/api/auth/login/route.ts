import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        error: "Email and password required",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json(
        {
          error: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: Number(process.env.JWT_EXPIRES_IN) || 86400 }
    );

    console.log({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error: "Server error",
      },
      { status: 500 }
    );
  }
}
