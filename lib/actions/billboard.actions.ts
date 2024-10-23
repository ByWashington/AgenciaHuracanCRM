'use server'

import { auth } from '@clerk/nextjs/server'
import prismadb from '@/lib/prismadb'

export const createBillboard = async (
  storeId: string,
  label: string,
  imageUrl: string,
  startDate: Date | undefined,
  endDate: Date | undefined
) => {
  const { userId } = auth()

  if (!userId) {
    return JSON.stringify({
      status: 401,
      message: 'Unauthenticated',
    })
  }

  if (!storeId) {
    JSON.stringify({
      status: 400,
      message: 'Titulo não identificado.',
    })
  }

  if (!label) {
    JSON.stringify({
      status: 400,
      message: 'Titulo não identificado.',
    })
  }

  const billboard = await prismadb.billboard.create({
    data: {
      storeId,
      label,
      imageUrl,
      startDate,
      endDate,
    },
  })

  return JSON.stringify({ status: 200, data: billboard })
}

export const updateBillboard = async (
  billboardId: string,
  label: string,
  imageUrl: string,
  startDate: Date | undefined,
  endDate: Date | undefined
) => {
  const { userId } = auth()

  if (!userId) {
    return JSON.stringify({
      status: 401,
      message: 'Unauthenticated.',
    })
  }

  if (!label) {
    JSON.stringify({
      status: 400,
      message: 'Titulo não identificado.',
    })
  }

  if (!billboardId) {
    JSON.stringify({
      status: 400,
      message: 'Banner não identificado.',
    })
  }

  const store = await prismadb.billboard.update({
    data: {
      label,
      imageUrl,
      startDate,
      endDate,
    },
    where: {
      id: billboardId,
    },
  })

  return JSON.stringify({ status: 200, data: store })
}

export const deleteBillboard = async (billboardId: string) => {
  const { userId } = auth()

  if (!userId) {
    return JSON.stringify({
      status: 401,
      message: 'Unauthenticated.',
    })
  }

  if (!billboardId) {
    JSON.stringify({
      status: 400,
      message: 'Banner não identificado.',
    })
  }

  await prismadb.billboard.delete({
    where: {
      id: billboardId,
    },
  })

  return JSON.stringify({ status: 200 })
}

export const getBillboards = async (storeId: string, billboardId?: string) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
      ...(billboardId && { id: billboardId }),
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return billboards
}
