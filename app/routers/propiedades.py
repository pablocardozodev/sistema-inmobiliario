from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.propiedad import Propiedad
from app.schemas.propiedad import PropiedadBase, PropiedadOut, PropiedadCreate

router = APIRouter(
    prefix="/propiedades",
    tags=["Propiedades"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# endopoint para listar propiedades
"""@router.get("/propiedades", response_model=list[PropiedadOut])
def listar_propiedades(db: Session = Depends(get_db)):
    return db.query(Propiedad).all()""" # Luego eliminar

# endopoint para listar todas las propiedades
@router.get("/", response_model=list[PropiedadOut], tags=["Propiedades"])
def listar_propiedades(db: Session = Depends(get_db)):
    return db.query(Propiedad).all()

# endpoint para liberar una propiedad (es decir, quitarle el cliente y dejar cliente_id = null)
@router.put("/{propiedad_id}/liberar_cliente", response_model=PropiedadOut, tags=["Propiedades"])
def liberar_cliente(propiedad_id: int, db: Session = Depends(get_db)):
    propiedad = db.query(Propiedad).filter(Propiedad.id == propiedad_id).first()
    if not propiedad:
        return {"error": "Propiedad no encontrada"}
    propiedad.cliente_id = None
    db.commit()
    db.refresh(propiedad)
    return propiedad

# endpoint para listar todas las propiedades que están libres (es decir, con cliente_id = null)
@router.get("/libres", response_model=list[PropiedadOut], tags=["Propiedades"])
def listar_propiedades_libres(db: Session = Depends(get_db)):
    propiedades = db.query(Propiedad).filter(Propiedad.cliente_id == None).all()
    return propiedades

# endopint para crear propiedades
@router.post("/", response_model=PropiedadOut)
def crear_propiedad(propiedad: PropiedadCreate, db: Session = Depends(get_db)):
    nueva_propiedad = Propiedad(**propiedad.dict())
    db.add(nueva_propiedad)
    db.commit()
    db.refresh(nueva_propiedad)
    return nueva_propiedad

# enopoint para editar/actualizar una propiedad
@router.put("/{propiedad_id}", response_model=PropiedadOut)
def actualizar_propiedad(propiedad_id: int, datos: PropiedadBase, db: Session = Depends(get_db)):
    propiedad = db.query(Propiedad).filter(Propiedad.id == propiedad_id).first()
    if not propiedad:
        return {"error": "Propiedad no encontrada"}
    for key, value in datos.model_dump().items():
        setattr(propiedad, key, value)
    db.commit()
    db.refresh(propiedad)
    return propiedad

# endopoint para eliminar propiedades
@router.delete("/{propiedad_id}")
def eliminar_propiedad(propiedad_id: int, db: Session = Depends(get_db)):
    propiedad = db.query(Propiedad).filter(Propiedad.id == propiedad_id).first()
    if not propiedad:
        return {"error": "Propiedad no encontrada"}
    db.delete(propiedad)
    db.commit()
    return {"mensaje": f"Propiedad {propiedad_id} eliminada"}

# endopoint para asignar cliente a una propiedad
@router.put("/{propiedad_id}/asignar_cliente/{cliente_id}", response_model=PropiedadOut)
def asignar_cliente(propiedad_id: int, cliente_id: int, db: Session = Depends(get_db)):
    propiedad = db.query(Propiedad).filter(Propiedad.id == propiedad_id).first()
    if not propiedad:
        return {"error": "Propiedad no encontrada"}
    propiedad.cliente_id = cliente_id
    db.commit()
    db.refresh(propiedad)
    return propiedad

# endpoint que reciba archivos. FastAPI lo maneja con UploadFile y File.
@router.post("/{propiedad_id}/upload-image")
async def upload_image(propiedad_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    propiedad = db.query(Propiedad).filter(Propiedad.id == propiedad_id).first()
    if not propiedad:
        return {"error": "Propiedad no encontrada"}

    # Guardar archivo en disco (ejemplo simple)
    file_location = f"static/propiedades/{propiedad_id}_{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Guardar ruta en la BD
    propiedad.foto = file_location
    db.commit()

    return {"mensaje": "Imagen subida correctamente", "ruta": file_location}

"""@router.post("/{propiedad_id}/upload-image")
async def upload_image(propiedad_id: int, file: UploadFile = File(...)):
    try:
        file_location = f"static/propiedades/{propiedad_id}_{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())
        return {"mensaje": "Imagen subida correctamente", "ruta": file_location}
    except Exception as e:
        return {"error": str(e)}"""


