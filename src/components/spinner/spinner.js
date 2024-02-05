import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import './spinner.css';

const Spinner = () => (
  <div className="spinner-container">
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 24,
          }}
          spin
        />
      }
    />
  </div>
);

export default Spinner;
