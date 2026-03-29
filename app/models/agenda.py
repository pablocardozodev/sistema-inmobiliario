from sqlalchemy import Column, Integer, String, Date, Time
from app.database import Base

class Visita(Base):
    __tablename__ = "visitas"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, index=True)          # día de la visita
    hora = Column(Time, index=True)           # hora de la visita
    lugar = Column(String, index=True)        # lugar de la visita
    descripcion = Column(String, nullable=True)  # detalle opcional
    estado = Column(String, default="pendiente") # pendiente, realizada, cancelada