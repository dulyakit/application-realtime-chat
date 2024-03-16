import React, { useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ThemeContext } from '@/app/themeContext';
import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
const SideBar = Layout.Sider;

const Sider = () => {
  const router = useRouter();
  const { collapsed } = useContext(ThemeContext);
  const onClick = (id: Number) => {
    router.push(`/chat/${id}`, { scroll: false });
  };
  return (
    <SideBar trigger={null} collapsible collapsed={collapsed}>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['0']}
        items={[
          {
            key: '0',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: () => router.push(`/`, { scroll: false }),
          },
          {
            key: '1',
            icon: <UserOutlined />,
            label: 'nav 1',
            onClick: () => onClick(1),
          },
          {
            key: '2',
            icon: <UserOutlined />,
            label: 'nav 2',
            onClick: () => onClick(2),
          },
        ]}
      />
    </SideBar>
  );
};

export default Sider;
