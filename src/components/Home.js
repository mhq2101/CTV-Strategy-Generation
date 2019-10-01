import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux"
import { Icon, Button, Divider, Popover, Collapse, Card, Select, DatePicker, InputNumber, TimePicker, Menu, Upload, message, List, Typography, Form, Modal } from 'antd';
import { Input } from 'antd';
import StrategyGeneration from "./StrategyGeneration"
import '../stylesheets/StrategyGeneration.css';
import axios from "axios"


const Home = (props) => {
    const [createStrategy, setCreateStrategy] = useState(false)
    const [existingStrategy, setExistingStrategy] = useState(false)
    const [json, setJson] = useState(null)
    const [tempJson, setTempJson] = useState(null)
    const [validateMessage, setValidateMessage] = useState("")
    const [timeout, setTheTimeout] = useState(0);
    const [hashValidate, setHashValidate] = useState("")
    const [overwritable, setOverwritable] = useState(false)

    useEffect(() => {
        if (sessionStorage.getItem("innovid-smart-strategy")) {
            const temp = JSON.parse(sessionStorage.getItem("innovid-smart-strategy"))
            console.log(temp)
            setTempJson({...temp})
            setJson({...temp})
            setCreateStrategy(true);
        }
    }, []);

    function validateDatabasHash(e) {
        if (e.target.value === "" || e.target.value.length <= 2) {
            setHashValidate("")
            setValidateMessage("")
            setTempJson(null)
            setJson(null)
        }
        else {
            e.persist()
            setHashValidate("validating")
            setValidateMessage('Validating the Hash')
            clearTimeout(timeout)
            setTheTimeout(setTimeout(function () {
                let hash = "";
                let url = false;
                if (e.target.value.indexOf("?hash=")>0) {
                    const index = e.target.value.indexOf("?hash=")
                    hash = e.target.value.substring(index+6, index+12);
                    url = true
                }
                else {
                    console.log(e.target.value)
                    hash = e.target.value
                
                }
                console.log(hash)
                axios.get("http://services.innovid.com/getStrategy?hash=" + hash)
                    .then(({ data }) => {
                        if (data.status == "success") {
                            const newJson = {...data.json}
                            newJson.strategyHash = hash
                            const tempArr = [];


                            for (const [index, assetType] of Object.keys(newJson.decisioning[0].assets).entries()) {
                                const urlResponse = {};
                                urlResponse.key = index + 1;
                                urlResponse.assetType = assetType;
                                urlResponse.dynamicLink = `http://services.innovid.com/strategyDeploy?hash=${hash}&assetType=${assetType}`
                                urlResponse.action = `http://services.innovid.com/strategyDeploy?hash=${hash}&assetType=${assetType}`
                                tempArr.push(urlResponse)
                            }

                            
                            newJson["urlResponse"] = tempArr
                            setTempJson(newJson)
                            setHashValidate("success")
                            if (url) {
                                setValidateMessage("URL Validated. Click Submit to View")
                            }
                            else {
                                setValidateMessage("Hash Validated. Click Submit to View")
                            }
                            
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

    const options = () => {
        return (
            <div className="options-container">
                <div className="create-new"><Button onClick={()=> {
                    setCreateStrategy(true)
                }}>Create New Strategy</Button></div>
                <div className="strategy-hash-input"><Form.Item
                    label=" or Enter a Strategy Hash or Dynamic URL to import an existing strategy"
                    hasFeedback
                    validateStatus={hashValidate}
                    help={validateMessage}
                >
                    <Input size={30} placeholder="" id="error" onChange={(e) => {
                        validateDatabasHash(e)
                    }} />
                </Form.Item><div className="submit-strategy-hash"><Button style={{"position": "relative", "top": "4px"}} disabled={!tempJson} onClick={()=> {
                    setCreateStrategy(true)
                    setJson({...tempJson})
                    setOverwritable(true)
                    setHashValidate("")
                    setValidateMessage("")
                    
                }}>Submit</Button></div></div>
                </div>                
        )
    }


    return (
        <div >
            {createStrategy ? <div className="back"><Button onClick={()=> {setCreateStrategy(false) 
                setTempJson(null)
                setJson(null)
                setOverwritable(false)
                sessionStorage.removeItem("innovid-smart-strategy");
                }}>Start Over</Button></div> : <div></div>}
            <Divider/>
            {createStrategy ? <StrategyGeneration overwritable={overwritable} json={json}/> : options()}
        </div>
        )
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}



const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)