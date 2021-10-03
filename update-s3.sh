#!/usr/bin/env bash

rm -rf build
npm run build
aws --profile s3_update s3 sync build/ s3://autobahn.byoc.de/ --acl public-read
