'use client'

import { useState } from 'react'

import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Store } from '@prisma/client'
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
import { deleteStore, updateStore } from '@/lib/actions/store.actions'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { AlertModal } from '@/components/modals/alert-modal'

interface SettingsFormProps {
  initialData: Store
}

type SettingsFormValues = z.infer<typeof formSchema>

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true)
      const response = JSON.parse(await updateStore(initialData.id, data.name))

      if (response.status === 200) {
        router.refresh()
        toast.success('Site atualizado.')
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
      setLoading(true)
      const response = JSON.parse(await deleteStore(initialData.id))

      console.log(response)

      if (response.status === 200) {
        router.refresh()
        toast.success('Site exluído.')
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
      <div className='flex items-center justify-between'>
        <Heading title='Configurações' description='Gerenciar sites' />
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
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder='Nome' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className='ml-auto' type='submit'>
            Salvar
          </Button>
        </form>
      </Form>
    </>
  )
}
