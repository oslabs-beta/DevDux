import devduxlogo from './devduxlogo.png';
import './App.css';
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
            <nav>{}
            <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  DevDux
                </Typography>
                <Button color="inherit">Get DevDux</Button>
              </Toolbar>
            </AppBar>
          </Box>
          </nav>
      <header className="App-header">
      <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />

      </header>
    <div id="content">
      <div>
        <img src={devduxlogo} alt="DevDux logo" width={100} height={100}></img>
        <p id="header">DevDux</p>
        <div className="jumbotron mx-auto pt-5">
            <h1 className="display-4 logo d-flex justify-content-center d-flex align-items-center">
              <img src={devduxlogo} alt="DevDux logo" width={100} height={100}></img>
              <b>DevDux</b>
            </h1>
            <p className="lead text-center">A simple way to visualize Redux Toolkit apps.</p>
            <hr className="my-4"/>
            
            <p className="lead d-flex justify-content-center">
                <a className="btn btn-sapling btn-lg d-flex align-items-center" href="https://marketplace.visualstudio.com/items?itemName=team-sapling.sapling" role="button">
                  <span>Get DevDux for </span><img src={vscodeLogo} alt="VS Code Logo" width={30} height={30}></img><span> VS Code </span>
                </a>
            </p>
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

        <footer className="d-flex justify-content-around">
        <div className="d-flex flex-column align-items-center">
          <span>developed under</span>
          <a href="https://opensourcelabs.io/" target="_blank" rel="noreferrer">
           <img src={osLabsLogo} alt="OSLabs Logo" width={60} height={30}></img>
          </a>
        </div>
      </footer>

      </div>
    </div>
  
          </div>
    </div>
    
    </ThemeProvider>
  );
}

export default App;
