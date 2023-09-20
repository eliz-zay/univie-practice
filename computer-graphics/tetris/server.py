from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
from dotenv import load_dotenv


class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSRequestHandler, self).end_headers()

load_dotenv()

httpd = HTTPServer((os.getenv('HOST'), int(os.getenv('PORT'))), CORSRequestHandler)
httpd.serve_forever()