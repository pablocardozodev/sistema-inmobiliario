from pydantic import BaseModel
from datetime import date, time

class VisitaBase(BaseModel):
    fecha: date
    hora: time
    lugar: str
    descripcion: str | None = None
    estado: str = "pendiente"

class VisitaCreate(VisitaBase):
    pass

class VisitaOut(VisitaBase):
    id: int

    class Config:
        orm_mode = True