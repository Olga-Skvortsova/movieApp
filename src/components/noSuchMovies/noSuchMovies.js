import React from 'react';
import { Empty } from 'antd';
import './noSuchMovies.css';

const NoSuchMovies = () => (
  <div className="nomovies-container">
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  </div>
);
export default NoSuchMovies;
