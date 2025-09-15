from .connection import db_manager

def create_record(table: str, data: dict) -> int:
    """Crée un enregistrement générique"""
    columns = ', '.join(data.keys())
    placeholders = ', '.join(['%s'] * len(data))
    query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders}) RETURNING id"
    
    result = db_manager.execute_query(query, tuple(data.values()))
    return result[0][0] if result else None

def update_record(table: str, record_id: int, data: dict) -> bool:
    """Met à jour un enregistrement générique"""
    set_clause = ', '.join([f"{key} = %s" for key in data.keys()])
    query = f"UPDATE {table} SET {set_clause} WHERE id = %s"
    
    values = list(data.values()) + [record_id]
    rows_affected = db_manager.execute_query(query, tuple(values))
    return rows_affected > 0

def delete_record(table: str, record_id: int) -> bool:
    """Supprime un enregistrement générique"""
    query = f"DELETE FROM {table} WHERE id = %s"
    rows_affected = db_manager.execute_query(query, (record_id,))
    return rows_affected > 0

def get_record_by_id(table: str, record_id: int) -> dict:
    """Récupère un enregistrement par ID"""
    query = f"SELECT * FROM {table} WHERE id = %s"
    result = db_manager.execute_query(query, (record_id,))
    return result[0] if result else None
