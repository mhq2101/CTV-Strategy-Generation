import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux'
import axios from "axios/index";
import InnoHeader from "./Header.js";
import InnoFooter from "./Footer.js";
import InnoContent from './Content'
import "../stylesheets/App.css";
import '../stylesheets/style.css'
import { getAuth } from "../redux/auth"
// import socket from "../socket"

const cookieId = 'tempUserData';
const defaultUserData = {firstName: "User", lastName: "", email: ""};

const App = (props) => {

    const [stripped, setStripped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPageAvailable, setIsPageAvailable] = useState(true);
    const [headerTitle, setHeaderTitle] = useState('');
    const [version, setVersion] = useState("")

    useEffect(() => {
        props.getAuth(resolveUserData());
        // socket.emit("join", resolveUserData())
    }, []);
    useEffect(() => {
        axios(`${process.env.PUBLIC_URL}/config.json`)
            .then((data) => {
                setIsLoading(false)
                setIsPageAvailable(data.data.isPageActive)
                setHeaderTitle(data.data.headerTitle || '')
                setVersion(data.data.version)
                document.title = data.data.headerTitle || '';
            });
    }, [])
    

    useEffect(() => {
        setStripped(resolveStripped)
    }, []);

    return (
        <div className="App">
            <InnoHeader stripped={stripped} headerTitle={headerTitle} userData={props.auth}/>
            <InnoContent isLoading={isLoading} isPageAvailable={isPageAvailable} userData={props.auth}/>
            <InnoFooter stripped={stripped} version={version}/>
        </div>
    );
}

const resolveStripped = () => {
    let stripped = false;
    if (window.location.href.split('?')[1]) {
        window.location.href.split('?')[1].split('&').forEach((query, i) => {
            if (query.split('=')[0] === 'stripped' && query.split('=')[1] === 'true') {
                stripped = true;
            }
        })
    }
    return stripped;
}

const resolveUserData = () => {
    try {
        let userData = JSON.parse(decodeURIComponent(getCookieValue(cookieId)));

        if (userData.firstName) {
            // console.log('alskfj')
            return userData;
        }
        else {
            return {firstName: "User", lastName: "Testerooni", email: "usertest@testerooni.net"};
        }
    } catch (e) {
        return {firstName: "User", lastName: "Testerooni", email: "usertest@testerooni.net"};
    }
}

const getCookieValue = cookieId => {
    var b = document.cookie.match('(^|;)\\s*' + cookieId + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}


const mapStateToProps = (state) => {
    return {
      auth: state.auth
    }
  }

  const mapDispatchToProps = (dispatch, ownProps) => ({
      getAuth: (auth) => {
        dispatch(getAuth(auth))
      }
  })

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)


