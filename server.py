# server.py - Server Lokal untuk Web Perencanaan Startup OMNIPLAY
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print("🎮 OMNIPLAY STARTUP & CLOUD ARENA PLATFORM")
        print(f"🚀 Server aktif di: {url}")
        print("Tekan Ctrl+C untuk menghentikan server.")
        print("=" * 60)
        try:
            webbrowser.open(url)
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer dihentikan.")
            httpd.server_close()

if __name__ == "__main__":
    run()
