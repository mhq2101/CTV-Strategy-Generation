const GET_AUTH = "GET_AUTH"

export const getAuth = function (auth) {
  return {
    type: GET_AUTH,
    auth
  }
}

const initialState = {
        firstName: "User",
        lastName: "",
        email: ""
}

// const resolveUserData = () => {
//     try {
//         let userData = JSON.parse(decodeURIComponent(getCookieValue(cookieId)));

//         if (userData.firstName) {
//             console.log(userData)
//             return userData;
//         }
//         else {
//             return {firstName: "User", lastName: "", email: ""};
//         }
//     } catch (e) {
//         return {firstName: "User", lastName: "", email: ""};
//     }
// }

// const getCookieValue = cookieId => {
//     var b = document.cookie.match('(^|;)\\s*' + cookieId + '\\s*=\\s*([^;]+)');
//     return b ? b.pop() : '';
// }

// defining our "initialState" as the default for prevState will make it so that
// when we create our store, Redux initializes our state properly.
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_AUTH:
      return action.auth
    default:
      return state
  }
}