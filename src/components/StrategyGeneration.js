import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux"
import '../stylesheets/StrategyGeneration.css';
import { } from '../redux/index'
import { Icon, Button, Divider, Tag, Popover, Collapse, Card, Select, DatePicker, InputNumber, TimePicker, Menu, Upload, message, List, Typography, Form, Modal, Table } from 'antd';
import AllOperators from "./AllOperators.js"
import { Input } from 'antd';
import moment from 'moment';
import axios from "axios";
import randomstring from "randomstring";
import copy from 'clipboard-copy';
const InputGroup = Input.Group;
const { Search } = Input;
const { Panel } = Collapse
const { Option } = Select;
const { SubMenu } = Menu;

const StrategyGeneration = (props) => {
    let defaultStrategies = [{
        version_id: "pending",
        version_name: "default",
        rules: [],
        assets: {}
    }]
    let defaultCampaign = null;
    let defaultAssetTypes = [];
    let defaultParameters = {};
    let defaultStrategyHash = randomstring.generate(6)
    let defaultOverwritable = false;
    let defaultUrlResponse = null;

    if (props.json) {
        defaultStrategies = props.json.decisioning
        defaultParameters = props.json.parameters
        if (props.json.decisioning[0]) {
            defaultAssetTypes = Object.keys(props.json.decisioning[0].assets)
        }
        if (props.json.campaign) {
            defaultCampaign = props.json.campaign
        }
        if (props.json.strategyHash) {
            defaultStrategyHash = props.json.strategyHash
            
        }
        if (props.overwritable) {
            defaultOverwritable = true;
        }
        if (props.json.urlResponse) {
            defaultUrlResponse = props.json.urlResponse
        }
    }


    const [parameters, setParameters] = useState(defaultParameters)
    const [validateMessage, setValidateMessage] = useState("")
    const [timeout, setTheTimeout] = useState(0);
    const [hashValidate, setHashValidate] = useState("")
    const [urlResponse, setUrlResponse] = useState(defaultUrlResponse)
    const [campaign, setCampaign] = useState(defaultCampaign)
    const [strategyHash, setStrategyHash] = useState(defaultStrategyHash)
    const [assetTypes, setAssetTypes] = useState(defaultAssetTypes)
    const [strategies, setStrategies] = useState(defaultStrategies)
    const [activeOverride, setActiveOverride] = useState(0)
    const [modal, setModal] = useState(null)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [assetField, setAssetField] = useState("")
    const [overwritable, setOverwritable] = useState(defaultOverwritable)
    const [changesMade, setChangesMade] = useState(false)

    function useInterval(callback, delay) {
        const savedCallback = useRef();
      
        // Remember the latest callback.
        useEffect(() => {
          savedCallback.current = callback;
        }, [callback]);
      
        // Set up the interval.
        useEffect(() => {
          function tick() {
            savedCallback.current();
          }
          if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
          }
        }, [delay]);
      }

    useEffect(() => {
        const fullJson = {
            "campaign": campaign,
            "databash_hash": strategyHash,
            "parameters": parameters,
            "decisioning": strategies,
            "strategyHash": strategyHash
        }
        sessionStorage.setItem("innovid-smart-strategy", JSON.stringify(fullJson))
        setChangesMade(true)
    }, [strategies, campaign])

    



    function handleDefineAssetTypes(type) {
        const assetTypesCopy = [...assetTypes];
        const strategiesCopy = [...strategies];
        assetTypesCopy.push(type)
        for (const strategy of strategiesCopy) {
            for (const type of assetTypesCopy) {
                if (!strategy.assets[type]) {
                    strategy.assets[type] = ""
                }

            }
        }
        setStrategies(strategiesCopy)
        setAssetTypes(assetTypesCopy)
    }



    function addStrategyHandler() {
        const strategiesCopy = [...strategies]
        const tempObj = {
            version_id: "pending",
            version_name: "",
            rules: [{}],
            assets: {},
            editingName: true
        }
        if (assetTypes[0]) {
            for (const assetType of assetTypes) {
                tempObj["assets"][assetType] = ""
            }
        }

        strategiesCopy.splice(strategiesCopy.length - 1, 0, tempObj)
        setStrategies(strategiesCopy)
    }



    function temperatureValidate(arr) {
        const operatorOne = arr[0][0]
        const valueOne = parseInt(arr[0][1])
        const operatorTwo = arr[1][0]
        const valueTwo = parseInt(arr[1][1])
        let comparisonValue;

        switch (operatorOne) {
            case "<":
                comparisonValue = valueOne - 1
                break;
            case "<=":
                comparisonValue = valueOne - 1
                break;
            case ">=":
                comparisonValue = valueOne + 1
                break;
            case ">":
                comparisonValue = valueOne + 1
                break;
            case "!=":
                comparisonValue = valueOne + 1
                break;
            case "=":
                comparisonValue = valueOne;
        }

        switch (operatorTwo) {
            case "<":
                if (comparisonValue >= valueTwo) {
                    return false
                }
                break;
            case "<=":
                if (comparisonValue > valueTwo) {
                    return false
                }
                break;
            case ">=":
                if (comparisonValue < valueTwo) {
                    return false
                }
                break;
            case ">":
                if (comparisonValue <= valueTwo) {
                    console.log(comparisonValue, valueTwo)
                    return false;
                }
                break;
            case "!=":
                if (comparisonValue == valueTwo) {
                    return false;
                }
                break;
            case "=":
                if (comparisonValue != valueTwo) {
                    return false
                }
                break;

        }
        return true;

    }



    function timeValidate(arr) {
        const operatorOne = arr[0][0]
        const valueOne = new Date()
        valueOne.setHours(parseInt(arr[0][1].split(":")[0]));
        valueOne.setMinutes(parseInt(arr[0][1].split(":")[1]));
        const operatorTwo = arr[1][0]
        const valueTwo = new Date()
        valueTwo.setHours(parseInt(arr[1][1].split(":")[0]));
        valueTwo.setMinutes(parseInt(arr[1][1].split(":")[1]));
        let comparisonValue;

        switch (operatorOne) {
            case "<":
            case "<=":
                comparisonValue = new Date(new Date(valueOne).getTime() - (60 * 1000));
                break;
            case ">=":
            case ">":
            case "!=":
                comparisonValue = new Date(new Date(valueOne).getTime() + (60 * 1000));
                break;

            case "=":
                comparisonValue = new Date(valueOne);
                break;
        }

        switch (operatorTwo) {
            case "<":
                if (comparisonValue >= valueTwo) {
                    return false
                }
                break;
            case "<=":
                if (comparisonValue > valueTwo) {
                    return false
                }
                break;
            case ">=":
                if (comparisonValue < valueTwo) {
                    return false
                }
                break;
            case ">":
                if (comparisonValue <= valueTwo) {
                    return false;
                }
                break;
            case "!=":
                if (comparisonValue.getTime() == valueTwo.getTime()) {
                    return false;
                }
                break;
            case "=":
                if (comparisonValue.getTime() != valueTwo.getTime()) {
                    return false
                }
                break;

        }

        return true;

    }
    function dateValidate(arr) {
        const operatorOne = arr[0][0]
        const valueOne = new Date(arr[0][1])
        const operatorTwo = arr[1][0]
        const valueTwo = new Date(arr[1][1])
        let comparisonValue;

        switch (operatorOne) {
            case "<":
            case "<=":
                comparisonValue = new Date(new Date(valueOne).getTime() - 60 * 60 * 24 * 1000);
                break;
            case ">=":
            case ">":
            case "!=":
                comparisonValue = new Date(new Date(valueOne).getTime() + 60 * 60 * 24 * 1000);
                break;

            case "=":
                comparisonValue = new Date(valueOne);
                break;
        }

        switch (operatorTwo) {
            case "<":
                if (comparisonValue >= valueTwo) {
                    return false
                }
                break;
            case "<=":
                if (comparisonValue > valueTwo) {
                    return false
                }
                break;
            case ">=":
                if (comparisonValue < valueTwo) {
                    return false
                }
                break;
            case ">":
                if (comparisonValue <= valueTwo) {
                    return false;
                }
                break;
            case "!=":
                if (comparisonValue.getTime() == valueTwo.getTime()) {
                    return false;
                }
                break;
            case "=":
                if (comparisonValue.getTime() != valueTwo.getTime()) {
                    return false
                }
                break;

        }

        return true;

    }
    const validationFunctions = {
        "date": dateValidate,
        "temperature": temperatureValidate
    }
    function verifyOverrite () {
        if (overwritable) {
            setModal({
                custom: 1,
                content:  <Modal
                visible={true}
                footer={[
                    <Button key="new" onClick={() => {
                        setModal(null)
                    }}>
                        Cancel
                    </Button>,
                  <Button key="new" type="primary" onClick={() => {
                      const hash = randomstring.generate(6)
                      submissionValidation(hash)
                  }}>
                    Publish New Strategy
                  </Button>,
                  <Button key="overrite" type="danger" onClick={() => {
                      submissionValidation(strategyHash)
                  }}>
                    Overwrite Strategy ({strategyHash})
                  </Button>,
                ]}
              >
                <p>Would you like to publish a new strategy or overrite the existing one ({strategyHash})? Please exert caution when overwriting live strategies </p>
                
              </Modal>
            })
        }
        else {
            submissionValidation(strategyHash)
        }
        
    }
    async function submissionValidation(hash) {
        const tempErrors = [];
        const tempWarnings = [];
        if (!campaign || isNaN(parseInt(campaign))) {
            tempErrors.push("No campaign ID found. Please Enter the 5 digit Campaign ID associated with this strategy")
        }
        for (const [strategyIndex, strategy] of strategies.entries()) {
            for (const asset of (Object.keys(strategy.assets))) {
                if (!strategy.assets[asset]) {
                    tempErrors.push(`Empty URL - Version: ${strategy["version_name"]}, Asset type: ${asset}`)
                }
                if (!strategy["version_name"]) {
                    tempErrors.push("Empty Version name - Version at position " + strategyIndex + 1)
                }

            }
            if (strategy["version_name"].indexOf("default") < 0) {
                for (const [ruleIndex, rule] of strategy.rules.entries()) {
                    for (const parameter of Object.keys(rule)) {
                        if (rule[parameter].length == 2) {
                            switch (parameter) {
                                case "date":
                                    if (!dateValidate(rule[parameter])) {
                                        tempErrors.push(`Invalid Date Range - Version: ${strategy["version_name"]}, Rule: ${ruleIndex + 1}`)
                                    }
                                    break;
                                case "time":
                                    if (!timeValidate(rule[parameter])) {
                                        tempErrors.push(`Invalid Time Range - Version: ${strategy["version_name"]}, Rule: ${ruleIndex + 1}`)
                                    }
                                    break;
                                case "temperature":
                                    if (!temperatureValidate(rule[parameter])) {
                                        tempErrors.push(`Invalid Temperature Range - Version: ${strategy["version_name"]}, Rule: ${ruleIndex + 1}`)
                                    }
                                    break;
                            }

                        }
                        let emptyError = false
                        for (const parameterValue of rule[parameter]) {
                            if (!parameterValue[0] || !parameterValue[1]) {
                                emptyError = true
                            }
                        }
                        if (emptyError) {
                            tempErrors.push(`Empty Definition - Version: ${strategy["version_name"]}, Rule: ${ruleIndex + 1}, Parameter: ${parameter}`)
                        }
                    }
                }
            }
        }
        if (tempErrors.length) {
            setModal({
                errors: tempErrors
            })
            return
        }
        else {
            await generateVersionIds(hash)
            setModal({
                "id_generation": 1,
                messages: [
                    "Submitting Strategy"
                ]
            })
            await handleSubmitStrategy(hash)
            setConfirmLoading(false)
            setModal(null)
        }







    }




    function removeStrategyHandler(strategyIndex) {
        const strategiesCopy = [...strategies]
        delete strategiesCopy[strategyIndex]
        var newStrategies = strategiesCopy.filter(value => {
            if (value) {
                return true;
            }
        })
        setStrategies(newStrategies)


    }

    function editStrategyName(strategyIndex) {
        const strategiesCopy = [...strategies];
        strategiesCopy[strategyIndex]["editingName"] = true;
        setStrategies(strategiesCopy);
    }

    function handleChangeVersionName(strategyIndex, name) {
        const strategiesCopy = [...strategies];
        strategiesCopy[strategyIndex]["version_name"] = name;
        delete strategiesCopy[strategyIndex]["editingName"]
        setStrategies(strategiesCopy)
    }

    function removeRuleHandler(strategyIndex, ruleIndex) {
        const strategiesCopy = [...strategies]
        strategiesCopy[strategyIndex].rules.splice(ruleIndex, ruleIndex + 1)
        setStrategies(strategiesCopy)

    }

    function removeSubRuleHandler(strategyIndex, ruleIndex, parameter) {
        const strategiesCopy = [...strategies]
        delete strategiesCopy[strategyIndex].rules[ruleIndex][parameter]
        setStrategies(strategiesCopy)
    }

    function addSubRuleParameter(strategyIndex, ruleIndex, parameter) {
        const strategiesCopy = [...strategies];
        if (!parameters[parameter]) {
            const parametersCopy = { ...parameters }
            parametersCopy[parameter] = 1
            setParameters(parametersCopy)
        }
        strategiesCopy[strategyIndex].rules[ruleIndex][parameter] = [[]];
        setStrategies(strategiesCopy)
    }

    function addRuleToParameter(strategyIndex, ruleIndex, parameter) {
        const strategiesCopy = [...strategies];
        strategiesCopy[strategyIndex].rules[ruleIndex][parameter].push([]);
        setStrategies(strategiesCopy)
    }

    function addSubRuleParameterOperator(strategyIndex, ruleIndex, parameter, paramIndex, operator) {
        const strategiesCopy = [...strategies];
        strategiesCopy[strategyIndex].rules[ruleIndex][parameter][paramIndex][0] = operator;
        setStrategies(strategiesCopy)
    }

    function addSubRuleParameterValue(strategyIndex, ruleIndex, parameter, paramIndex, value) {
        const strategiesCopy = [...strategies];
        strategiesCopy[strategyIndex].rules[ruleIndex][parameter][paramIndex][1] = value;;
        setStrategies(strategiesCopy)
    }

    function addSubRule(strategyIndex) {
        const strategiesCopy = [...strategies];
        strategiesCopy[strategyIndex].rules.push({})
        setStrategies(strategiesCopy)

    }

    async function generateVersionIds(hash) {
        if (!campaign) {
            setModal({
                errors: [
                    "Please Enter the Campaign ID before generating Version_IDs"
                ]
            })
            return
        }
        else {
            setModal({
                "id_generation": 1,
                messages: [
                    "Generating Version IDs..."
                ]
            })
            setConfirmLoading(true)


            const strategiesCopy = [...strategies]
            for (const strategy of strategiesCopy) {
                if (strategy["version_id"] == "pending") {
                    strategy["version_id"] = "generating... please wait"
                }
            }
            for (const strategy of strategiesCopy) {
                if (strategy["version_name"] == "default") {
                    strategy["version_name"] = "default_" + hash
                }
                if (strategy["version_id"] = "generating... please wait") {
                    const response = await axios.get(`http://services.innovid.com/version-mapper/get-version-id/${campaign}?key=` + strategy["version_name"])
                    console.log(response.data["versions"]["key"], ", ", response.data["versions"]["versionID"])
                    strategy["version_id"] = response.data["versions"]["versionID"]

                }
            }
            setModal({
                "validating": 1,
                messages: [
                    "Version IDs Generated!"
                ]
            })
            setStrategyHash(hash)
            setStrategies(strategiesCopy)
        }
    }

    async function handleSubmitStrategy(hash) {
        setConfirmLoading(true)
        const fullJson = {
            "campaign": campaign,
            "databash_hash": hash,
            "parameters": parameters,
            "decisioning": strategies
        }
        axios.post(`http://services.innovid.com/strategyUpload?hash=${hash}`, fullJson)
            .then(response => {
                console.log(response)
                setConfirmLoading(false)
                const tempArr = [];
                // tempObj[assetType] = `http://services.innovid.com/strategyDeploy?hash=${req.query.hash}&assetType=${assetType}`;
                for (const [index, assetType] of Object.keys(response.data.message).entries()) {
                    const tempObj = {};
                    tempObj.key = index + 1;
                    tempObj.assetType = assetType;
                    tempObj.dynamicLink = response.data.message[assetType]
                    tempObj.action = response.data.message[assetType]
                    tempArr.push(tempObj)
                }
                setOverwritable(true)
                setUrlResponse(tempArr)
                setChangesMade(false)

            })
    }



    const selectAllOperators = (strategyIndex, ruleIndex, parameter, paramIndex, operator) => {
        return (
            <Select defaultValue={operator} onChange={(value) => { addSubRuleParameterOperator(strategyIndex, ruleIndex, parameter, paramIndex, value) }} style={{ width: 90 }}>
                <Option value="<"><Icon type="left" /></Option>
                <Option value=">"><Icon type="right" /></Option>
                <Option value="<="><div className="closeTogether"><Icon type="left" /><Icon type="pause" rotate={90} /></div></Option>
                <Option value=">="><div className="closeTogether"><Icon type="right" /><Icon type="pause" rotate={90} /></div></Option>
                <Option value="="><Icon type="pause" rotate={90} /></Option>
                <Option value="!="><div className="closeTogether"><Icon type="exclamation" /><Icon type="pause" rotate={90} /></div></Option>
                {/* <Option value="in"><div className="grey">IN</div></Option>
                <Option value="!in"><div className="grey">! IN</div></Option> */}
            </Select>
        );
    }

    const selectLimitedOperators = (strategyIndex, ruleIndex, parameter, paramIndex, operator) => {
        return (
            <Select defaultValue={operator} onChange={(value) => { addSubRuleParameterOperator(strategyIndex, ruleIndex, parameter, paramIndex, value) }} style={{ width: 90 }}>
                <Option value="="><Icon type="pause" rotate={90} /></Option>
                <Option value="!="><div className="closeTogether"><Icon type="exclamation" /><Icon type="pause" rotate={90} /></div></Option>
                {/* <Option value="in"><div className="grey">IN</div></Option>
                <Option value="!in"><div className="grey">! IN</div></Option> */}
            </Select>
        );
    }

    const weatherConditions = (strategyIndex, ruleIndex, parameter, paramIndex, inputValue) => {
        return (
            <Select defaultValue={inputValue} onChange={(value) => { addSubRuleParameterValue(strategyIndex, ruleIndex, parameter, paramIndex, value) }} style={{ width: 150 }}>
                <Option value="clear">Clear</Option>
                <Option value="rainy">Rainy</Option>
                <Option value="snowy">Snowy</Option>
                <Option value="other">Other</Option>
            </Select>
        );
    }

    const daysOfTheWeek = (strategyIndex, ruleIndex, parameter, paramIndex, inputValue) => {
        return (
            <Select defaultValue={inputValue} onChange={(value) => { addSubRuleParameterValue(strategyIndex, ruleIndex, parameter, paramIndex, value) }} style={{ width: 150 }}>
                <Option value="sunday">Sunday</Option>
                <Option value="monday">Monday</Option>
                <Option value="tuesday">Tuesday</Option>
                <Option value="wednesday">Wednesday</Option>
                <Option value="thursday">Thursday</Option>
                <Option value="friday">Friday</Option>
                <Option value="saturday">Saturday</Option>
            </Select>
        );
    }

    function modalErrorHandler() {
        setModal(null)
    }


    const showModal = (modal) => {
        if (modal) {
            if (modal["errors"]) {
                return (
                    <Modal
                        title="Errors"
                        visible={modal}
                        onOk={modalErrorHandler}
                        onCancel={modalErrorHandler}
                        okButtonProps={{ disabled: true }}
                    >
                        <ul>
                            {modal["errors"].map(error => {
                                return (<li>{error}</li>)
                            })}
                        </ul>
                    </Modal>
                )
            }
            else if (modal["submit"]) {
                return (
                    <Modal
                        title="Submit"
                        visible={modal}
                        onOk={handleSubmitStrategy}
                        confirmLoading={confirmLoading}
                        onCancel={() => { setModal(null) }}
                    >
                        <ul>
                            {modal["warnings"].map(warning => {
                                return <li>{warning}</li>
                            })}
                        </ul>
                    </Modal>
                )
            }
            else if (modal["id_generation"]) {

                return (
                    <Modal
                        title="Submit"
                        visible={modal}
                        footer={[
                            <Button key="submit" type="primary" loading={confirmLoading} onClick={() => { setModal(null) }}>
                                {confirmLoading ? "Please Wait..." : "OK"}
                            </Button>,
                        ]}
                    >
                        <ul>
                            {modal["messages"].map(message => {
                                return <li>{message}</li>
                            })}
                        </ul>
                    </Modal>
                )
            }

            else if (modal["warning"]) {
                return (
                    <Modal
                        title="Warning!"
                        visible={modal}
                        onOk={() => {
                            modal["onOk"](...modal["params"])
                        }}
                        onCancel={() => { setModal(null) }}
                    >
                        <ul>
                            {modal["warnings"].map(warning => {
                                return <li>{warning}</li>
                            })}
                        </ul>
                       
                    </Modal>
                )
            }
            else if (modal["custom"]) {
                return modal["content"]
            }
        }

    }

    const columns = [
        {
          title: 'Asset Type',
          dataIndex: 'assetType',
          key: 'assetType',
          render: text => <Tag>{text}</Tag>
        },
        {
          title: 'Dynamic Link',
          dataIndex: 'dynamicLink',
          key: 'dynamicLink',
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          render: text => <Button onClick={() => {
              copy(text)
          }}>Copy to Clipboard</Button>
        }
    ]

    const [plus, setPlus] = useState("")



    return (

        <div className="app-container">

            {showModal(modal)}
            <h1>Strategy Hash: {strategyHash} </h1>
            {!campaign ? (<div className="campaign-edit"><Search placeholder="Enter The Campaign ID" onSearch={(value) => { setCampaign(value) }} enterButton="Submit"></Search></div>) : <div className="campaign-enter"><div className="campaign-id">Campaign: {campaign}</div><div><Button onClick={() => { 
                if (overwritable) {
                    setModal({
                        custom: 1,
                        content: <Modal
                        visible={true}
                        footer={[
                            <Button key="new" onClick={() => {
                                setModal(null)
                            }}>
                                Cancel
                            </Button>,
                            <div className="campaign-edit"><Search placeholder="Enter The Campaign ID" onSearch={(value) => { 

                                setCampaign(value)
                                setOverwritable(false)
                                setStrategyHash(randomstring.generate(6))
                                setModal(null)
                            }} enterButton="Submit"></Search></div>
                        ]}
                      >
                        <p>Enter the Campaign you would like to duplicate this strategy to below. Note that this action will automatically create a new Strategy under a new strategy hash</p>
                        
                      </Modal>
                    })
                }
                else {
                    setCampaign(null) 
                }
                

                }}>{overwritable ? "Duplicate to Another Campaign" : "Edit"}</Button></div></div>}
            {
                <div className="asset-types-container"><Card
                    
                    bordered
                    
                >
                {<div className="asset-types-title"><h4>Define Your Asset Types Here</h4><div><Search value={assetField} placeholder="Add A New Asset Type" onChange={(e) => {
                        setAssetField(e.target.value)
                    }} onSearch={(value) => {
                        if (assetTypes.indexOf(value) >= 0) {
                            setModal({
                                errors: ["all asset types must be unique"]
                            })
                            setAssetField("")
                        }
                        else {
                            if (value.length > 0) {
                                handleDefineAssetTypes(value)
                                setAssetField("")
                            }
                            
                        }

                    }} enterButton="Submit"></Search></div></div>}
                
                <div className="asset-items-container" >{assetTypes.map((item, index) => (

                        <Tag color="#03c6d2" closable onClose={(e) => {
                            e.preventDefault();
                            setModal({
                                warning: 1,
                                onOk: (index) => {
                                    const assetTypesCopy = [...assetTypes];
                                    const strategiesCopy = [...strategies];
                                    for (const strategy of strategiesCopy) {
                                        for (const type of assetTypesCopy) {
                                            delete strategy.assets[assetTypesCopy[index]]

                                        }
                                    }
                                    delete assetTypesCopy[index]
                                    var newAssetTypes = assetTypesCopy.filter(value => {
                                        if (value) {
                                            return true;
                                        }
                                    })
                                    setStrategies(strategiesCopy)
                                    setAssetTypes(newAssetTypes)
                                    setModal(null)
                                },
                                params: [index],
                                warnings: [<div>"Warning! Deleting the asset type "<strong>{assetTypes[index]}</strong>" will delete the asset type for all versions. Are you sure you want to continue?"</div>]
                            })

                        }}>
                            {item}

                        </Tag>
                    )) }</div>
                </Card></div>

            }

            <div className="strategies">
                <Collapse activeKey={[activeOverride]} style={{ width: "100%" }}>
                    {
                        strategies.map((strategy, strategyIndex) => {
                            if (strategy) {
                                return (
                                    <Panel key={strategyIndex} header={<div onClick={() => {
                                        setActiveOverride(strategyIndex)
                                    }} className="flex-space"><div>Version ID: {strategy["version_id"]}</div><div>{strategy["editingName"] ? (<div>Version Name: <Search onSearch={(value) => { handleChangeVersionName(strategyIndex, value) }} enterButton="update version name"></Search></div>) : <div className="version-name"><div>Version Name: {strategy["version_name"]}</div><div><Button disabled={(strategy["version_name"].indexOf("default") >= 0)} onClick={() => { editStrategyName(strategyIndex) }}>Edit</Button></div></div>} </div> <div><Button onClick={() => {
                                        addSubRule(strategyIndex)
                                    }} disabled={(strategy["version_name"].indexOf("default") >= 0)}>Add Rule<Icon type="plus" /></Button> <Button disabled={(strategy["version_name"].indexOf("default") >= 0)} onClick={() => {
                                        removeStrategyHandler(strategyIndex)
                                    }} ><Icon type="close" /></Button></div> </div>} key={strategyIndex}>
                                        <div className="current-unit-container">
                                            <h2>Rules</h2>
                                            {
                                                strategy.rules && strategy.rules.map((rule, ruleIndex) => {
                                                    return (<div className="rules"><Card style={{ width: "100%" }}> <div className="rule-close"> <h3> 
                                                    Rule {ruleIndex + 1}
                                                </h3><div className=""><Button onClick={() => {
                                                        removeRuleHandler(strategyIndex, ruleIndex)
                                                    }} ><Icon type="close" /></Button></div></div>
                                                    <div><Menu multiple={true} onSelect={({ key }) => {
                                                        addSubRuleParameter(strategyIndex, ruleIndex, key)
                                                    }} onDeselect={({ key }) => {
                                                        addSubRuleParameter(strategyIndex, ruleIndex, key)
                                                    }} style={{ width: 256 }} mode="vertical">
                                                        <SubMenu
                                                            key="sub1"
                                                            title={<div>
                                                                <span>
                                                                    <Icon type="plus" />
                                                                    <span>Add Parameter</span>
                                                                </span>
                                                                </div>
                                                            }
                                                        >
                                                            <Menu.ItemGroup title="Weather">
                                                                <Menu.Item key="temperature" >Temperature</Menu.Item>
                                                                <Menu.Item key="weather_condition" >Weather Condition</Menu.Item>
                                                            </Menu.ItemGroup>
                                                            <Menu.ItemGroup title="Date/Time">
                                                                <Menu.Item key="date" >Date</Menu.Item>
                                                                <Menu.Item key="time" >Time</Menu.Item>
                                                                <Menu.Item key="day" >Day</Menu.Item>

                                                            </Menu.ItemGroup>
                                                            <Menu.ItemGroup title="Geo">
                                                                {/* <Menu.Item key="5">City, State</Menu.Item> */}
                                                                <Menu.Item key="zip">Zip Code</Menu.Item>
                                                                <Menu.Item key="dma">DMA</Menu.Item>

                                                            </Menu.ItemGroup>
                                                        </SubMenu>
                                                    </Menu></div>
                                                        <div className="rules">{Object.keys(rule).map((param, paramIndex) => {
                                                            return (
                                                                <div className="parameters">
                                                                    <Card title={<div className="parameter-title">{param} <div className="condition-add-close"><Button onClick={() => {
                                                                        addRuleToParameter(strategyIndex, ruleIndex, param)
                                                                    }} disabled={(param != "zip" && param != "dma" && rule[param].length > 1) || rule[param][rule[param].length - 1][0] == "="}>Add Condition<Icon type="plus" /></Button> <Button onClick={() => {
                                                                        removeSubRuleHandler(strategyIndex, ruleIndex, param)

                                                                    }} ><Icon type="close" /></Button></div></div>}>
                                                                        {rule[param].map((paramDefinition, definitionIndex) => {
                                                                            switch (param) {
                                                                                case "temperature":
                                                                                    return (<div className="parameter-values">
                                                                                        <InputGroup compact>
                                                                                            {selectAllOperators(strategyIndex, ruleIndex, param, definitionIndex, paramDefinition[0])}
                                                                                            <InputNumber min={-100} max={200} defaultValue={paramDefinition[1]} onChange={(value) => { addSubRuleParameterValue(strategyIndex, ruleIndex, param, definitionIndex, value) }} />
                                                                                        </InputGroup>
                                                                                        {definitionIndex < rule[param].length - 1 ? <div> and </div> : <div></div>}
                                                                                    </div>)
                                                                                case "weather_condition":
                                                                                    return (<div className="parameter-values">
                                                                                        <InputGroup compact>
                                                                                            {selectLimitedOperators(strategyIndex, ruleIndex, param, definitionIndex, paramDefinition[0])}
                                                                                            {weatherConditions(strategyIndex, ruleIndex, param, definitionIndex, paramDefinition[1])}
                                                                                        </InputGroup>
                                                                                        {definitionIndex < rule[param].length - 1 ? <div> and </div> : <div></div>}
                                                                                    </div>)
                                                                                case "date":
                                                                                    return (
                                                                                        <div className="parameter-values">
                                                                                            <InputGroup compact>
                                                                                                {selectAllOperators(strategyIndex, ruleIndex, param, definitionIndex, paramDefinition[0])}
                                                                                                <DatePicker defaultValue={paramDefinition[1] ? moment(paramDefinition[1], "YYYY-MM-DD") : null} onChange={(date, dateString) => {
                                                                                                    addSubRuleParameterValue(strategyIndex, ruleIndex, param, definitionIndex, dateString)
                                                                                                }} />
                                                                                            </InputGroup>
                                                                                            {definitionIndex < rule[param].length - 1 ? <div> and </div> : <div></div>}

                                                                                        </div>
                                                                                    )
                                                                                case "time":
                                                                                    return (

                                                                                        <div className="parameter-values">
                                                                                            <InputGroup compact>
                                                                                                {selectAllOperators(strategyIndex, ruleIndex, param, definitionIndex, paramDefinition[0])}
                                                                                                <TimePicker format="HH:mm" defaultValue={paramDefinition[1] ? moment(paramDefinition[1], "HH:mm") : null} onChange={(time, timeString) => {
                                                                                                    addSubRuleParameterValue(strategyIndex, ruleIndex, param, definitionIndex, timeString)
                                                                                                }} />
                                                                                            </InputGroup>
                                                                                            {definitionIndex < rule[param].length - 1 ? <div> and </div> : <div></div>}

                                                                                        </div>
                                                                                    )

                                                                                case "day":
                                                                                    return (<div className="parameter-values">
                                                                                        <InputGroup compact>
                                                                                            {selectLimitedOperators(strategyIndex, ruleIndex, param, definitionIndex, paramDefinition[0])}
                                                                                            {daysOfTheWeek(strategyIndex, ruleIndex, param, definitionIndex, paramDefinition[1])}
                                                                                        </InputGroup>
                                                                                        {definitionIndex < rule[param].length - 1 ? <div> and </div> : <div></div>}
                                                                                    </div>)
                                                                                case "dma":
                                                                                    return (<div>
                                                                                        <InputGroup compact>
                                                                                            {selectLimitedOperators(strategyIndex, ruleIndex, param, definitionIndex, paramDefinition[0])}
                                                                                            <InputNumber min={0} max={999} defaultValue={paramDefinition[1]} onChange={(value) => { addSubRuleParameterValue(strategyIndex, ruleIndex, param, definitionIndex, value) }} />
                                                                                        </InputGroup>
                                                                                        {definitionIndex < rule[param].length - 1 ? <div> and </div> : <div></div>}

                                                                                    </div>)
                                                                                case "zip":
                                                                                    return (<div>
                                                                                        <InputGroup compact>
                                                                                            {selectLimitedOperators(strategyIndex, ruleIndex, param, definitionIndex, paramDefinition[0])}
                                                                                            <InputNumber min={0} max={99999} defaultValue={paramDefinition[1]} onChange={(value) => { addSubRuleParameterValue(strategyIndex, ruleIndex, param, definitionIndex, value) }} />
                                                                                        </InputGroup>
                                                                                        {definitionIndex < rule[param].length - 1 ? <div> and </div> : <div></div>}

                                                                                    </div>)
                                                                            }
                                                                        })}
                                                                    </Card>
                                                                </div>
                                                            )
                                                        })}</div>
                                                    </Card>
                                                        {ruleIndex < strategy.rules.length - 1 ? <div> OR </div> : <div></div>}
                                                    </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <Divider />
                                        <div className="asset-container"><h2>Assets</h2> {Object.keys(strategy["assets"]).map(assetType => {
                                            return (<div className="asset-item">
                                                <div className="assetType-header"><strong>Asset Type: </strong>{assetType}</div> {<div className="asset-input"><div className="asset-input-field"><Input placeholder="Enter a URL or upload an asset" 
                                                onChange={(e) => {
                                                    const strategiesCopy = [...strategies];
                                                    strategiesCopy[strategyIndex]["assets"][assetType] = e.target.value
                                                    setStrategies(strategiesCopy)
                                                }} value={strategy.assets[assetType]}></Input></div><div className="uploader"><Upload name="file"
                                                    listType="picture"
                                                    fileList={strategy.assets[assetType] && assetType != "text2mobile" ? [{
                                                        uid: '-1',
                                                        name: "" ,
                                                        status: 'done',
                                                        url: strategy.assets[assetType] ? strategy.assets[assetType] : ""
                                                    }] : null}
                                                    onRemove={() => {
                                                        const strategiesCopy = [...strategies];
                                                        strategiesCopy[strategyIndex]["assets"][assetType] = "";
                                                        setStrategies(strategiesCopy)
                                                    }}
                                                    onChange={(info) => {
                                                        if (info.file.status === 'error') {
                                                            message.error(`${info.file.name} file upload failed.`);
                                                        }
                                                        else {
                                                            // console.log(new Buffer(info.file.originFileObj))
                                                            var formData = new FormData()
                                                            formData.append('file', info.file.originFileObj);
                                                            axios.post('http://services.innovid.com/uploadAsset', formData, {
                                                                headers: {
                                                                    'Content-Type': 'multipart/form-data'
                                                                }
                                                            })
                                                                .then(({ data }) => {
                                                                    const location = data.message
                                                                    console.log(location)
                                                                    const strategiesCopy = [...strategies];
                                                                    strategiesCopy[strategyIndex]["assets"][assetType] = location
                                                                    setStrategies(strategiesCopy)
                                                                })
                                                        }


                                                    }} multiple={false}>
                                                    <Button>
                                                        <Icon type="upload" /> Upload
                                                </Button>
                                                </Upload> </div></div>}

                                            </div>)
                                        })}</div>
                                    </Panel>)
                            }
                        })
                    }
                </Collapse>
            </div>
            <div id="add-rule"><div>Add Version</div> <div style={{ fontSize: "30px" }} >{<Icon onClick={() => { addStrategyHandler() }} type="plus-square" theme={plus} />}</div></div>
            <div className=".not-in"></div>
            <Divider />
            
            {
                urlResponse ? <div> <h1>Dynamic Links</h1> <Table columns={columns} dataSource={urlResponse} pagination={false} /><div className=".not-in"><Button disabled={!changesMade} onClick={() => {
                    verifyOverrite()
                }}>Submit Strategy</Button></div></div> : <div className="submit-strategy"><Button type="primary" disabled={!changesMade} onClick={() => {
                    verifyOverrite()
                }}>Submit Strategy</Button></div>
            }

        </div>)
}


const mapStateToProps = (state) => {
    return {
        auth: state.auth,

    }
}



const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StrategyGeneration)


