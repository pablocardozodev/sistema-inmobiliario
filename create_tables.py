from app.database import Base, engine
from app.models import propiedad, cliente, agenda  # importa todos los modelos

def crear_tablas():
    print("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("Tablas creadas con éxito.")

if __name__ == "__main__":
    crear_tablas()
