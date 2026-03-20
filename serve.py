#!/usr/bin/env python3
import http.server
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
httpd = http.server.HTTPServer(("", 8080), http.server.SimpleHTTPRequestHandler)
print("Serving on http://localhost:8080")
httpd.serve_forever()
