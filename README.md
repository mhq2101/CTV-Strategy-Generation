This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `npm dev-start`

Runs the app in the development mode, similar to "npm start", but also includes less watcher to compile less files to css on every file save.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

# Custom UI extras

### config.json

In "public" folder there's a config.json file.
This file will be added to the "build" folder and should be deployed with the rest of the project.
This file will contain basic configuration for the project and is loaded in the "app.js".
Default config params are:
1. isPageActive - when set to "false" the page will render a "Page is currently under constructions" message
2. headerTitle - will set the page main header title. Not available when "stripped=true" is set in the query string

### React Hooks

This project uses React Hooks. For more info [https://reactjs.org/docs/hooks-intro.html](https://reactjs.org/docs/hooks-intro.html)

## Header, Content, Footer

The app includes 3 main components

###Header

The content component accepts 2 props:
1. <b>stripped</b>- if true, this component won't be rendered. Usually used when app is embedded in "Space".
2. <b>headerTitle</b>- pulled from the "config.json"

Header component includes:
    - <b>Innovid's logo</b>
    - <b>Page title</b>: renders the "headerTitle" prop value
    - <b>User name</b>: Display "Hey "+ {User name}. Will be available only if app is viewed in "studio.innovid.com". Default will display "Hey User"
    

### Content

The main content of the app. Basically, put all the app's components here
The content component accepts 2 props:
1. <b>isLoading</b> - when "true" will display a loading message. Currently set to wait for the _config.json_ to load (in the main "app" component), but can also wait for other dynamic elements.
2. <b>isPageAvailable</b> - when set to "false", will show a "Page is currently under constructions" message. Prop is currently set based on "isPageActive" value from the "config.json"

####sub components

   #####ContentLoader
   Will show when "isLoading" is set to true
   
   #####CustomPageHeader
   A default component to display the title and a short description of the app
    
### Footer
Includes copy rights text. Will be fixed to the bottom of the page

##Less
This app uses Less for styling. Read more on less usage [http://lesscss.org/usage/](http://lesscss.org/usage/)# CTV-Strategy-Generation
