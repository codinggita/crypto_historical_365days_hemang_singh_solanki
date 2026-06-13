import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './PageContainer.css';

const PageContainer = ({ children, title }) => {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <div className="main-wrapper">
        <Header title={title} />
        <main className="main-content">
          <div className="content-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PageContainer;
