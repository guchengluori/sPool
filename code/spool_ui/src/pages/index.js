import React from 'react';
import Redirect from 'umi/redirect';

const Blank = () => (
  <Redirect to="/Home" />
  // <div style={{ marginTop: '150px', textAlign: 'center' }}>
  //   想要添加更多页面？请使用
  //   <a
  //     href="https://fish.iwhalecloud.com/fish-desktop-x/#/usageFishX"
  //     target="_blank"
  //     rel="noopener noreferrer"
  //   >
  //     fisx-gui脚手架
  //   </a>
  // </div>
);

export default Blank;
