node {
    env.NVM_DIR=""

    stage 'Checkout'
    checkout scm

    stage 'Clean'
    sh """#!/bin/bash -e
      rm -rf build node_modules
    """

    stage 'Fetch install'
    sh """#!/bin/bash -e
      NVM_DIR=
      source ~/.nvm/nvm.sh
      nvm use 4.4.4
      npm install
    """

    stage 'Test'
    sh """#!/bin/bash -e
        NVM_DIR=
        source ~/.nvm/nvm.sh
        nvm use 4.4.4
        npm run test
    """

    stage 'Build'
    sh """#!/bin/bash -e
        NVM_DIR=
        source ~/.nvm/nvm.sh
        nvm use 4.4.4
        npm run build:min:js
        npm run build:js
    """

    stage 'Push'
    sh """#!/bin/bash -e
      git add -f dist/relayr-browser-sdk.min.js
      git add -f dist/relayr-browser-sdk.js
      git commit -m "Jenkins dist build"
    """
}
