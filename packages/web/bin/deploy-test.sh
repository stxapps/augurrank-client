#!/bin/bash

aws s3 sync out/_next s3://test-augurrank-web/_next --size-only --cache-control max-age=31536000 --profile justnote

aws s3 sync out/nextImageExportOptimizer s3://test-augurrank-web/nextImageExportOptimizer --size-only --cache-control max-age=31536000 --profile justnote

aws s3 sync out s3://test-augurrank-web --exclude "_next/*" --exclude "nextImageExportOptimizer/*" --delete --cache-control max-age=86400 --profile justnote

aws cloudfront create-invalidation --distribution-id E3BW20Z9Q1C4V9 --paths "/*" --profile justnote
