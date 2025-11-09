import { NextResponse } from "next/server";
import { z } from "zod";
import db from "@/app/utils/db"; // sesuaikan path kamu
import bcrypt from "bcryptjs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  username: z.string(),
  code: z.string(),
});

/**
 * Register new user
 * @param {Request} req - Next.js Request object
 * @returns {NextResponse} - JSON response with message and status code
 * @throws {NextResponse} - JSON response with error message and status code 400
 * @example
 * const res = await fetch('/api/register', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email: 'example@example.com', password: 'example', username: 'example', code: '123456' }),
 * });
 * const data = await res.json();
 * console.log(data.message); // "Register berhasil"
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, username, code } = schema.parse(body);
    const existingEmail = await db.user.findUnique({ where: { email } });
    const existingUser = await db.user.findUnique({ where: { username } });
    if (existingUser || existingEmail) {
      return NextResponse.json({ error: "Email and username already exists" }, { status: 400 });
    }
    if (code !== process.env.VERIFICATION_CODE) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.user.create({
      data: { username, email, password: hashed }
    });

    return NextResponse.json({ message: "Register berhasil" });
  } catch (err) {
    return NextResponse.json({ error: "Input tidak valid" }, { status: 400 });
  }
}
