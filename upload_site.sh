#!/bin/bash

source config.sh

FILE_LIST="$(echo $(ls site/* | tr [:space:] ','))"
FILES="{${FILE_LIST%?}}"

curl -T $FILES $FTP_SITE
