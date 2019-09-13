import React from 'react';
import {Row, Col, Layout, PageHeader, Typography, Divider, Icon} from 'antd';
import PageUnavailable from './PageUnavailable';
import 'antd/dist/antd.css';
import '../stylesheets/Content.css';

import StrategyGeneration from './StrategyGeneration'
import Home from "./Home"

const {Content} = Layout;
const {Paragraph} = Typography;

const InnoContent = ({isLoading, isPageAvailable, userData}) => {
    return (
        <Content className='content-wrapper'>
            <Row type="flex" justify="center">
                <Col xs={22} sm={20} md={20} lg={20} xl={18}>
                    <div className="main-content main-content-box">
                        {isLoading ? ContentLoader
                            : <React.Fragment>
                                {!isPageAvailable ?
                                    <PageUnavailable/> :
                                    <React.Fragment>{CustomPageHeader}
                                        <Home />
                                    </React.Fragment>
                                }
                            </React.Fragment>
                        }
                    </div>
                </Col>
            </Row>
        </Content>
    );
};

const ContentLoader = (<div>Loading<Icon type="sync" spin style={{marginLeft: "5px"}}/></div>);

const title = (<span><b>Strategy Generation Tool</b></span>);
const CustomPageHeader = (
    <PageHeader title={title} style={{"textAlign": "left", "padding": 0}}>
        <div className="wrap">
            <div className="content">
                <Paragraph>
                    This tool can be used to create a custom strategy for CTV that cannot be made in CMT.
                </Paragraph>
            </div>
        </div>
    </PageHeader>
)

export default InnoContent;