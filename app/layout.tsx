import '@/styles/globals.css'
import '@/styles/prosemirror.css'

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import Providers from './providers'
import Script from 'next/script'

const title = 'Things to do'
const description =
  'Things to do é um guia turístico completo, que oferece sugestões dos melhores lugares para visitar. Com dicas de atrações, passeios, restaurantes e experiências únicas, o site é ideal para turistas que buscam explorar novos destinos com facilidade. Descubra o que fazer em cada cidade e planeje sua viagem de forma prática e personalizada!.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  metadataBase: new URL('https://thingstodo.com'),
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl='/'>
      <html lang='pt-Br'>
        <Script src='/scripts/chatwoot.js' />
        <body className='h-full'>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
