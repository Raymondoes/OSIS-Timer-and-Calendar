import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import db from "@/app/utils/db";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
})

/**
 * Login user
 * @param {Request} req - Next.js Request object
 * @returns {NextResponse} - JSON response with message and status code
 * @throws {NextResponse} - JSON response with error message and status code 400
 * @example
 * const res = await fetch('/api/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email: 'example@example.com', password: 'example' }),
 * });
 * const data = await res.json();
 * console.log(data.message); // "Login berhasil"
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = schema.parse(body);
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 400 });
    }
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 400 });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    // simpan token ke cookie HttpOnly (supaya tidak bisa diakses JS → anti XSS)
    const res = NextResponse.json({ message: "Login berhasil" });
    res.cookies.set("session", token, { httpOnly: true, secure: true, path: "/" });
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
