import logging

logging.basicConfig(level=logging.INFO)

def info(message: str):
    logging.info(f"[INFO] {message}")

def error(message: str):
    logging.error(f"[ERROR] {message}")