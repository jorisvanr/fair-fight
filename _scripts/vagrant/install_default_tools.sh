#!/bin/bash
date
cp -f /usr/share/zoneinfo/Europe/Amsterdam /etc/localtime.dpkg-new && mv -f /etc/localtime.dpkg-new /etc/localtime
# Install default tools such as Midnight Command and htop with the correct config#
# Added dos2unix to allow changing to unix encoding is a file get broken due to windows enconding of line endings
apt-get update
apt-get install -y mc htop dos2unix git sendmail python-software-properties --fix-missing
