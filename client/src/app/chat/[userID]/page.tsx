'use client';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout, Col, Row, Cascader, Button, Input, Select, Space } from 'antd';
import userData from '@/constants/userData.json';
import styles from '@/styles/Home.module.css';

const { Content } = Layout;

interface Props {
  params: Params;
}

interface Params {
  userID: string;
}

interface Option {
  value: number;
  label: string;
  children?: Option[];
}

const Chat: React.FC<Props> = ({ params }) => {
  const userRole = userData.find((e) => e.id === parseInt(params?.userID));
  const userOption = userData.filter((e) => e.id !== userRole?.id);

  const [receiver, setReceiver] = useState(0);

  const options: Option[] = userOption.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const onChange = (value: (String | number)[]) => {
    if (value && value?.length !== 0) {
      const selectedValue = parseInt(value[0] as string, 10);
      setReceiver(selectedValue);
    } else {
      setReceiver(0);
    }
  };

  // useEffect(() => {

  // }, []);
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
                  onChange={onChange}
                  placeholder="โปรดเลือกผู้รับ"
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <span>Role: {userRole?.name}</span>
          </Col>
        </Row>
        <Input className={styles.inputText} placeholder="Input Message" />
        {receiver === 0 ? (
          <div className={styles.boxMessage}>
            <div className={styles.contentNotChoose}>
              <span>โปรดเลือกผู้รับ</span>
            </div>
          </div>
        ) : (
          <div className={styles.boxMessage}>
            <div className={styles.contentMessage}>asdasd asdasdasda</div>
          </div>
        )}
      </Content>
    </center>
  );
};

export default Chat;
