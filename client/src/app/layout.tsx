'use client';

import '@/app/globals.css';
import React from 'react';
import { Inter } from 'next/font/google';
import { Layout as AntdLayout } from 'antd';
import Sider from '@/components/layout/sider';
import Header from '@/components/layout/header';
import { ThemeProvider } from './themeContext';

const inter = Inter({ subsets: ['latin'] });

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <html lang="th">
        <body className={inter.className}>
          <AntdLayout  style={{minHeight: '100vh'}}>
            {/* <Sider /> */}
            <AntdLayout>
              <Header />
              {children}
            </AntdLayout>
          </AntdLayout>
        </body>
      </html>
    </ThemeProvider>
  );
};

export default Layout;