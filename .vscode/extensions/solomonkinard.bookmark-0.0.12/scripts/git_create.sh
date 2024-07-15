#!/bin/bash -xe

# Initially copied from 2023/10/git/split.sh, but that only creates one file. It
# exists at the top level.

# Prepare directory.
BASE="/tmp/delete"
DIR=$BASE/`date +"%Y%m%d-%H%M%S"`
echo $DIR
mkdir -p $DIR
cd $DIR

# Initialize directory.
git init

# Random usernames
git config user.name "git fu"
git config user.email "git@fu.com"

# First commit adds a line to a file.
git checkout -b test

# Make a file.
# TODO: More lines, e.g. 200, for each file.
printf "line 1\n" > file_one.txt

# Make another directory and add a file there.
mkdir directory_two
printf "line 1\n" > directory_two/file_three.txt

# Commit for no reason at all. There is no need for git in this file.
git add .
git commit -m "Initial commit."