'use client'
import React from 'react';
import { Layout,  theme } from 'antd';
const { Content } = Layout;

function Chat({ params }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { userID } = params;

  return (
    <Content
      style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: '91vh',
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <h1>userID : {userID}</h1>
    </Content>
  );
}

export default Chat;
