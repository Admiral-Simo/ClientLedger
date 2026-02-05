#!/bin/bash

DB_IDENTIFIER="my-terraform-rds-instance"
REGION="eu-west-3"

get_status() {
    aws rds describe-db-instances \
        --db-instance-identifier $DB_IDENTIFIER \
        --region $REGION \
        --query "DBInstances[0].DBInstanceStatus" \
        --output text
}

STATUS=$(get_status)
echo "Current status: $STATUS"

if [ "$STATUS" == "available" ]; then
    echo "Stopping database..."
    aws rds stop-db-instance --db-instance-identifier $DB_IDENTIFIER --region $REGION --no-cli-pager

    # NEW: Wait for it to finish stopping
    echo "Waiting for 'stopped' state (this takes a few mins)..."
    aws rds wait db-instance-stopped --db-instance-identifier $DB_IDENTIFIER --region $REGION
    echo "Database is now fully STOPPED."

elif [ "$STATUS" == "stopped" ]; then
    echo "Starting database..."
    aws rds start-db-instance --db-instance-identifier $DB_IDENTIFIER --region $REGION --no-cli-pager

    # NEW: Wait for it to be ready to use
    echo "Waiting for 'available' state..."
    aws rds wait db-instance-available --db-instance-identifier $DB_IDENTIFIER --region $REGION
    echo "Database is now ONLINE and ready for connections."

else
    echo "Database is in '$STATUS'. Please wait for the current process to finish."
fi
