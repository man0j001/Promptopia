import "@styles/global.css"
import Nav from "@components/Nav"
import Provider from "@components/Provider";
import { Suspense } from 'react'

export const metadata = {
  title: 'Promptlyst',
  description: 'Discover and Share prompts',
}

export default function RootLayout({ children }) {
 return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
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
