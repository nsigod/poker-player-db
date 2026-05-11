#!/usr/bin/env python3
# 启动 FastAPI 开发服务器
import sys
import os

# 将 backend 目录设为包路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DEBUG", "true")

import uvicorn

if __name__ == "__main__":
    # 作为包导入
    import importlib
    # 用 run 方式直接启动
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dir=os.path.dirname(os.path.abspath(__file__)),
    )
