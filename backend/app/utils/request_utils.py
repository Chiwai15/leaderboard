from flask import request


def extract_request_meta():
    return {
        "method": request.method,  # use string, not Enum
        "route": request.path,
        "ip": request.remote_addr,
        "request_data": request.get_json(silent=True),
        "request_param": request.args.to_dict(),
    }
