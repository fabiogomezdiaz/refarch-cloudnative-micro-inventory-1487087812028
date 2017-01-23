#!/usr/bin/env bash
# Use this to export variables and run app locally
# Since running locally and probably outside of bluemix
# make sure to get PUBLIC IPs for all required services

# MySQL stuff
export db_host=PASTE_MYSQL_PUBLIC_IP_HERE
export db_user=db_user
export db_password=Pass4dbUs3R
export db_database=inventorydb

# Elasticsearch stuff
# Paste Elasticsearch connection string here. It looks something like this
#   http(s)://ip:9200  or
#   http(s)://username:password@ip:9200
export es_connection_string=PASTE_ES_CONNECTION_STRING_HERE
export es_index=api
export es_doc_type=items

# Message Hub stuff
export mh_topic=inventory
export mh_message=refresh_cache

# Go to Message Hub instance on Bluemix, copy credentials,
# then paste them below where indicated.
# Also copy and paste Message Hub instance name where indicated
read -d '' VCAP_SERVICES <<"EOF"
{
    "messagehub": [
        {
            "credentials": PASTE_CREDENTIALS_HERE,
            "syslog_drain_url": null,
            "label": "messagehub",
            "provider": null,
            "plan": "standard",
            "name": "PASTE_MESSAGE_HUB_INSTANCE_NAME_HERE",
            "tags": [
                "ibm_dedicated_public",
                "web_and_app",
                "ibm_created"
            ]
        }
    ]
}
EOF