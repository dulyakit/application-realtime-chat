import React, { useContext } from 'react'
import { ThemeContext } from '@/app/themeContext';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Layout, Button, theme } from 'antd';
const Head = Layout.Header;

function Header() {
  // const { collapsed, setCollapsed } = useContext(ThemeContext);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Head
      style={{
        padding: 0,
        background: colorBgContainer,
      }}
    >
      {/* <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
        }}
      /> */}
    </Head>
  );
}

export default Header;
