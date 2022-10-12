<!-- DEXDUX README -->
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
  <p align="center">
    <!-- VSCode Version -->
    <a href="..."><img alt="Visual Studio Marketplace Version" src="..."></a>
    <!-- VSCode Installs -->
    <a href="..."><img alt="Visual Studio Marketplace Installs" src=".."></a>
    <!-- STARS -->
    <a href="..."><img alt="GitHub Repo stars" src="..."></a>
    <!-- FORKS -->
    <a href="..."><img alt="GitHub forks" src="..."></a>
    <!-- GITHUB RELEASE VERSION -->
    <!-- <a href="https://github.com/oslabs-beta/sapling/releases"><img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/oslabs-beta/sapling?include_prereleases"></a> -->
    <br>
    <!-- BUILD STATUS -->
    <a href="..."><img alt="master CI/CD workflow status" src="..."></a>
    <a href="https://github.com/oslabs-beta/sapling/actions/workflows/dev.yml"><img alt="dev CI workflow status" src="..."></a>
    <img alt="Vercel Web deployments" src="...">
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
      <ul>
        <li>
          <a href="#contributor-usage">Contributor Usage</a>
        </li>
      </ul>
    </li>
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

<br/>
<p align="center">
  <!-- <img> add gif here -->
</p>
<br/>

DexDux is a VS Code extention built for Redux users. As a codebase grows, it gets difficult to keep track of what files are rendering which components, what props are being passed, and the relationship between it all. Wouldn't it be so easy if we could just see everything displayed in a single spot? 

The solution is DevDux. DevDux eliminates the need of visiting files just to figure out how everything relates to one another. There is no more guessing of what the parent component is to your current file. DevDux is an interactive hierarchical tree view visualizer that lives directly in VS Code. It provides a visual indication of what each file contains.

### Built With

* [<img style="height: 1em;" src="sapling/media/react-brands.svg">](https://reactjs.org/)  [React](https://reactjs.org/)
* [<img style="height: 1em;" src="sapling/media/vscode.svg">](https://code.visualstudio.com/api)  [VSCode Extension API](https://code.visualstudio.com/api)
* [<img style="height: 1em;" src="sapling/media/mochajs-icon.svg">](https://mochajs.org/) [Mocha](https://mochajs.org/)
* [<img style="height: 1em;" src="sapling/media/chai_icon.svg">](https://www.chaijs.com/) [Chai](https://www.chaijs.com/)
* [<img style="height: 1em;" src="sapling/media/babel-logo-minimal.svg">](https://babeljs.io/docs/en/babel-parser) [Babel Parser](https://babeljs.io/docs/en/babel-parser)
* [<img style="height: 1em;" src="sapling/media/webpack.svg">](https://webpack.js.org/) [Webpack](https://webpack.js.org/)


## Installation

Installation from VS Code Extension Marketplace:

1. If needed, install Visual Studio Code for macOS (Sierra+). Currently 'DevDux' only supports macOS.

2. Install the DevDux extension for Visual Studio Code. Search for 'DexDux' in the VS Code extensions tab, or click [here](https://marketplace.visualstudio.com/items?itemName=DevDux.DevDux).

3. Once installed the DevDux "Open Root File" command should be accesible via the command pallete. See getting started for more information.

To install devdux for development, please see the contributing section below.

## Getting Started

1. After installing DevDux, open the VS Code command pallete (CMD+SHIFT+P). Type in the command "DevDux: Open Root File".

2. Your file explorer window will launch. Select an entrypoint. This is typically a file where the parent component for the rest of your application is rendered (App.jsx).

3. Go to the VS Code File Explorer tab and a DevDux Sidebar 

## Usage

### Note


### Contributor Usage

## Extension Settings

## Contributing
The open source community thrives on contributions. It allows developers to learn, create, and inspire other. Contributions to DevDux are **appreciated** and **encouraged**. 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/newFeature`)
3. Commit your Changes (`git commit -m 'Add some newFeature'`)
4. Push to the Branch (`git push origin feature/newFeature`)
5. Open a Pull Request

## License

## Creators
* [Kara Chisholm](https://github.com/kkchis)
* [Hina Khalid](https://github.com/hina-khalid)
* [Josh Miller](https://github.com/jshbmllr)
* [Matt Garza](https://github.com/mattg614)


## Contact

[<img style="height: 1em; width: 1em;" src="sapling/media/twitter-logo.svg">]()  Twitter: [@TeamDevDux](https://twitter.com/teamDevDux) | Email: devduxExtension@gmail.com

[<img style="height: 1em; width: 1em;" src="sapling/media/github-icon.svg">]()  GitHub: [https://github.com/oslabs-beta/devdux/](https://github.com/oslabs-beta/devdux/)


## Acknowledgements
* 





































































# devdux README

This is the README for your extension "devdux". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
