import type { Metadata } from 'next'
import '@radix-ui/themes/styles.css'
import { Theme } from '@radix-ui/themes'
import './globals.css'

export const metadata: Metadata = {
  title: 'MedBot Health Management System',
  description: 'A comprehensive health management solution'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <Theme>{children}</Theme>
      </body>
    </html>
  )
}
