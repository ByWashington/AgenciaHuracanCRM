'use client'

import { useState } from 'react'

import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Billboard } from '@prisma/client'
import { Trash } from 'lucide-react'

import { formSchema } from './constants'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { AlertModal } from '@/components/modals/alert-modal'
import ImageUpload from '@/components/ui/image-upload'
import {
  createBillboard,
  deleteBillboard,
  updateBillboard,
} from '@/lib/actions/billboard.actions'
import { DateTimePicker } from '@/components/ui/datetime'

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
  initialData: Billboard | null
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
  initialData,
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Editar banner' : 'Adicionar banner'
  const description = initialData
    ? 'Editar um banner'
    : 'Adicionar um novo banner'

  const toastMessage = initialData ? 'Banner atualizado.' : 'Banner adicionado.'
  const action = initialData ? 'Salvar' : 'Adicionar'

  const router = useRouter()
  const params = useParams()

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    },
  })

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true)

      let response

      if (initialData) {
        response = JSON.parse(
          await updateBillboard(
            initialData.id,
            data.label,
            data.imageUrl,
            data.startDate ?? undefined,
            data.endDate ?? undefined
          )
        )
      } else {
        response = JSON.parse(
          await createBillboard(
            `${params.storeId}`,
            data.label,
            data.imageUrl,
            data.startDate ?? undefined,
            data.endDate ?? undefined
          )
        )
      }

      if (response.status === 200) {
        toast.success(toastMessage)
        router.push(`/${params.storeId}/billboards`)
        router.refresh()
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

  const onDelete = async () => {
    try {
      if (!initialData) {
        return
      }

      setLoading(true)
      const response = JSON.parse(await deleteBillboard(initialData.id))

      console.log(response)

      if (response.status === 200) {
        router.push(`/${params.storeId}/billboards`)
        toast.success('Banner exluído.')
        router.refresh()
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong.')
    } finally {
      setOpen(false)
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
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant='destructive'
            size='sm'
            onClick={() => {
              setOpen(true)
            }}
          >
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <ImageUpload
                      className='w-full h-[400px] object-contain'
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem className='col-span-1'>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Título' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <FormItem className='row-start-3'>
                  <FormLabel>Exibir a partir de</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      displayFormat={{ hour24: 'dd/MM/yyyy HH:mm' }}
                      disabled={loading}
                      value={field.value ?? undefined}
                      onChange={(date) => field.onChange(date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='endDate'
              render={({ field }) => (
                <FormItem className='row-start-3'>
                  <FormLabel>Parar de exibir a partir de</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      displayFormat={{ hour24: 'dd/MM/yyyy HH:mm' }}
                      disabled={loading}
                      value={field.value ?? undefined}
                      onChange={(date) => field.onChange(date)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}
