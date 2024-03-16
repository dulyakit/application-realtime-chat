'use client'
import React from 'react';
import { Layout,  theme } from 'antd';
const { Content } = Layout;

interface Props {
  params: Params;
}

interface Params {
  userID: string;
}

const Chat: React.FC<Props> = ({ params }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { userID } = params;

  return (
    <center>
      <Content
      style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: '91vh',
        maxWidth:'50vw',
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <h1>userID : {userID}</h1>
    </Content>
    </center>
  );
}

export default Chat;