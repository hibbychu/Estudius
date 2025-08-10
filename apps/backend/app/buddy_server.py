import socket
import threading

host = '0.0.0.0'
port = 8001
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((host, port))
server_socket.listen()

clients = {}  # name -> socket

def broadcast_online_users():
    users = ",".join(clients.keys())
    for client_socket in clients.values():
        try:
            client_socket.send(f"ONLINE_USERS:{users}".encode())
        except:
            pass  # skip failed connections


def handle_client(client_socket, addr):
    try:
        name = client_socket.recv(1024).decode()
        clients[name] = client_socket
        print(f"{name} connected from {addr}")
        broadcast_online_users()

        while True:
            msg = client_socket.recv(1024).decode()
            if msg.lower() == 'exit':
                break
    except:
        pass
    finally:
        if name in clients:
            del clients[name]
        client_socket.close()
        print(f"{name} disconnected")
        broadcast_online_users()


print(f"[SERVER] Running on port {port}...")
while True:
    client_socket, addr = server_socket.accept()
    threading.Thread(target=handle_client, args=(client_socket, addr), daemon=True).start()
