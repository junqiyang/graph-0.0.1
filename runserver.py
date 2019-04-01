import socketserver
import http.server
from http.server import HTTPServer
import logging
import cgi
import subprocess
import time

HOST_NAME = 'localhost'
PORT_NUMBER = 9000


class MyHandler(http. server. SimpleHTTPRequestHandler):
    def do_HEAD(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_header()

    def do_GET(self):
        if "executeperl" in self.path:
            print("executeperl")
            pipe = subprocess.Popen(["perl", "./copyfile.pl"])
            self.respond("success")
        else:
            super(MyHandler, self).do_GET()

    def handle_http(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        return bytes(data, 'UTF-8')

    def respond(self, data):
        response = self.handle_http(data)
        self.wfile.write(response)


def run(server_class=HTTPServer, port=9000):
    server_address = ('', port)
    httpd = server_class(server_address, MyHandler)
    print ('Starting httpd...')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.serve_close()


if __name__ == "__main__":
    run()
