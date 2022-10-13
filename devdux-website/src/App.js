import devduxlogo from './devduxlogo.png';
import './App.scss';
import githubIcon from './github-icon.svg';
import mediumLogo from './medium-logo.svg';
import osLabsLogo from './oslabs-icon.png';
import * as React from 'react';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    primary: { 
      main: '#e4ff6d',
      contrastText: '#f5f5f6',
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
            <Button variant="contained"><a href="/">DevDux</a></Button>
              <div className="collapse navbar-collapse"   id="navbarSupportedContent">
            <Button variant="contained"><a href="https://marketplace.visualstudio.com/items?itemName=DevDux.DevDux">Get DevDux</a></Button>
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
            <img className="big-logo" src={devduxlogo} alt="DevDux logo" weight={200}   height={200}></img>
            <h1 className="display-4 logo d-flex justify-content-center d-flex align-items-center"><b>DevDux</b>
            </h1>
            <p className="tagline">A simple way to visualize Redux Toolkit apps in Visual Studio Code.</p>        
            <Button 
              sx={{ color: 'black', fontWeight: 'medium' }} 
              variant="contained">
                <a href="https://marketplace.visualstudio.com/items?itemName=DevDux.DevDux">Download on VS Code
                </a>
            </Button>
        </div>
      </div>
        <p className="description">
        Redux's state variables and reducers can be difficult to track, especially as an application's complexity increases. Redux Toolkit helps by offering the createSlice() hook, but functionality can still be hard to track from file to file. DevDux is a Visual Studio Code extension that visualizes relationships in Redux Toolkit apps in a simple, user friendly tree view.
        </p>

        <div className="links-section mx-auto">
      <hr className="my-4"/>
        <h2 className="text-center">Links</h2>
      <div className="links">
        <div className="link mx-auto">
          <p className="text-center">The source code:</p>
            <a href="https://github.com/oslabs-beta/DevDux" target="_blank" rel="noreferrer">
            <img src={githubIcon} alt="Github OctoCat Logo" width={60} height={60}></img>
            </a>
        </div>
        <div className="link mx-auto">
          <p className="text-center">More about DevDux:</p>
            <a href="https://devdux.medium.com/devdux-a-new-open-source-vs-code-extension-for-redux-rtk-f7d3b8838083" target="_blank" rel="noreferrer">
              <img src={mediumLogo} alt="Medium M Logo" width={60} height={60}></img>
            </a>
        </div>
      </div>
    </div>
    
    <div className="contributors mx-auto">
      <hr className="my-4"/>
      <h2 className="text-center">Creators</h2>
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

    </div>
  </div>
    <footer className="d-flex justify-content-around">
      <div className="d-flex flex-column align-items-center">
        <a href="https://opensourcelabs.io/" target="_blank" rel="noreferrer">
          <img src={osLabsLogo} alt="OSLabs Logo" width={70} height={30}></img>
          </a>
        </div>
      </footer>
    </div>
    </ThemeProvider>
  );
}

export default App;
