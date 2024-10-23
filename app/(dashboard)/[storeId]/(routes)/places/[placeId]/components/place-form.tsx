'use client'

import { createElement, Fragment, useState } from 'react'

import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Place, PlaceDetails, PlaceImage } from '@prisma/client'
import { Trash } from 'lucide-react'

import { formSchema } from './constants'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
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
  createPlace,
  deletePlace,
  updatePlace,
} from '@/lib/actions/place.actions'
import { DateTimePicker } from '@/components/ui/datetime'
import dynamic from 'next/dynamic'
import { Spinner } from '@/components/ui/spinner'
import { Checkbox } from '@/components/ui/checkbox'
;('@/components/editor/advanced-editor')

const TailwindAdvancedEditor = dynamic(
  () => import('@/components/editor/advanced-editor'),
  {
    ssr: false,
    loading: () => (
      <div className='h-[500px] flex w-full justify-center items-center rounded-xl'>
        <Spinner />
      </div>
    ),
  }
)

type PlaceFormValues = z.infer<typeof formSchema>

interface PlaceFormProps {
  initialData:
    | (Place & { placeDetail: PlaceDetails } & { images: PlaceImage[] })
    | null
}

export const PlaceForm: React.FC<PlaceFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Editar lugar' : 'Adicionar lugar'
  const description = initialData
    ? 'Editar um lugar'
    : 'Adicionar um novo lugar'

  const toastMessage = initialData ? 'Lugar atualizado.' : 'Lugar adicionado.'
  const action = initialData ? 'Salvar' : 'Adicionar'

  const router = useRouter()
  const params = useParams()

  const form = useForm<PlaceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: initialData?.code ?? '',
      label: initialData?.placeDetail?.label ?? '',
      description: initialData?.placeDetail?.description ?? '',
      tip: initialData?.placeDetail?.tip ?? '',
      hours: initialData?.hours ?? '',
      kidFriendly: initialData?.kidFriendly ?? false,
      otherUnits: initialData?.otherUnits ?? false,
      address: initialData?.address ?? '',
      startDate: initialData?.startDate ?? new Date(),
      endDate: initialData?.endDate ?? new Date(),
      images: initialData?.images ?? [],
    },
  })

  const onSubmit = async (data: PlaceFormValues) => {
    try {
      setLoading(true)

      const place = {
        id: initialData?.id,
        storeId: `${params.storeId}`,
        code: data.code,
        kidFriendly: data.kidFriendly,
        hours: data.hours,
        otherUnits: data.otherUnits,
        address: data.address,
        label: data.label,
        description: data.description,
        tip: data.tip,
        images: data.images,
        startDate: data.startDate,
        endDate: data.endDate,
        language: 'pt-BR',
      }

      let response

      if (initialData?.id) {
        response = JSON.parse(await updatePlace(place))
      } else {
        response = JSON.parse(await createPlace(place))
      }

      if (response.status === 200) {
        toast.success(toastMessage)
        router.push(`/${params.storeId}/places`)
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
      const response = JSON.parse(await deletePlace(initialData.id))

      console.log(response)

      if (response.status === 200) {
        router.push(`/${params.storeId}/Places`)
        toast.success('Lugar excluído.')
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
          <div className='flex flex-col md:grid md:grid-cols-6 gap-4'>
            <FormField
              control={form.control}
              name='images'
              render={({ field }) => (
                <FormItem className='row-start-1 col-span-6'>
                  <FormLabel>Imagens</FormLabel>
                  <FormControl>
                    <ImageUpload
                      multiple={true}
                      value={field.value.map((image) => image.url)}
                      disabled={loading}
                      onChange={(url) =>
                        field.onChange([...field.value, { url }])
                      }
                      onRemove={(url) => {
                        field.onChange([
                          ...field.value.filter(
                            (current) => current.url !== url
                          ),
                        ])
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem className='col-span-1'>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem className='col-span-5'>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='col-span-6'>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <TailwindAdvancedEditor
                      initialValue={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem className='col-span-3'>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='hours'
              render={({ field }) => (
                <FormItem className='col-span-3'>
                  <FormLabel>Horário de atendimento</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tip'
              render={({ field }) => (
                <FormItem className='col-span-6'>
                  <FormLabel>Dica</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='kidFriendly'
              render={({ field }) => (
                <FormItem className='row-start-6 col-span-3 grid-rows-2 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Kid Friendly</FormLabel>
                    <FormDescription>
                      Possui espaço onde as famílias podem frequentar com
                      crianças?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='otherUnits'
              render={({ field }) => (
                <FormItem className='row-start-6 col-span-3 grid-rows-2 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Outras unidades</FormLabel>
                    <FormDescription>Possui outras unidades?</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <FormItem className='row-start-7 col-span-3'>
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
                <FormItem className='row-start-7 col-span-3'>
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
