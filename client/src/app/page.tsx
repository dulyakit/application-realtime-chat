'use client'
import Link from 'next/link'
import styled from 'styled-components'
import { Layout, theme } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Flex, Avatar, Badge, Card } from 'antd'
import userData from '@/constants/userData.json'

const { Content } = Layout

const Home = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const CardRole = styled(Card)`
    &:hover {
      cursor: pointer;
      background-color: lightgray;
    }
  `

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
        <h2 style={{ marginBottom: '20px' }}>โปรดเลือกผู้ส่ง</h2>
        <Flex gap="small" wrap="wrap">
          {userData.map((user) => (
            <CardRole
              key={user.id}
              bordered={false}
              style={{ width: '100vw', textAlign: 'left' }}
            >
              <Link href={`/chat/${user.id}`}>
                <h3>
                  <Avatar shape="square" icon={<UserOutlined />} />
                  <span style={{ marginLeft: '20px' }}>{user.name}</span>
                </h3>
              </Link>
            </CardRole>
          ))}
        </Flex>
      </Content>
    </center>
  )
}

export default Home
