<!-- DEXDUX README -->
# DevDux README
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/oslabs-beta/DevDux">
    <img src="devdux/media/devdux.png" alt="Logo" height="120">
  </a>

  <h3 align="center">DexDux</h3>

  <p align="center">
    Redux Toolkit state visualization extension for VS Code
    <br />
    <a href="https://github.com/oslabs-beta/DevDux"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/oslabs-beta/DevDux/issues">Report Bug</a>
    ·
    <a href="https://github.com/oslabs-beta/DevDux/issues">Request Feature</a>
  </p>
    <!-- BADGES -->
  <!-- <p align="center"> -->
    <!-- VSCode Version -->
    <!-- <a href="..."><img alt="Visual Studio Marketplace Version" src="..."></a> -->
    <!-- VSCode Installs -->
    <!-- <a href="..."><img alt="Visual Studio Marketplace Installs" src=".."></a> -->
    <!-- STARS -->
    <!-- <a href="..."><img alt="GitHub Repo stars" src="..."></a> -->
    <!-- FORKS -->
    <!-- <a href="..."><img alt="GitHub forks" src="..."></a> -->
    <!-- GITHUB RELEASE VERSION -->
    <!-- <a href="https://github.com/oslabs-beta/sapling/releases"><img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/oslabs-beta/sapling?include_prereleases"></a> -->
    <!-- <br> -->
    <!-- BUILD STATUS -->
    <!-- <a href="..."><img alt="master CI/CD workflow status" src="..."></a>
    <a href="https://github.com/oslabs-beta/sapling/actions/workflows/dev.yml"><img alt="dev CI workflow status" src="..."></a>
    <img alt="Vercel Web deployments" src="..."> -->
    <!-- LICENSE -->
    <!-- <a href="https://github.com/oslabs-beta/sapling/blob/master/LICENSE"><img alt="GitHub" src="https://img.shields.io/github/license/oslabs-beta/sapling"></a> -->
    <!-- CONTRIBUTIONS -->
    <!-- <a href="https://github.com/oslabs-beta/sapling/blob/master/README.md"><img alt="Contributions" src="https://img.shields.io/badge/contributors-welcome-brightgreen"></a> -->
  </p>
</p>

<hr>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#installation">Installation</a></li>
    <li>
      <a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a>
    <li><a href="#limitations">Limitations</a>
    <li><a href="#contributor-usage">Contributor Usage</a></li>
    <li><a href="#extension-settings">Extension Settings</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#creators">Creators</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<hr>

## About The Project

<p align="center">
  <!-- <img> add gif here -->
</p>
<br/>

DexDux is a VS Code extention built for Redux users. As a codebase grows, it gets difficult to keep track of what files are rendering which components, what props are being passed, and the relationship between it all. Wouldn't it be so easy if we could just see everything displayed in a single spot?

The solution is DevDux. DevDux eliminates the need of visiting files just to figure out how everything relates to one another. There is no more guessing of what the parent component is to your current file. DevDux is an interactive hierarchical tree view visualizer that lives directly in VS Code. It provides a visual indication of what each file contains.

### Built With

- [<img style="height: 1em;" src="devdux/media/react-brands.png">](https://reactjs.org/) [React](https://reactjs.org/)
- [<img style="height: 1em;" src="devdux/media/vscode.png">](https://code.visualstudio.com/api) [VSCode Extension API](https://code.visualstudio.com/api)
- [<img style="height: 1em;" src="devdux/media/mochajs-icon.png">](https://mochajs.org/) [Mocha](https://mochajs.org/)
- [<img style="height: 1em;" src="devdux/media/chai_icon.png">](https://www.chaijs.com/) [Chai](https://www.chaijs.com/)
- [<img style="height: 1em;" src="devdux/media/babel-logo-minimal.png">](https://babeljs.io/docs/en/babel-parser) [Babel Parser](https://babeljs.io/docs/en/babel-parser)
- [<img style="height: 1em;" src="devdux/media/webpack.png">](https://webpack.js.org/) [Webpack](https://webpack.js.org/)

## Installation

Installation from VS Code Extension Marketplace:

1. If needed, install Visual Studio Code for macOS (Sierra+). Currently 'DevDux' only supports macOS.

2. Install the DevDux extension for Visual Studio Code. Search for 'DexDux' in the VS Code extensions tab, or click [here](https://marketplace.visualstudio.com/items?itemName=DevDux.DevDux).

3. Once installed the DevDux "Open Root File" command should be accesible via the command pallete. See getting started for more information.

To install devdux for development, please see the contributing section below.

## Getting Started

1. After installing DevDux, open the VS Code command pallete (⌘⇧P). Type in the command "DevDux: Open Root File".

2. Your file explorer window will launch. Select an entrypoint. This is typically a file where the parent component for the rest of your application is rendered (App.jsx).

3. Go to the VS Code Explorer tab (⌘⇧E) and a DevDux Sidebar will be presented below your files.

## Usage
Currently DevDux supports a limited amount of React-Redux file structures, see the limitations sections for more details. DevDux the name of the folder a file resides in and the file name. Clicking on a file name opens the collapsable tree view to reveal the following application information :
<ol>
  <li> filePath </li>
  <ul>
    <li>Complete file path </li>
  </ul>
  <li> imports </li>
  <li> selected </li>
  <li> dispatched </li>
  <li> rendered components</li>
</ol>
1. filePath
1. imports
1. selected
1. dispatched
1. renderedComponents

## Limitations

### Contributor Usage

## Extension Settings

## Contributing

The open source community thrives on contributions. It allows developers to learn, create, and inspire others. Contributions to DevDux are **appreciated** and **encouraged**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/newFeature`)
3. Commit your Changes (`git commit -m 'Add some newFeature'`)
4. Push to the Branch (`git push origin feature/newFeature`)
5. Open a Pull Request

## License
This project is licensed under the Mozilla Public License. For more information see the LICENSE file in the repository or visit Mozilla's offical page [here](https://www.mozilla.org/en-US/MPL/).
## Creators

- [Kara Chisholm](https://github.com/kkchis)
- [Hina Khalid](https://github.com/hina-khalid)
- [Josh Miller](https://github.com/jshbmllr)
- [Matt Garza](https://github.com/mattg614)

## Contact

[<img style="height: 1em; width: 1em;" src="devdux/media/linkedin.svg">]() LinkedIn: [@devdux-extension](https://www.linkedin.com/company/devdux-extension/) | Email: devduxExtension@gmail.com

[<img style="height: 1em; width: 1em;" src="devdux/media/github-icon.png">]() GitHub: [https://github.com/oslabs-beta/devdux/](https://github.com/oslabs-beta/devdux/)

## Acknowledgements
