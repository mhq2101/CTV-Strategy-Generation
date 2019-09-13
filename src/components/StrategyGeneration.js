import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux"
import '../stylesheets/StrategyGeneration.css';
import { } from '../redux/index'
import { Icon, Button, Divider, Popover, Collapse, Card, Select, DatePicker, InputNumber, TimePicker, Menu, Upload, message, List, Typography, Form, Modal } from 'antd';
import AllOperators from "./AllOperators.js"
import { Input } from 'antd';
import moment from 'moment';
import axios from "axios";
import randomstring from "randomstring";
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

    if (props.json) {

        defaultStrategies = props.json.decisioning
        defaultParameters = props.json.parameters
        defaultAssetTypes = Object.keys(props.json.decisioning[0].assets)
        if (props.json.campaign) {
            defaultCampaign = props.json.campaign
        }
    }

    const [parameters, setParameters] = useState(defaultParameters)
    const [validateMessage, setValidateMessage] = useState("")
    const [timeout, setTheTimeout] = useState(0);
    const [hashValidate, setHashValidate] = useState("")
    const [urlResponse, setUrlResponse] = useState(null)
    const [campaign, setCampaign] = useState(defaultCampaign)
    const [databaseHash, setDatabaseHash] = useState("")
    const [assetTypes, setAssetTypes] = useState(defaultAssetTypes)
    const [strategies, setStrategies] = useState(defaultStrategies)
    const [activeOverride, setActiveOverride] = useState(0)
    const [modal, setModal] = useState(null)
    const [confirmLoading, setConfirmLoading] = useState(false)

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
            version_name: "pending",
            rules: [{}],
            assets: {}
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
            case "<=":
                comparisonValue = valueOne - 1
            case ">=":
            case ">":
            case "!=":
                comparisonValue = valueOne + 1
                   
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
            case ">=":
            case ">":
            case "!=":
                comparisonValue = new Date(new Date(valueOne).getTime() + (60 * 1000));
                   
            case "=":
                comparisonValue = new Date(valueOne);
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
            case ">=":
            case ">":
            case "!=":
                comparisonValue = new Date(new Date(valueOne).getTime() + 60 * 60 * 24 * 1000);
                   
            case "=":
                comparisonValue = new Date(valueOne);
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

    async function submissionValidation() {
        const hash = randomstring.generate(6);
        const tempErrors = [];
        const tempWarnings = [];
        if (!campaign || isNaN(parseInt(campaign))) {
            tempErrors.push("No campaign ID found. Please Enter the 5 digit Campaign ID associated with this strategy")
        }
        for (const strategy of strategies) {
            for (const asset of (Object.keys(strategy.assets))) {
                if (!strategy.assets[asset]) {
                    tempErrors.push(`Empty URL - Version: ${strategy["version_name"]}, Asset type: ${asset}`)
                }

            }
            if (strategy["version_name"].indexOf("default") < 0) {
                for(const [ruleIndex, rule] of strategy.rules.entries()) {
                    for(const parameter of Object.keys(rule)) {
                        if (rule[parameter].length > 2) {
                            tempErrors.push(`More than 2 rules prohibited - Version: ${strategy["version_name"]}, Rule: ${ruleIndex + 1}, Parameter: ${parameter}`)
                        }
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

    function validateDatabasHash(e) {
        if (e.target.value === "" || e.target.value.length <= 2) {
            setDatabaseHash("")
            setHashValidate("")
            setValidateMessage("")
        }
        else {
            e.persist()
            setHashValidate("validating")
            setValidateMessage('Validating the Hash')
            clearTimeout(timeout)
            setTheTimeout(setTimeout(function () {
                axios.get("http://services.innovid.com/getStrategy?hash=" + e.target.value)
                    .then(({ data }) => {
                        if (data.status == "success") {
                            setDatabaseHash(e.target.value)
                            setStrategies(data.json.decisioning)
                            setParameters(data.json.parameters)
                            setAssetTypes(Object.keys(data.json.decisioning[0].assets))
                            if (data.json.campaign) {
                                setCampaign(data.json.campaign)
                            }
                            // setCampaign(data.config.campaign)
                            setHashValidate("success")
                            setValidateMessage("Hash Validated. View your strategy below")
                        }
                        else {
                            setHashValidate("error")
                            setValidateMessage("No configuration file found. Please enter a valid hash")

                        }
                    })
                    .catch(err => {

                        setHashValidate("error")
                        setValidateMessage("something went wrong, refresh your browser or try again later")
                    })

            }, 500));
        }

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
            setDatabaseHash(hash)
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
                setConfirmLoading(false)
                setUrlResponse(response.data.message)

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
                        title="Title"
                        visible={modal}
                        onOk={modalErrorHandler}
                        // confirmLoading={confirmLoading}
                        onCancel={modalErrorHandler}
                        okButtonProps={{ disabled: true }}
                    // cancelButtonProps={{ disabled: true }}
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
                        title="Title"
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
                        title="Title"
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
        }

    }

    const uploadProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {

            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                let fileReader = new FileReader();
                fileReader.onloadend = (file) => {
                    console.log(fileReader.result)
                    setParameters(JSON.parse(fileReader.result).parameters)
                    setAssetTypes(Object.keys(JSON.parse(fileReader.result).decisioning[0].assets))
                    setStrategies(JSON.parse(fileReader.result).decisioning)
                }
                fileReader.readAsText(info.file.originFileObj)
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const [plus, setPlus] = useState("")



    return (

        <div className="app-container">
            {showModal(modal)}
            <Divider />
            {!campaign ? (<div className="campaign-edit"><Search placeholder="Enter The Campaign ID" onSearch={(value) => { setCampaign(value) }} enterButton="Submit"></Search></div>) : <div className="version-name"><div>Campaign: {campaign}</div><div><Button onClick={() => { setCampaign(null) }}>Edit</Button></div></div>}
            <Divider />
            {
                <div><List
                    header={<div>Define Your Asset Types Here</div>}
                    footer={<div><Search placeholder="Add A New Asset Type" onSearch={(value) => { handleDefineAssetTypes(value) }} enterButton="Submit"></Search></div>}
                    bordered
                    dataSource={assetTypes}
                    renderItem={(item, index) => (
                        <List.Item>
                            <div className="asset-list-item"><Typography.Text >[{index + 1}]</Typography.Text> {item} <Button onClick={() => {
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
                            }}><Icon type="close" /></Button></div>
                        </List.Item>
                    )}
                /></div>

            }

            <div className="strategies">
                <Collapse activeKey={[activeOverride]} style={{ width: "100%" }}>
                    {
                        strategies.map((strategy, strategyIndex) => {
                            if (strategy) {
                                return (
                                    <Panel key={strategyIndex} header={<div onClick={() => {
                                        setActiveOverride(strategyIndex)
                                    }} className="flex-space"><div>Version ID: {strategy["version_id"]}</div><div>{strategy["editingName"] ? (<Search onSearch={(value) => { handleChangeVersionName(strategyIndex, value) }} enterButton="change"></Search>) : <div className="version-name"><div>Version Name: {strategy["version_name"]}</div><div><Button onClick={() => { editStrategyName(strategyIndex) }}>Edit</Button></div></div>} </div> <div><Button onClick={() => {
                                        addSubRule(strategyIndex)
                                    }} disabled={(strategy["version_name"].indexOf("default") >= 0)}><Icon type="plus" /></Button> <Button onClick={() => {
                                        removeStrategyHandler(strategyIndex)
                                    }} ><Icon type="close" /></Button></div> </div>} key={strategyIndex}>
                                        <div className="current-unit-container">
                                            {
                                                strategy.rules && strategy.rules.map((rule, ruleIndex) => {
                                                    return (<div className="rules"><Card style={{ width: "90%" }}><div className="rule-close"><div><Menu multiple={true} onSelect={({ key }) => {
                                                        addSubRuleParameter(strategyIndex, ruleIndex, key)
                                                    }} onDeselect={({ key }) => {
                                                        addSubRuleParameter(strategyIndex, ruleIndex, key)
                                                    }} style={{ width: 256 }} mode="vertical">
                                                        <SubMenu
                                                            key="sub1"
                                                            title={
                                                                <span>
                                                                    <Icon type="plus" />
                                                                    <span>Add Parameter</span>
                                                                </span>
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
                                                    </Menu></div><div><Button onClick={() => {
                                                        removeRuleHandler(strategyIndex, ruleIndex)
                                                    }} ><Icon type="close" /></Button></div></div>
                                                        {Object.keys(rule).map((param, paramIndex) => {
                                                            return (
                                                                <div className="parameters">
                                                                    <Card title={<div className="parameter-title">{param} <div><Button onClick={() => {
                                                                        addRuleToParameter(strategyIndex, ruleIndex, param)
                                                                    }}>Add Parameter Rule<Icon type="plus" /></Button> <Button onClick={() => {
                                                                        removeSubRuleHandler(strategyIndex, ruleIndex, param)
                                                                      
                                                                    }} ><Icon type="close" /></Button></div></div>} style={{ width: "90%" }}>
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
                                                                                                <TimePicker format="HH:mm" defaultValue={paramDefinition[1] ? moment(paramDefinition[1], "HH:mm") : moment("00:00", "HH:mm")} onChange={(time, timeString) => {
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
                                                        })}
                                                    </Card>
                                                        {ruleIndex < strategy.rules.length - 1 ? <div> OR </div> : <div></div>}
                                                    </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <Divider />
                                        <div>assets: {Object.keys(strategy["assets"]).map(assetType => {
                                            return (<div className="not-in">
                                                {assetType}: {<Input onChange={(e) => {
                                                    const strategiesCopy = [...strategies];
                                                    strategiesCopy[strategyIndex]["assets"][assetType] = e.target.value
                                                    setStrategies(strategiesCopy)
                                                }} defaultValue={strategy.assets[assetType]}></Input>}
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

            {urlResponse ? <div> {Object.keys(urlResponse).map(assetType => {
                return (<div>{assetType}: {urlResponse[assetType]}</div>)
            })}<div>Strategy Hash: {databaseHash}</div>
                <div className=".not-in"><Button onClick={() => {
                    submissionValidation()
                }}>Submit Strategy</Button></div> </div> : <div className=".not-in"><Button onClick={() => {
                    submissionValidation()
                }}>Submit Strategy</Button></div>}

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


