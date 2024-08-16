#!/bin/bash

if [[ $# -eq 1 ]]; then
  USERNAME="$1"
else
  read -r -p "Enter username: " USERNAME
fi

read -r -s -p "Enter password: " PASSWORD
echo >&2

encrypted_password="md5$(printf "%s%s" "$PASSWORD" "$USERNAME" | openssl md5 -binary | xxd -p)"

echo "\"$USERNAME\" \"$encrypted_password\""