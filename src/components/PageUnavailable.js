import React from 'react';
import {Icon} from 'antd';

const PageUnavailable = () => {
    return (
        <div className='page-unavailable-wrapper'>
            <Icon type='warning' style={{fontSize: '35px', color:'#ff685d'}}/>
            <h2><b>Page is currently under constructions</b></h2>
            <span>For more information please contact <b>cse@innovid.com</b></span>
        </div>
    )
}

export default PageUnavailable;