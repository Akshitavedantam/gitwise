import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, name, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 }
      );
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username or email already taken." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await prisma.user.create({
      data: {
        username,
        name: name || null, 
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: { id: user.id, username: user.username, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error:" },
      { status: 500 }
    );
  }
}
