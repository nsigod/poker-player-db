# 腾讯云 SCF 启动文件
import os
import sys

# 将 backend 目录加入 Python 路径
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app

# SCF 通过 WSGI/ASGI 模式运行
# uvicorn 已在 requirements.txt 中安装
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
