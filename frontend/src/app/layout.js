import './globals.css'

export const metadata = {
  title: 'Task Manager',
  description: 'A simple task management application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
