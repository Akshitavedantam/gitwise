import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();

    // 1. Basic validation
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // 3. Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create the user in the database
    // We set hasOnboarded to true immediately if they are registering manually
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: Role.USER,
        hasOnboarded: true, 
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}