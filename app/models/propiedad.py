from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Propiedad(Base):
    __tablename__ = "propiedades"

    id = Column(Integer, primary_key=True, index=True)
    ubicacion = Column(String, index=True)
    estado = Column(String, default="Disponible")
    precio = Column(Float)

    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=True)
    cliente = relationship("Cliente", backref="propiedades")

    imagen = Column(String, nullable=True)  # ruta de la imagen



