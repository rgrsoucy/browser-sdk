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
}
