import psycopg2
from psycopg2.pool import SimpleConnectionPool
from contextlib import contextmanager
from ..config.settings import Config

class DatabaseManager:
    def __init__(self):
        self.pool = None
        self.init_pool()
    
    def init_pool(self):
        """Initialise le pool de connexions"""
        try:
            self.pool = SimpleConnectionPool(
                1, 20,  # min et max connexions
                host=Config.DB_HOST,
                port=Config.DB_PORT,
                database=Config.DB_NAME,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD
            )
        except Exception as e:
            print(f"Erreur de connexion à la base : {e}")
            raise
    
    @contextmanager
    def get_connection(self):
        """Context manager pour les connexions"""
        conn = None
        try:
            conn = self.pool.getconn()
            yield conn
        finally:
            if conn:
                self.pool.putconn(conn)
    
    def execute_query(self, query: str, params: tuple = None):
        """Exécute une requête et retourne les résultats"""
        with self.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                if query.strip().upper().startswith('SELECT'):
                    return cursor.fetchall()
                conn.commit()
                return cursor.rowcount

# Instance globale
db_manager = DatabaseManager()
