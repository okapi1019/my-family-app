// app/api/tasks/[id]/route.ts

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * PUTリクエスト: Taskを更新
 * (例: /api/tasks/123) → { params }: { params: Promise<{ id: string }> } から id を取得
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Next.js 15以降、paramsはPromiseとして扱う
  const { id } = await params

  // リクエストボディ (JSON)
  const { name, cycle } = await request.json()

  // 更新処理
  const updatedTask = await prisma.task.update({
    where: { id: Number(id) },
    data: { name, cycle },
  })

  return NextResponse.json(updatedTask)
}

/**
 * DELETEリクエスト: Taskを削除
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await prisma.task.delete({
    where: { id: Number(id) },
  })

  return NextResponse.json({ message: 'Task deleted' })
}