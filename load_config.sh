#!/usr/bin/env bash

# Check if jq is installed
type jq >/dev/null 2>&1 || {
    printf >&2 "I require jq but it's not installed.\n"
    printf >&2 "To install jq, go to:\n\thttps://stedolan.github.io/jq/download/\n"
    printf >&2 "Aborting.\n"
    return
}

export db_host=$(cat config.json | jq .db_host | tr -d '\"')
export db_user=$(cat config.json | jq .db_user | tr -d '\"')
export db_password=$(cat config.json | jq .db_password | tr -d '\"')
export db_database=$(cat config.json | jq .db_database | tr -d '\"')
export es_connection_string=$(cat config.json | jq .es_connection_string | tr -d '\"')
export es_index=$(cat config.json | jq .es_index | tr -d '\"')
export es_doc_type=$(cat config.json | jq .es_doc_type | tr -d '\"')
export mh_topic=$(cat config.json | jq .mh_topic | tr -d '\"')
export mh_message=$(cat config.json | jq .mh_message | tr -d '\"')
export VCAP_SERVICES=$(cat config.json | jq .VCAP_SERVICES)