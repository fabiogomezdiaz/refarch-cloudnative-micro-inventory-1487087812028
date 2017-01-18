#!/bin/bash

# Copy SQL params to every folder
cp config.json load_cache
cp config.json create_index
cp config.json delete_index

# Create Actions
# - Install dependencies
# - Package actions in ZIP
# - Delete action (if exists)
# - Create action

cd load_cache
npm install
zip -r action.zip *
wsk action delete load_cache
wsk action create load_cache --kind nodejs:6 action.zip
cd ..

cd create_index
npm install
zip -r action.zip *
wsk action delete create_index
wsk action create create_index --kind nodejs:6 action.zip
cd ..

cd delete_index
npm install
zip -r action.zip *
wsk action delete delete_index
wsk action create delete_index --kind nodejs:6 action.zip
cd ..

# Clean Up
rm load_cache/config.json
rm load_cache/action.zip
rm -rf load_cache/node_modules

rm create_index/config.json
rm create_index/action.zip
rm -rf create_index/node_modules

rm delete_index/config.json
rm delete_index/action.zip
rm -rf delete_index/node_modules
