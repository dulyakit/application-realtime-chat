'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import styled from 'styled-components'
import { Layout, theme } from 'antd'
import { DownloadOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Divider, Flex, Avatar, Badge, Card } from 'antd'
import userData from '@/constants/userData.json'

const { Content } = Layout

const Home = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const router = useRouter()

  const onClick = (id: Number) => {
    router.push(`/chat/${id}`, { scroll: false })
  }

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
        <h2 style={{ marginBottom: '20px' }}>โปรดเลือก Role</h2>
        <Flex gap="small" wrap="wrap">
          {userData.map((user) => (
            <CardRole
              key={user.id}
              bordered={false}
              style={{ width: '100vw', textAlign: 'left' }}
              onClick={() => onClick(user.id)}
            >
              {/* <Badge count={1}> */}
              <h3>
                <Avatar shape="square" icon={<UserOutlined />} />
                <span style={{ marginLeft: '20px' }}>{user.name}</span>
              </h3>
              {/* </Badge> */}
            </CardRole>
          ))}
        </Flex>
      </Content>
    </center>
  )
}

export default Home
