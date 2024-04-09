import { NextResponse } from "next/server"

import conn from "@/lib/db";
import Password from "@/lib/db/models/passwords.model";

export const GET = async () => {
    try {
        await conn();
        const Passwords = await Password.find();
        return new NextResponse(JSON.stringify(Passwords));
    } catch (error) {
        console.error(error);
    }
}

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        await conn();
        const newPassword = new Password(body);
        await newPassword.save();
        return new NextResponse(JSON.stringify(newPassword));
    } catch (error) {
        console.error(error);
    }
}

export const PATCH = async (req: Request) => {
    try {
        const body = await req.json();
        const { id, email, username, password } = body;
        await conn();
        if (!id || !email) {
            return new NextResponse("Missing required fields", { status: 400 });
        }
        const updatedPassword = await Password.findByIdAndUpdate(id, { username, password }, { new: true })
        return new NextResponse(JSON.stringify(updatedPassword));
    } catch (error) {
        console.error(error);
    }
}

export const DELETE = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return new NextResponse("Id is Missing", { status: 400 });
        }
        await conn();
        const deletedPassword = await Password.findByIdAndDelete(id);
        return new NextResponse(JSON.stringify(deletedPassword));
    } catch (error) {
        console.error(error);
    }
}