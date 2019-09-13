import React, { useState, useEffect, useRef } from 'react';
import { Icon, Button, Divider, Popover, Collapse, Card } from 'antd';
import '../stylesheets/StrategyGeneration.css';


const AllOperators = (props) => {

    const { strategyIndex, ruleIndex, parameter, addSubRuleParameterOperator } = props;
    console.log(props)

    const [operatorContent, setOperatorContent] = useState({
        ">": <div>Greater Than</div>,
        "<": <div>Less Than</div>,
        "<=": <div>Less Than or Equal To</div>,
        ">=": <div>Greater Than or Equal To</div>,
        "=": <div>Equal To</div>,
        "!=": <div> NOT Equal To</div>,
        "in": <div> Equal To Any One Of The Values In A List</div>,
        "!in": <div> NOT Equal To Any One Of The Values In A List </div>


    })

    const [operators, setOperators] = useState({
        "<": <Popover content={operatorContent["<"]}>
            <Button onClick={() => {
                addSubRuleParameterOperator(strategyIndex, ruleIndex, parameter, "<")
            }}><Icon type="left" /></Button>
        </Popover>,
        ">": <Popover content={operatorContent[">"]}>
            <Button onClick={() => {
                addSubRuleParameterOperator(strategyIndex, ruleIndex, parameter, ">")
            }}><Icon type="right" /></Button>
        </Popover>,
        "<=": <Popover content={operatorContent["<="]}>
            <Button onClick={() => {
                addSubRuleParameterOperator(strategyIndex, ruleIndex, parameter, "<=")
            }}><div className="closeTogether"><Icon type="left" /><Icon type="pause" rotate={90} /></div></Button>
        </Popover>,
        ">=": <Popover content={operatorContent[">="]}>
            <Button onClick={() => {
                addSubRuleParameterOperator(strategyIndex, ruleIndex, parameter, ">=")
            }}><div className="closeTogether"><Icon type="right" /><Icon type="pause" rotate={90} /></div></Button>
        </Popover>,
        "=": <Popover content={operatorContent["="]}>
            <Button onClick={() => {
                addSubRuleParameterOperator(strategyIndex, ruleIndex, parameter, "=")
            }}><Icon type="pause" rotate={90} /></Button>
        </Popover>,
        "!=": <Popover content={operatorContent["!="]}>
            <Button onClick={() => {
                addSubRuleParameterOperator(strategyIndex, ruleIndex, parameter, "!=")
            }}><div className="closeTogether"><Icon type="exclamation" /><Icon type="pause" rotate={90} /></div></Button>
        </Popover>,
        "in": <Popover content={operatorContent["in"]}>
            <Button onClick={() => {
                addSubRuleParameterOperator(strategyIndex, ruleIndex, parameter, "in")
            }}><div className="grey">IN</div></Button>
        </Popover>,
        "!in": <Popover content={operatorContent["!in"]}>
            <Button onClick={() => {
                addSubRuleParameterOperator(strategyIndex, ruleIndex, parameter, "!in")
            }}><div className="grey">! IN</div></Button>
        </Popover>

    });

    return (
        <div className="operators">
            {
                Object.keys(operators).map(operator => {
                    return (
                        <div >
                            {operators[operator]}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default AllOperators;