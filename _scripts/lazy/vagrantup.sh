#!/bin/bash

cd ../..
vagrant up
vagrant ssh -c "cd /var/www/node && node server.js"
