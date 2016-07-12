node {
  env.NVM_DIR=""

  stage 'Checkout'
  checkout scm
  sh 'git log -1 > GIT_LOG'
  git_log = readFile 'GIT_LOG'
  if (git_log.contains('Jenkins dist build')) {
    currentBuild.result = "SUCCESS"
    return;
  }

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
    NVM_DIR=
    source ~/.nvm/nvm.sh
    nvm use 4.4.4
    case ${env.BRANCH_NAME} in
        "master")
            git checkout master
            npm run build:min:js
            npm run build:js
            git add -f dist/relayr-browser-sdk.min.js
            git add -f dist/relayr-browser-sdk.js
            git commit -m "Jenkins dist build"
            git push origin master
            ;;
        "dev")
            git checkout dev
            npm run build:min:js
            npm run build:js
            git add -f dist/relayr-browser-sdk.min.js
            git add -f dist/relayr-browser-sdk.js
            git commit -m "Jenkins dist build"
            git push origin dev
            ;;
        "jenkins-setup")
            git checkout jenkins-setup
            npm run build:min:js
            npm run build:js
            git add -f dist/relayr-browser-sdk.min.js
            git add -f dist/relayr-browser-sdk.js
            git commit -m "Jenkins dist build"
            git push origin jenkins-setup
            ;;
    esac
  """
}