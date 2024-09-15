import asyncio
import json
import os

from more_itertools import chunked

from app.data.common.service import StockCodeFileReader
from app.data.yahoo.source.constant import REALTIME_STOCK_LIST


async def spawn_cluster_process(stock_code_list_chunk):
    stock_code_list_chunk_serializable = [stock.model_dump() for stock in stock_code_list_chunk]

    command = [
        "python",
        "app/data/yahoo/realtime_stock/realtime_stock_collect.py",
        json.dumps(stock_code_list_chunk_serializable),
    ]
    
    env = os.environ.copy()
    env["PYTHONPATH"] = "/Users/kcw2297/Desktop/assetManagement/backend"

    process = await asyncio.create_subprocess_exec(*command, cwd="/Users/kcw2297/Desktop/assetManagement/backend", env=env)

    print(f"Spawned subprocess with PID: {process.pid}")

    return process.pid


async def main():
    stock_code_list = StockCodeFileReader.get_all_stock_code_list()

    stock_code_list_chunks = chunked(stock_code_list, REALTIME_STOCK_LIST)

    cluster_tasks = [spawn_cluster_process(stock_code_list_chunk) for stock_code_list_chunk in stock_code_list_chunks]

    pids = await asyncio.gather(*cluster_tasks, return_exceptions=True)

    print(f"All subprocesses started with PIDs: {pids}")


if __name__ == "__main__":
    asyncio.run(main())
