bind = "0.0.0.0:5001"
workers = 4  # Adjust based on CPU cores
worker_class = "sync"
timeout = 120
loglevel = "info"
accesslog = "-"
errorlog = "-"

capture_output = True
enable_stdio_inheritance = True
