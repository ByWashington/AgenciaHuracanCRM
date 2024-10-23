import { format } from 'date-fns'

import { getPlace } from '@/lib/actions/place.actions'
import { PlaceClient } from './components/client'
import { PlaceColumn } from './components/columns'

const PlacePage = async ({
  params,
}: {
  params: {
    storeId: string
  }
}) => {
  const place = await getPlace(params.storeId)

  const formattedPlace: PlaceColumn[] = place.map((item) => ({
    id: item.id,
    label: item.placeDetail.label,
    description: item.placeDetail.description,
    tip: item.placeDetail.tip,
    startDate: item.startDate ? item.startDate : undefined,
    endDate: item.endDate ? item.endDate : undefined,
    updatedAt: format(item.updatedAt, 'dd/MM/yyyy'),
    createdAt: format(item.createdAt, 'dd/MM/yyyy'),
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <PlaceClient data={formattedPlace} />
      </div>
    </div>
  )
}

export default PlacePage
