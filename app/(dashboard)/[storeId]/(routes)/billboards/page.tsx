import { format } from 'date-fns'

import { getBillboards } from '@/lib/actions/billboard.actions'
import { BillboardClient } from './components/client'
import { BillboardColumn } from './components/columns'

const BillboardsPage = async ({
  params,
}: {
  params: {
    storeId: string
  }
}) => {
  const billboards = await getBillboards(params.storeId)

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    description: item.description ? item.description : '',
    startDate: item.startDate ? item.startDate : undefined,
    endDate: item.endDate ? item.endDate : undefined,
    updatedAt: format(item.updatedAt, 'dd/MM/yyyy'),
    createdAt: format(item.createdAt, 'dd/MM/yyyy'),
  }))

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}

export default BillboardsPage
