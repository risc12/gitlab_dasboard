import React from 'react';

const Header = props =>
  <div className='header'>
    <h1><span className='thin'>My</span>Dashboard </h1>
    { props.user ?
        <div className="user thin"> Welcome {props.user.name}</div>
      : null
    }
  </div>

export default Header;
