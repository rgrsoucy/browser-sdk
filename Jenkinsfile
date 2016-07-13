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

  stage 'Build & Push'
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
            rm -rf dist
            npm run build:min:js
            npm run build:js
            git add -f dist/relayr-browser-sdk.min.js
            git add -f dist/relayr-browser-sdk.js
            git commit -m "Jenkins dist build"
            git push origin dev
            ;;
        "jenkins-setup")
            git checkout jenkins-setup
            git pull
            git push
            npm run build:js
            npm run build:min:js

            ed -s dist/relayr-browser-sdk.min.js << EOF
            0a
            //Latest build: \$(date +"%m-%d-%y %H:%M")
            .
            w
            EOF

            ed -s dist/relayr-browser-sdk.js << EOF
            0a
            //Latest build: \$(date +"%m-%d-%y %H:%M")
            .
            w
            EOF
            git add -f dist/relayr-browser-sdk.js
            git add -f dist/relayr-browser-sdk.min.js

            git status
            git commit -m "Jenkins dist build"
            git push origin jenkins-setup
            ;;
    esac
  """

  stage 'Tag new version'
  checkout scm
  sh """#!/bin/bash -e
      NVM_DIR=
      source ~/.nvm/nvm.sh
      nvm use 4.4.4
      npm install
      npm run version:increment
      PACKAGE_VERSION=\$(cat package.json \
      | grep version \
      | head -1 \
      | awk -F: '{ print \$2 }' \
      | sed 's/[",]//g'
      | tr -d '[[:space:]]')
      git tag \$PACKAGE_VERSION
      git push \$PACKAGE_VERSION
  """
}
