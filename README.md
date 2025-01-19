# Kana Typer 
> Web application for learning writing and reading in japanese language. \
> README in Polish [here](README.pl.md)

## Table of Contents
- [General Information](#general-information)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Usage](#usage)
    - [Development](#development)
    - [Building](#building)
    - [Deployment](#deployment)
- [Debugging](#debugging)
- [Testing](#testing)
    - [Unit](#unit)
    - [Integration](#integration)
    - [Coverage](#coverage)
- [Support](#support)
- [Contributing](#contributing)
- [Authors](#authors)
- [Project Status](#project-status)

## General Information

Kana Typer is an application for learning the writing and reading in japanese language. 
The language consists of hiragana, katakana and kanji, all of which are included in the application.
App allows you to monitor your progress and adapts reading help (called furigana) based on your accomplishments.

This is the source code of the application and it is hosted on Firebase service [here](https://kana-typer.web.app/).

Source code is published as open-source under [MIT License](LICENSE).

## Technologies Used

- HTML5, CSS3 and JS (ECMAScript 2020)
- Node v20.18
- Vite v5.2
- Vitest v1.6
- Eslint v8.57
- React v18.2
- React Router v6.25
- Firebase v10.11
- i18n v23.12
- FontAwesome v6.7

## Project Structure

Root of the project consists of workflow files in `.github/` and debugger definitions under `.vscode/` for debugging with VSCode.

Other files in root of the project are for eslint (`.eslint.rc`), vite (`vite.config.js`) and vitest (`vitest.config.js`) configuration as well as firebase-specific configuration. Precisely, general config in `.firebaserc` and deployment/emulation in `firebase.json`.

Project uses environment variables to store Firebase API keys.

Folder `public/` contains favicon and i18n language directive files. Supported languages are English and Polish.

Source folder (`src/`) has all the project code.

Notable source subfolders are:
- `components/` - custom global JSX components
- `config/` - Firebase and i18n project-specific configuration
- `context/` - custom React Context components
- `hooks/` - custom React Hooks
- `pages/` - pages structure for the project
- `utils/` - local helper packages

## Setup

To configure and setup the environment, first download all required dependencies.

```bash
npm i
```

Next, create a `.env` file where you will store your Firebase API keys. The structure of this file should look like this:

```bash
FIREBASE_API_KEY='<...>'
FIREBASE_AUTH_DOMAIN='<...>'
FIREBASE_PROJECT_ID='<...>'
FIREBASE_STORAGE_BUCKET='<...>'
FIREBASE_MESSAGING_SENDER_ID='<...>'
FIREBASE_APP_ID='<...>'
FIREBASE_MEASUREMENT_ID='<...>'
```

If you do not have access to environment variables from the Kana Typer team, you will not be able to connect to Firebase services and thus not be able to run the application correctly. In this case, it is proposed to create your own Firebase project and simply copy all the required code over, as the API keys of this project will not be shared with anyone.

## Usage

### Development

To launch the development version of the code, run command below.

```bash
npm run dev
```

This should run a server with the web app on `http://localhost:5173`. Navigate to this URL to confirm that everything is working correctly. To access certain functionality of the project, you will need to login with your Google Account, which will be stored on the Authentication Firebase service tied to this project.

### Building

To build the application for production deployment, run command below.

```bash
npm run build
```

This will build all the files and package them in `dist/` folder, ready for deployment.

### Deployment

An automatic deployment is integrated into Github Actions process of commiting code to main branch, i.e. production branch. 

To deploy without integrated Firebase Workflow, first verify that the code for deployment is running correctly after being built.

```bash
npm ci
npm run build
firebase hosting:channel:deploy
```

This will create a Preview Channel to verify any changed that will be made. Once everything looks good, run command below to deploy to Firebase Hosting service.

```bash
firebase deploy
```

## Debugging

To debug the application you can run setup debugger scripts in VSCode. Simply navigate to debugging tab in VSCode or press `CTRL+SHIFT+D`, choose the browser you want to debug on (currently supported are Firefox and Chrome) and press run or `F5`. 

This will create a new, private debugger window. If it shows up blank, make sure to navigate to the proper URL of the project.

## Testing

### Unit

To run unit tests, simply run code below.

```bash
npm run test
```

This will run a vitest module and while you make changes to the control groups, the module will reload.

### Integration

Integration tests have not been fully implemented, although you can use what is provided and build on that for your requirements. 

First run code below to initiate Firestore emulator.

```bash
firebase emulators:start --only firestore
```

Next, edit out the firestore test file from vitest excluded files.

```js
...
exclude: [
    ...configDefaults.exclude,
    'src/tests/firestore.test.js',
],
```

Lastly, open up a new terminal and run code below.

```bash
npm run test:integration
```

You should see tests passing for accessing Firestore emulator database.

### Coverage

To generate test coverage, run command below.

```bash
npm run coverage
```

This will generate coverage table in the console using `v8`.

A folder `coverage/` will be created, where HTML coverage page generated using `istanbul` is located.

## Support

If you have any issues regarding the code, message our team via listed emails in [Authors section](#authors) or by adding a new issue in Github Issues.

## Contributing

As of this time, no contributions are accepted, but this might change in the future. 

In case of any issues, bugs or propositions, please use Github Issues for that.

## Authors

| Name and surname | University index | Contact email        |
|:-----------------|:-----------------|----------------------|
| Cezary Ciślak    | s25429           | s25429@pjwstk.edu.pl |
| Weronika Szydlik | s24301           | s24301@pjwstk.edu.pl |
| Alicja Wieloch   | s24274           | s24274@pjwstk.edu.pl |

## Project Status

Project is not considered to be finished fully for the deadline it was given, but it will be slowly worked on by the authors in their free time. Although, support will be sparse.
