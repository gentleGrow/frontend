#!/bin/bash

source /opt/pysetup/.venv/bin/activate

bash ./etc/scripts/setup_stocks.sh

bash ./etc/scripts/stock_jobs.sh

echo "Main setup completed successfully."
