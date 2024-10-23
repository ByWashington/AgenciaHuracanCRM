import prismadb from '@/lib/prismadb'
import { PlaceForm } from './components/place-form'

const PlacePage = async ({
  params,
}: {
  params: {
    placeId: string
  }
}) => {
  const place = await prismadb.place.findUnique({
    where: {
      id: params.placeId,
    },
    include: {
      placeDetail: true,
      images: true,
    },
  })

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8'>
        <PlaceForm initialData={place} />
      </div>
    </div>
  )
}

export default PlacePage
