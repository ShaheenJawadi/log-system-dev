import React from 'react';

const Logo = ({size}:{size:number}) => (
  <svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 944.7 623.7"
    xmlSpace="preserve"
    height= {size}
    width={size}
  >
    <style type="text/css">
      {`
        .st0{fill:#008080;}
        .st1{fill:#F84960;}
        .st2{fill:#BCDDDE;}
      `}
    </style>
    <g id="dots_copy">
      <circle className="st0" cx="150" cy="472.7" r="147.4"></circle>
      <circle className="st1" cx="150" cy="150.8" r="147.4"></circle>
      <circle className="st2" cx="472.3" cy="472.7" r="147.4"></circle>
      <circle className="st2" cx="794.7" cy="472.7" r="147.4"></circle>
    </g>
  </svg>
);

export default Logo;
