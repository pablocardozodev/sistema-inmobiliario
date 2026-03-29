from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Importa tus routers
from app.routers import clientes, propiedades, agenda   # 👈 ajustá según tu estructura de carpetas

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # para pruebas
    allow_credentials=True,
    #allow_methods=["GET", "POST", "PUT", "DELETE"],   # incluye OPTIONS
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Routers originales
app.include_router(clientes.router)
app.include_router(propiedades.router)
app.include_router(agenda.router)
# Servir imágenes estáticas

app.mount("/static", StaticFiles(directory="static"), name="static")

# uvicorn app.main:app --reload  /Sirve para Ejecutar el servidor  