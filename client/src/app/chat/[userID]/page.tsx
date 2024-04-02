'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useMutation, useLazyQuery, gql, useSubscription } from '@apollo/client'
import { Layout, Col, Row, Cascader, Input, Segmented, Tooltip } from 'antd'
import userData from '@/constants/userData.json'
import styles from '@/styles/Home.module.css'

const { Content } = Layout

interface Props {
  params: Params
}

interface Params {
  userID: string
}

interface Option {
  value: number
  label: string
  children?: Option[]
}

interface Message {
  text: string
  sender: Number
  receiver: Number
  createdAt: string
}

const Get_Message = gql`
  query ($sender: Int!, $receiver: Int!) {
    getMessage(sender: $sender, receiver: $receiver) {
      data {
        receiver
        sender
        text
      }
    }
  }
`

const GET_REALTIME_MESSAGE = gql`
  subscription ($sender: Int!, $receiver: Int!) {
    getRealtimeMessage(sender: $sender, receiver: $receiver) {
      data {
        receiver
        sender
        text
      }
    }
  }
`

const CREATE_MESSAGE = gql`
  mutation ($text: String!, $sender: Int!, $receiver: Int!) {
    newMessage(text: $text, sender: $sender, receiver: $receiver) {
      data {
        text
        sender
        receiver
      }
    }
  }
`

const Chat: React.FC<Props> = ({ params }) => {
  const userRole = userData.find((e) => e.id === parseInt(params?.userID))
  const userOption = userData.filter((e) => e.id !== userRole?.id)

  const [receiver, setReceiver] = useState(0)
  const [message, setMessage] = useState([])
  const [inputMessage, setInputMessage] = useState('')

  const [getMessageData, { refetch: refetchGetMessageData }] =
    useLazyQuery(Get_Message)
  const getRealtimeMessage = useSubscription(GET_REALTIME_MESSAGE, {
    variables: {
      sender: userRole?.id,
      receiver: receiver,
    },
  })
  const [createMessage] = useMutation(CREATE_MESSAGE)

  const options: Option[] = userOption.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  const getMessage = useCallback(() => {
    getMessageData({
      variables: {
        sender: userRole?.id,
        receiver: receiver,
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
    })
      .then((res) => {
        const result = res?.data?.getMessage?.data
        setMessage(result)
      })
      .catch((err) => {
        console.log('err: ', err)
      })
    refetchGetMessageData()
  }, [getMessageData, userRole, receiver, setMessage, refetchGetMessageData])

  const changeReceiver = (value: (String | number)[]) => {
    if (value && value?.length !== 0) {
      const selectedValue = parseInt(value[0] as string, 10)
      setReceiver(selectedValue)
    } else {
      setReceiver(0)
    }
  }

  const createNewMessage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (receiver !== 0 && event.key === 'Enter' && inputMessage !== '') {
      createMessage({
        variables: {
          text: inputMessage,
          sender: userRole?.id,
          receiver: receiver,
        },
      })
        .then((res) => {
          setInputMessage('')
        })
        .catch((err) => {
          console.log('err: ', err)
        })
    }
  }

  useEffect(() => {
    const message = getRealtimeMessage?.data?.getRealtimeMessage?.data
    if (message && message.length > 0) {
      setMessage(message)
    }
  }, [getRealtimeMessage])

  useEffect(() => {
    if (receiver !== 0) {
      getMessage()
    }
  }, [receiver, getMessage])

  return (
    <center>
      <Content className={styles.container}>
        <Row>
          <Col span={12}>
            <Row>
              <Col span={12}>
                <div style={{ textAlign: 'right' }}>
                  <span>Chat:</span>
                </div>
              </Col>
              <Col span={12} style={{ textAlign: 'left', paddingLeft: '10px' }}>
                <Cascader
                  options={options}
                  onChange={changeReceiver}
                  placeholder="โปรดเลือกผู้รับ"
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <span>Role: {userRole?.name}</span>
          </Col>
        </Row>
        <Input
          className={styles.inputText}
          value={inputMessage}
          onChange={(event) => setInputMessage(event.currentTarget.value)}
          onKeyDown={createNewMessage}
          placeholder={receiver === 0 ? '' : 'Input Message'}
          disabled={receiver === 0}
        />
        {receiver === 0 ? (
          <div className={styles.boxMessage}>
            <div className={styles.contentNotChoose}>
              <span>โปรดเลือกผู้รับ</span>
            </div>
          </div>
        ) : (
          <div className={styles.boxMessage}>
            {message.map((items: Message, idx: number) => (
              <div
                key={idx}
                className={
                  items.sender === userRole?.id
                    ? styles.contentMessageSend
                    : styles.contentMessageReceiver
                }
              >
                {items.text}
              </div>
            ))}
          </div>
        )}
      </Content>
    </center>
  )
}

export default Chat
