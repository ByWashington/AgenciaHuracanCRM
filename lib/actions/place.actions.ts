'use server'

import { auth } from '@clerk/nextjs/server'
import prismadb from '@/lib/prismadb'
import { PlaceDTO } from '@/types'

export const createPlace = async (placeDto: PlaceDTO) => {
  const { userId } = auth()

  if (!userId) {
    return JSON.stringify({
      status: 401,
      message: 'Unauthenticated',
    })
  }

  if (!placeDto.storeId) {
    JSON.stringify({
      status: 400,
      message: 'Titulo não identificado.',
    })
  }

  if (!placeDto.label) {
    JSON.stringify({
      status: 400,
      message: 'Titulo não identificado.',
    })
  }

  const place = await prismadb.place.create({
    data: {
      storeId: placeDto.storeId,
      code: placeDto.code,
      kidFriendly: placeDto.kidFriendly,
      hours: placeDto.hours,
      otherUnits: placeDto.otherUnits,
      address: placeDto.address,
      startDate: placeDto.startDate,
      endDate: placeDto.endDate,
      images: {
        createMany: {
          skipDuplicates: true,
          data: placeDto.images.map((image) => ({ url: image.url })),
        },
      },
      placeDetail: {
        create: {
          label: placeDto.label,
          description: placeDto.description,
          tip: placeDto.tip,
          language: {
            connect: {
              id: placeDto.language,
            },
          },
        },
      },
    },
  })

  return JSON.stringify({ status: 200, data: place })
}

export const updatePlace = async (placeDto: PlaceDTO) => {
  const { userId } = auth()

  if (!userId) {
    return JSON.stringify({
      status: 401,
      message: 'Unauthenticated.',
    })
  }

  if (!placeDto.storeId) {
    JSON.stringify({
      status: 400,
      message: 'Site não identificado.',
    })
  }

  console.log(placeDto.description)

  await prisma.placeDetails.update({
    where: {
      placeId: placeDto.id,
      languageId: placeDto.language,
    },
    data: {
      label: placeDto.label,
      description: placeDto.description,
      tip: placeDto.tip,
    },
  })

  const store = await prismadb.place.update({
    data: {
      storeId: placeDto.storeId,
      code: placeDto.code,
      kidFriendly: placeDto.kidFriendly,
      hours: placeDto.hours,
      otherUnits: placeDto.otherUnits,
      address: placeDto.address,
      startDate: placeDto.startDate,
      endDate: placeDto.endDate,
    },
    where: {
      id: placeDto.id,
    },
  })

  return JSON.stringify({ status: 200, data: store })
}

export const deletePlace = async (placeId: string) => {
  const { userId } = auth()

  if (!userId) {
    return JSON.stringify({
      status: 401,
      message: 'Unauthenticated.',
    })
  }

  if (!placeId) {
    JSON.stringify({
      status: 400,
      message: 'Banner não identificado.',
    })
  }

  await prismadb.place.delete({
    where: {
      id: placeId,
    },
  })

  return JSON.stringify({ status: 200 })
}

export const getPlace = async (storeId: string, placeId?: string) => {
  const places = await prismadb.place.findMany({
    where: {
      storeId,
      ...(placeId && { id: placeId }),
    },
    include: {
      images: true,
      placeDetail: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return places
}
