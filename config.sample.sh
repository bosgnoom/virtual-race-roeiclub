#!/bin/bash

# Configure certificates to be generated here
NAME=banaan
SUBJECT="/emailAddress=somebody#omewhere.com/C=NL/ST=Holland/L=City/O=Banaan/CN=localhost"

# FTP upload site
FTP_SITE=ftp://user:pass@ftp.website.info/$NAME/

