'use client';

import '@/app/globals.css'
import React, { createContext, useState } from 'react';
import { Inter } from 'next/font/google';
import { Layout as Layouts } from 'antd';
import Sider from '@/components/layout/sider';
import Header from '@/components/layout/header';

export const ThemeContext = createContext<any>(null);

const inter = Inter({ subsets: ['latin'] });

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ThemeContext.Provider value={{ collapsed, setCollapsed }}>
      <html lang="th">
        <body className={inter.className}>
          <Layouts>
            <Sider />
            <Layouts>
              <Header />
              <div style={{minHeight: '96vh'}}>
              {children}
              </div>
            </Layouts>
          </Layouts>
        </body>
      </html>
    </ThemeContext.Provider>
  );
};

export default Layout;
