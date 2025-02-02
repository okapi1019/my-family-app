import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { taskId, doneBy } = await req.json();
    const comp = await prisma.completion.create({
        data: {
            taskId: Number(taskId),
            doneBy: doneBy || 'me',
        },
    });
    return NextResponse.json(comp);
}
