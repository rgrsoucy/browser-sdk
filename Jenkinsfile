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
    rm -rf build node_modules dist
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

  stage 'Build & Tag'
  sh """#!/bin/bash -e
    NVM_DIR=
    source ~/.nvm/nvm.sh
    nvm use 4.4.4
    case ${env.BRANCH_NAME} in
        "master")
            git checkout master
            git pull
            git push
            npm run build:js
            npm run build:min:js
            sh stamp.sh dist/relayr-browser-sdk.js
            sh stamp.sh dist/relayr-browser-sdk.min.js
            git add -f dist/relayr-browser-sdk.js
            git add -f dist/relayr-browser-sdk.min.js
            git status
            git commit -m "Jenkins dist build"
            git push origin master
            git push --follow-tags
            ;;
        "jenkins-setup")
            git checkout jenkins-setup
            git pull
            git push
            npm run build:js
            npm run build:min:js
            sh stamp.sh dist/relayr-browser-sdk.js
            sh stamp.sh dist/relayr-browser-sdk.min.js
            git add -f dist/relayr-browser-sdk.js
            git add -f dist/relayr-browser-sdk.min.js
            git add -f package.json
            git status
            git commit -m "Jenkins dist build"
            git push origin jenkins-setup
            git push --follow-tags
            ;;
    esac
  """
}
