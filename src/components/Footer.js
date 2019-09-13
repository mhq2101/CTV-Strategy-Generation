import React from 'react';
import {Layout} from 'antd';
import '../stylesheets/Footer.css';

const {Footer} = Layout;

const InnoFooter = (props) => {
    return (
        <React.Fragment>
            {(!props.stripped) ?
                <Footer id={"footer"}>
                    <span>Copyright © Innovid Inc. All Rights Reserved</span><span
                    style={{borderLeft: 'solid 1px'}}>For Internal Use Only</span>
                </Footer>
                : null}
        </React.Fragment>
    );
}

export default InnoFooter;
