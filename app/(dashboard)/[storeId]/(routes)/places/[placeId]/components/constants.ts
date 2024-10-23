import * as z from 'zod'

export const formSchema = z.object({
  code: z.string().min(1, { message: 'Campo obrigatório' }),
  kidFriendly: z.boolean(),
  hours: z.string().min(1, { message: 'Campo obrigatório' }),
  otherUnits: z.boolean(),
  address: z.string().min(1, { message: 'Campo obrigatório' }),
  label: z.string().min(1, { message: 'Campo obrigatório' }),
  description: z.string().min(1, { message: 'Campo obrigatório' }),
  tip: z.string().min(1, { message: 'Campo obrigatório' }),
  images: z.object({ url: z.string().nullable() }).array(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
})
