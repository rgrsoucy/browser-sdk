#!/bin/bash
    git checkout master
    git pull
    git push
    npm run build:js
    npm run build:min:js
    sh stamp.sh dist/main.js
    sh stamp.sh dist/relayr-browser-sdk.min.js
    git add -f dist/*
    npm run version:increment
    npm run version:tag
    git add -f package.json
    git status
    git commit -m "Jenkins dist build"
    git push origin master
    git push --follow-tags
EOF
