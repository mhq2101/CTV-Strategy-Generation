import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react';
import {Layout} from 'antd';
import '../stylesheets/Header.css';

const {Header} = Layout;

const InnoHeader = ({stripped, headerTitle, userData}) => {


    return <React.Fragment>
        {(!stripped) ?
            <Header id="header">
                <div id={"header-content"}>
                    <div id={"header-logo-text"}>
                        <div id="logo"/>
                        <div id="header-txt">
                            {headerTitle}
                        </div>
                    </div>
                    <div id={"header-user"}>
                        Hey {(userData)? userData.firstName : userData.email}
                    </div>
                </div>
            </Header>
            : null}
    </React.Fragment>
}

export default InnoHeader;

InnoHeader.propTypes = {
  stripped: PropTypes.bool
}