import logo from './logo.svg';
import './App.css';


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
        <img src="./devduxlogo.png" alt="DevDux logo"></img>
        <p>
          Hello World from DevDux!
        </p>
    </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
