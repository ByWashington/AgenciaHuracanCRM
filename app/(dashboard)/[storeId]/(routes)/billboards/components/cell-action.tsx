'use client'

import { useParams, useRouter } from 'next/navigation'

import { BillboardColumn } from './columns'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { deleteBillboard } from '@/lib/actions/billboard.actions'
import { AlertModal } from '@/components/modals/alert-modal'

interface CellActionProps {
  data: BillboardColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const params = useParams()

  const onDelete = async () => {
    try {
      setLoading(true)
      const response = JSON.parse(await deleteBillboard(data.id))

      if (response.status === 200) {
        router.refresh()
        toast.success('Banner exluído.')
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false)
        }}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className='flex gap-2'>
        <Button
          variant='default'
          size='icon'
          onClick={() =>
            router.push(`/${params.storeId}/billboards/${data.id}`)
          }
        >
          <Edit className='h-4 w-4' />
        </Button>
        <Button variant='destructive' size='icon' onClick={() => setOpen(true)}>
          <Trash className='h-4 w-4' />
        </Button>
      </div>
    </>
  )
}
