from pydantic import BaseModel
from typing import Optional

class PropiedadBase(BaseModel):
    ubicacion: str
    estado: str
    precio: float
    cliente_id: Optional[int] = None

class PropiedadCreate(PropiedadBase):
    pass

class PropiedadOut(PropiedadBase):
    id: int

    class Config:
        from_attributes = True