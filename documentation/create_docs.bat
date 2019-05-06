@echo off
title Lynx2D - Create Documentation

echo Creating documentation, this might take a while...
documentation build ../modules/** -f html -o output -c config.yml