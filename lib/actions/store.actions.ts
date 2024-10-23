'use server'

import { auth } from '@clerk/nextjs/server'
import prismadb from '@/lib/prismadb'

export const createStore = async (name: string) => {
  const { userId } = auth()

  if (!userId) {
    return JSON.stringify({
      status: 401,
      message: 'Unauthenticated',
    })
  }

  if (!name) {
    JSON.stringify({
      status: 400,
      message: 'Nome não identificado.',
    })
  }

  const store = await prismadb.store.create({
    data: {
      name,
      userId,
    },
  })

  return JSON.stringify({ status: 200, data: store })
}

export const updateStore = async (storeId: string, name: string) => {
  const { userId } = auth()

  if (!userId) {
    return JSON.stringify({
      status: 401,
      message: 'Unauthenticated.',
    })
  }

  if (!name) {
    JSON.stringify({
      status: 400,
      message: 'Nome não identificado.',
    })
  }

  if (!storeId) {
    JSON.stringify({
      status: 400,
      message: 'Site não identificado.',
    })
  }

  const store = await prismadb.store.update({
    data: {
      name,
    },
    where: {
      id: storeId,
    },
  })

  return JSON.stringify({ status: 200, data: store })
}

export const deleteStore = async (storeId: string) => {
  const { userId } = auth()

  if (!userId) {
    return JSON.stringify({
      status: 401,
      message: 'Unauthenticated.',
    })
  }

  if (!storeId) {
    JSON.stringify({
      status: 400,
      message: 'Site não identificado.',
    })
  }

  await prismadb.store.delete({
    where: {
      id: storeId,
    },
  })

  return JSON.stringify({ status: 200 })
}
