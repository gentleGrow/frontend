#!/bin/bash

# Activate the virtual environment
source /opt/pysetup/.venv/bin/activate

# Run setup.sh
bash ./etc/cronjob/setup.sh

# Run stock_jobs.sh
bash ./etc/cronjob/stock_jobs.sh

echo "Main setup completed successfully."
