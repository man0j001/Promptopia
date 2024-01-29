import "@styles/global.css"
import Nav from "@components/Nav"
import Provider from "@components/Provider";
import { Suspense } from 'react'

export const metadata = {
  title: 'Promptopia',
  description: 'Discover and Share prompts',
}

export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>
      <Provider>
        <div className="main">
          <div className="gradient"/>
        </div>
        <main className="app">
          
          <Nav/>
          <Suspense>
          {children}
          </Suspense>
        </main>
      </Provider>
      </body>
    </html>
  )
}
