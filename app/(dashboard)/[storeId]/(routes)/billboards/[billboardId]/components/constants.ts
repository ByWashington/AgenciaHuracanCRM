import * as z from 'zod'

export const formSchema = z.object({
  label: z.string().min(1, { message: 'Campo obrigatório' }),
  imageUrl: z.string().min(1, { message: 'Campo obrigatório' }),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
})
