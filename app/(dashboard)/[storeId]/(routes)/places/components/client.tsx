'use client'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { PlaceColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'

interface PlaceClientProps {
  data: PlaceColumn[]
}

export const PlaceClient: React.FC<PlaceClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Lugares (${data.length})`}
          description='Gerencie os lugares do seu site'
        />
        <Button onClick={() => router.push(`/${params.storeId}/places/new`)}>
          <Plus className='mr-2 h-4 w-4' />
          Adicionar
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey='label' />
    </>
  )
}
