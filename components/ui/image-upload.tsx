'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ImagePlus, Trash } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUpload {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
  multiple?: boolean
  className?: string
}

const ImageUpload: React.FC<ImageUpload> = ({
  disabled,
  onChange,
  onRemove,
  value,
  multiple,
  className,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div>
      <div
        className={cn(
          'mb-4 overflow-auto items-center gap-4',
          multiple
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 max-h-[350px]'
            : ''
        )}
      >
        {value.map((url) => (
          <div
            key={url}
            className={cn(
              'relative w-[200px] h-[200px] rounded-md overflow-hidden',
              className
            )}
          >
            <div className='z-10 absolute top-2 right-2'>
              <Button
                type='button'
                onClick={() => onRemove(url)}
                variant='destructive'
                size='icon'
              >
                <Trash className='h-4 w-4' />
              </Button>
            </div>
            <Image
              fill
              className='object-cover'
              alt='Billboard image'
              src={url}
            />
          </div>
        ))}
      </div>
      <CldUploadWidget
        onUpload={onUpload}
        uploadPreset='dskccjgo'
        options={{
          multiple: multiple ?? false,
        }}
      >
        {({ open }) => {
          const onClick = () => {
            open()
          }
          return (
            <Button
              type='button'
              disabled={disabled}
              variant='secondary'
              onClick={onClick}
            >
              <ImagePlus className='h-4 w-4 mr-2' />
              {multiple ?? false ? 'Selecionar imagens' : 'Selecionar imagem'}
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload
