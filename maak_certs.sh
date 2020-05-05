#!/bin/bash

# https://stackoverflow.com/a/60516812
# https://aboutssl.org/how-to-create-and-import-self-signed-certificate-to-android-device/

source config.sh

echo "########################"
echo "# Generate dhparam.pem #"
echo "########################"
# Skip if exists

echo *Generate dhparam key*
[[ -e nginx/dhparam.pem ]] || openssl dhparam -out nginx/dhparam.pem 4096


# Skip creating CA root certificate if it already exists
echo "##################################"
echo "# Become a Certificate Authority #"
echo "##################################"

echo *Generate private key CA*
[[ -e priv_and_pub.key ]] || openssl genrsa -out priv_and_pub.key 4096
echo 

    
echo *Generate root certificate CA*
[[ -e CA.pem ]] || openssl req -new \
    -key priv_and_pub.key \
    -subj $SUBJECT \
    -out CA.pem \
    #-days 3650 \ deze gaf een foutmelding...
echo


echo *Generate android_options.ext*
>android_options.ext cat <<-EOF
basicConstraints=CA:true
EOF


echo *Generate CA certificate for android*
[[ -e CA.crt ]] || openssl x509 -req -days 356 \
    -in CA.pem \
    -signkey priv_and_pub.key \
    -extfile android_options.ext \
    -out CA.crt
echo


echo *Android: CA to DER format*
[[ -e CA.der.crt ]] || openssl x509 -inform PEM \
    -outform DER \
    -in CA.crt \
    -out CA.der.crt
echo



echo "##########################"
echo "# Create CA-signed certs #"
echo "##########################"

echo *Generate private key for $NAME*
[[ -e nginx/$NAME.key ]] || openssl genrsa -out nginx/$NAME.key 4096
echo


echo *Create certificate-signing request*
[[ -e $NAME.csr ]] || openssl req -new -key nginx/$NAME.key \
    -subj $SUBJECT \
    -out $NAME.csr
echo


echo *Create a config file for the extensions*
>$NAME.ext cat <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
extendedKeyUsage=serverAuth
[alt_names]
DNS.1 = $NAME
DNS.2 = localhost
IP.1 = 127.0.0.1
IP.2 = 192.168.178.188
IP.3 = 192.168.178.200
[v3_req]
extendedKeyUsage=serverAuth
EOF
echo


echo *Create the signed certificate*
openssl x509 -req -in $NAME.csr \
    -CA CA.crt -CAkey priv_and_pub.key -CAcreateserial \
    -extensions v3_req \
    -days 356 -sha256 -extfile $NAME.ext \
    -out nginx/$NAME.crt
echo


echo *Create pkcs12 certificate for android*
openssl pkcs12 -keypbe PBE-SHA1-3DES -certpbe PBE-SHA1-3DES \
    -export -in nginx/$NAME.crt -inkey nginx/$NAME.key \

    
echo *Setting permissions for pkcs12 certificate*
chmod 644 site/$NAME.p12

echo *Cleanup*
rm android_options.ext
rm $NAME.csr
rm $NAME.ext

echo *All done*




    
    

