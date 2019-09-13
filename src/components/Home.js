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

    const [validateMessage, setValidateMessage] = useState("")
    const [timeout, setTheTimeout] = useState(0);
    const [hashValidate, setHashValidate] = useState("")

    function validateDatabasHash(e) {
        if (e.target.value === "" || e.target.value.length <= 2) {
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
                            setJson(data.json)
                            setHashValidate("success")
                            setValidateMessage("Hash Validated. Click Submit to View")
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
                <div><Button onClick={()=> {
                    setCreateStrategy(true)
                }}>Create New Strategy</Button></div>
                <div> or </div>
                <div><Form.Item
                    label="Enter a Strategy Hash to import an existing strategy"
                    hasFeedback
                    validateStatus={hashValidate}
                    help={validateMessage}
                >
                    <Input placeholder="" id="error" onChange={(e) => {
                        validateDatabasHash(e)
                    }} />
                </Form.Item><Button disabled={!json} onClick={()=> {
                    setCreateStrategy(true)
                }}>Submit</Button> </div>
                </div>

                
        )
    }


    return (

        <div >
            {createStrategy ? <div className="back"><Button onClick={()=> {setCreateStrategy(false)}}>Back</Button></div> : <div></div>}
            <Divider/>
            {createStrategy ? <StrategyGeneration json={json}/> : options()}
        </div>
        )
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
)(Home)