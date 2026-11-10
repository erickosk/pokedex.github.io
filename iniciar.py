"""
Inicia la Pokédex en tu computadora con Python.

Uso (desde la carpeta del proyecto):
    python iniciar.py

Abre el navegador en http://localhost:8000 (o el primer puerto libre que encuentre).
Para detenerlo, pulsa Ctrl+C en la terminal. Necesitas internet para ver las imágenes y los datos de cada Pokémon.
"""
import functools
import http.server
import os
import socketserver
import threading
import webbrowser

RAIZ = os.path.dirname(os.path.abspath(__file__))


class Manejador(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".webmanifest": "application/manifest+json", ".js": "text/javascript", ".svg": "image/svg+xml"}

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")   # mientras desarrollas, siempre ves la última versión
        super().end_headers()

    def log_message(self, formato, *args):
        pass                                              # sin ruido en la terminal


def main():
    manejador = functools.partial(Manejador, directory=RAIZ)
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    for puerto in range(8000, 8011):
        try:
            servidor = socketserver.ThreadingTCPServer(("127.0.0.1", puerto), manejador)
            break
        except OSError:
            continue
    else:
        raise SystemExit("No se encontró un puerto libre entre 8000 y 8010.")

    url = "http://localhost:{}/index.html".format(puerto)
    print("Pokédex lista en " + url)
    print("Pulsa Ctrl+C para detenerla.")
    threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nDetenida.")
    finally:
        servidor.server_close()


if __name__ == "__main__":
    main()
