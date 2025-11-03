import os
from dotenv import load_dotenv
import pyodbc
from dotenv import load_dotenv

load_dotenv()


# Load environment variables from .env file
load_dotenv()
DRIVER = os.getenv('DRIVER')
SQL_SERVER_HOST = os.getenv('SQL_SERVER_HOST')
SQL_SERVER_PORT = os.getenv('SQL_SERVER_PORT')
SQL_SERVER_USER = os.getenv('SQL_SERVER_USER')
SQL_SERVER_PASSWORD = os.getenv('SQL_SERVER_PASSWORD')
SQL_SERVER_DB = os.getenv('SQL_SERVER_DB')

# Connection string for SQL Server
conn_str = (
    f'DRIVER={DRIVER};'
    f'SERVER={SQL_SERVER_HOST},{SQL_SERVER_PORT};'
    f'DATABASE={SQL_SERVER_DB};'
    f'UID={SQL_SERVER_USER};'
    f'PWD={SQL_SERVER_PASSWORD}'
)

def test_sql_server_connection():
    try:
        conn = pyodbc.connect(conn_str, timeout=5)
        cursor = conn.cursor()
        cursor.execute('SELECT 1')
        result = cursor.fetchone()
        print('Connection successful:', result)
        conn.close()
    except Exception as e:
        print('Connection failed:', e)

if __name__ == "__main__":
    test_sql_server_connection()
