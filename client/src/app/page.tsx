'use client';
import { Layout, theme } from 'antd';
import { DownloadOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Avatar, Badge } from 'antd';

const { Content } = Layout;

const Home = (props) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userData = [
    {
      name: 'สมหวัง',
      id: 1,
    },
    {
      name: 'สมหมาย',
      id: 2,
    },
  ];

  return (
    <center>
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          maxHeight: '91vh',
          maxWidth: '50vw',
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Flex gap="small" wrap="wrap">
          {userData.map((user) => (
            <Button
              key={user.id}
              type="primary"
              icon={
                <Badge count={1}>
                  <Avatar shape="square" icon={<UserOutlined />} />
                </Badge>
              }
              size="large"
              style={{ margin: '5px', width: '100vw', textAlign: 'left' }}
              ghost
            >
              <span>{user.name}</span>
            </Button>
          ))}
        </Flex>
      </Content>
    </center>
  );
};

export default Home;
