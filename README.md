# oscapp

## Description
An opensource chat application built on Angular 13 and Firebase as BaaS.
The point of this project is, to learn and build an opensource chat-application.
It is meant to be run on a single host and the free firebase plan, so that everyone can build/run/develop/deploy it.

Feel free to leave your suggestions, problems, safety concerns or questions in the respected section here on Github.

## Features:
* live chat-application
* local and Google authentication
* persistent login

#### Livepreview: [https://oscapp.gubler-it.com](https://oscapp.gubler-it.com)

![oscapp [Preview]](https://i.imgur.com/TBkVqF5.png)

## Installation
* Install NodeJS -> https://nodejs.org/en/download/
* Install angular/cli -> **npm install -g @angular/cli**
* Clone this project with **git clone https://github.com/beatgubler/oscapp.io.git** or download manually
**npm install** -> **ng serve**

## Configuration
### Firebase Console
* Log into https://console.firebase.google.com/
* Create New Project
* Create Firestore Database
* Create Authentication method: Email/Password + Google
* Create Firebase Storage
* Add App and copy the firebaseConfig
### Application
* replace the firebaseConfig with your own config from the Firebase Console

## Notable external dependencies
* Firebase - https://www.npmjs.com/package/firebase
* AngularFire - https://www.npmjs.com/package/@angular/fire
* Angular Material - https://www.npmjs.com/package/@angular/material

## ToDo
* responsive (mobile first) design

## Known issues/concerns
* to cut down on firebase requests, functions should be used
* angularfire's modular API should be used
