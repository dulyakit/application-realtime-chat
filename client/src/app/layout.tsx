'use client'

import '@/styles/globals.css'
import React from 'react'
import { ApolloProvider } from '@apollo/client/react'
import { Inter } from 'next/font/google'
import { Layout as AntdLayout } from 'antd'
import Header from '@/components/layout/header'
import client from '@/lib/initApollo'

const inter = Inter({ subsets: ['latin'] })

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="th">
      <body className={inter.className}>
        <ApolloProvider client={client}>
          <AntdLayout style={{ minHeight: '100vh' }}>
            <AntdLayout>
              <Header />
              {children}
            </AntdLayout>
          </AntdLayout>
        </ApolloProvider>
      </body>
    </html>
  )
}

export default Layout
