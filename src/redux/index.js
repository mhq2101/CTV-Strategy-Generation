import {
    createStore,
    applyMiddleware,
    combineReducers
  } from 'redux';
  import {createLogger} from 'redux-logger';
  import thunkMiddleware from 'redux-thunk';
  import { composeWithDevTools } from 'redux-devtools-extension';



  import auth from './auth'

  const reducer = combineReducers({
    auth
  });
  
  const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(
      thunkMiddleware,
      createLogger()
    ))
  );

  export default store;