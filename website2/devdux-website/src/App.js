import devduxlogo from './devduxlogo.png';
import './App.scss';
import githubIcon from './github-icon.svg';
import mediumLogo from './medium-logo.svg';
import osLabsLogo from './oslabs-icon.png';
import vscodeLogo from './vscode-logo.png';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { 
      main: '#5941ff',
    },
    secondary: {
      main: '#c8ff16',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <nav id="navbar" className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid">
              <a className="navbar-brand flex align-items-center" href="/">
               
                <div className="flex-col">
                  <span>DevDux</span>
                </div>
              </a>

         
            <div className="collapse navbar-collapse"   id="navbarSupportedContent">

              <button className="navbar-vscode">
                <a className="btn btn-sapling" href="https://marketplace.visualstudio.com/items?itemName=DevDux.DevDux" target="_blank" rel="noreferrer">Get DevDux</a>
              </button>
            </div>
          </div>
    </nav>
      <header className="App-header">
      <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />

      </header>
    <div id="content">
      <div>

        <div className="jumbotron mx-auto pt-5">
            
              <img className="big-logo" src={devduxlogo} alt="DevDux logo" weight={200} height={200}></img>
              <h1 className="display-4 logo d-flex justify-content-center d-flex align-items-center"><b>DevDux</b>
            </h1>
            <p className="lead text-center">A simple way to visualize Redux Toolkit apps.</p>
            <hr className="my-4"/>
            
            <button className="devdux-on-vscode" href="https://marketplace.visualstudio.com/items?itemName=DevDux.DevDux" target="_blank" rel="noreferrer">Get DevDux for<span><img src={vscodeLogo} alt="VS Code Logo" height={10} ></img></span> VS Code </button>
        </div>
        
      </div>
        <p>
        State variables and their modifiers in Redux applications are difficult to track and conceptualize, especially as the complexity of an application increases. Redux Toolkit provides the createSlice() hook, which compartmentalizes Devdux is a VS Code extension that indicates the relationships between project files and shows the state variables and modifiers (reducers) used in each file.
        </p>

        <div className="links-section mx-auto">
      <hr className="my-4"/>
      <h2 className="text-center">Links</h2>
      <div className="links">
        <div className="link mx-auto">
          <p className="text-center">View the product</p>
          <a href="https://github.com/oslabs-beta/sapling" target="_blank" rel="noreferrer">
            <img src={githubIcon} alt="Github OctoCat Logo" width={60} height={60}></img>
          </a>
        </div>
        <div className="link mx-auto">
          <p className="text-center">Read more about Sapling</p>
          <a href="https://medium.com/@saplingextension/introducing-sapling-a-vs-code-extension-for-traversing-your-react-component-hierarchy-3ac94d95887e" target="_blank" rel="noreferrer">
            <img src={mediumLogo} alt="Medium M Logo" width={60} height={60}></img>
          </a>
        </div>
      </div>
    </div>


          
          <div className="contributors mx-auto">
      <hr className="my-4"/>
      <h2 className="text-center">Created By</h2>

      <div className="row">

        <div className="person col-sm-3">
          <div className="card">
            <img src="https://avatars.githubusercontent.com/u/95331116?v=4" className="card-img-top" alt="Hina Khalid" width={200} height={200}></img>
            <div className="card-body person-info text-center">
              <h5 className="card-title">Hina Khalid</h5>
              <div className="profile-links">
                <a href="https://github.com/hina-khalid" target="_blank" rel="noreferrer">
                  <img className="profile-link" src={githubIcon} width={40} height={40} alt="Github OctoCat Logo"></img>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="person col-sm-3">
          <div className="card">
            <img src="https://avatars.githubusercontent.com/u/27757825?v=4" className="card-img-top" alt="Josh Miller" width={200} height={200}></img>
            <div className="card-body person-info text-center">
              <h5 className="card-title">Josh Miller</h5>
              <div className="profile-links">
                <a href="https://github.com/jshbmllr" target="_blank" rel="noreferrer">
                  <img className="profile-link" src={githubIcon} width={40} height={40}  alt="Github OctoCat Logo"></img>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="person col-sm-3">
          <div className="card">
            <img src="https://avatars.githubusercontent.com/u/107429231?s=400&u=e0e544dd1a6c138d58ffa60287f51f2eb17ec5b5&v=4" className="card-img-top" alt="Kara Chisholm" width={200} height={200}></img>
            <div className="card-body person-info text-center">
              <h5 className="card-title">Kara Chisholm</h5>
              <div className="profile-links">
                <a href="https://github.com/kkchis" target="_blank" rel="noreferrer">
                  <img className="profile-link" src={githubIcon} width={40} height={40}  alt="Github OctoCat Logo"></img>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="person col-sm-3">
          <div className="card">
            <img src="https://avatars.githubusercontent.com/u/17534982?v=4" className="card-img-top" alt="Matt Garza" width={200} height={200}></img>
            <div className="card-body person-info text-center">
              <h5 className="card-title">Matt Garza</h5>
              <div className="profile-links">
                <a href="https://github.com/mattg614" target="_blank" rel="noreferrer">
                  <img className="profile-link" src={githubIcon} width={40} height={40}  alt="Github OctoCat Logo"></img>
                </a>
              </div>
            </div>
          </div>
        </div>
</div>
<div>


      </div>
    </div>
  
          </div>
          <footer className="d-flex justify-content-around">
        <div className="d-flex flex-column align-items-center">
          <span>developed under</span>
          <a href="https://opensourcelabs.io/" target="_blank" rel="noreferrer">
           <img src={osLabsLogo} alt="OSLabs Logo" width={60} height={30}></img>
          </a>
        </div>
      </footer>
    </div>
    
    </ThemeProvider>
  );
}

export default App;
