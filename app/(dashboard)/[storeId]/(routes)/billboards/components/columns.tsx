'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns'

export type BillboardColumn = {
  id: string
  label: string
  description: string
  createdAt: string
  startDate: Date | undefined
  endDate: Date | undefined
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: 'Título',
  },
  {
    accessorKey: 'startDate',
    header: () => <span className='hidden md:block'>Exibir a partir de</span>,
    cell: ({ row }) => (
      <span className='hidden md:block'>
        {row.original.startDate
          ? format(row.original.startDate, 'dd/MM/yyyy HH:mm')
          : ''}
      </span>
    ),
    meta: { hideOnMobile: true },
  },
  {
    accessorKey: 'endDate',
    header: () => (
      <span className='hidden md:block'>Parar de exibir a partir de</span>
    ),
    cell: ({ row }) => (
      <span className='hidden md:block'>
        {row.original.endDate
          ? format(row.original.endDate, 'dd/MM/yyyy HH:mm')
          : ''}
      </span>
    ),
    meta: { hideOnMobile: true },
  },
  {
    id: 'Exibido',
    header: 'Exibindo',
    cell: ({ row }) => (
      <Checkbox
        checked={
          row.original.startDate ? row.original.startDate < new Date() : false
        }
      />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
