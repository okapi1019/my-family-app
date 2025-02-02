import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
    const {name, cycle} = await req.json();
    const newTask = await prisma.task.create({
        data: {
            name,
            cycle: Number(cycle) || 7,
        },
    });
    return NextResponse.json(newTask);
}

