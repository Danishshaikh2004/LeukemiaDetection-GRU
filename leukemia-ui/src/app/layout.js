import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: 'Leukemia AI',
  description: 'AI-powered leukemia detection system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className={`${geist.className} font-sans antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  )
}