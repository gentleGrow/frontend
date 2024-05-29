import os
import subprocess

from data.common.config import logging

setup_sh_path = "./etc/cronjob/setup.sh"
stock_jobs_sh_path = "./etc/cronjob/stock_jobs.sh"


def make_executable(script_path):
    os.chmod(script_path, 0o755)


def run_script(script_path):
    result = subprocess.run(["bash", script_path], capture_output=True, text=True)
    if result.returncode == 0:
        logging.info(f"Successfully ran {script_path}")
    else:
        logging.error(f"Error running {script_path}")


make_executable(setup_sh_path)
make_executable(stock_jobs_sh_path)

run_script(setup_sh_path)
run_script(stock_jobs_sh_path)
