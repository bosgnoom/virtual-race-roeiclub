#!/bin/bash

source config.sh

curl -T "$(echo {$(ls site/* | tr [:space:] ',')})" $FTP_SITE
