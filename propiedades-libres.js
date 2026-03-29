// Listar propiedades libres en cards
async function cargarPropiedadesLibres() {
  try {
    const respuesta = await fetch("http://127.0.0.1:8000/propiedades/libres");
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    const propiedades = await respuesta.json();

    const lista = document.getElementById("lista-propiedades-libres");
    lista.innerHTML = "";

    propiedades.forEach(p => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-3";

      card.innerHTML = `
        <div class="card h-100">
          <img src="${p.foto || 'img/default.jpg'}" class="card-img-top" alt="Propiedad ${p.id}">
          <div class="card-body">
            <h5 class="card-title">${p.ubicacion}</h5>
            <p class="card-text">
              Precio: $${p.precio}<br>
              Estado: ${p.estado}
            </p>
            <button class="btn btn-success btn-sm">Asignar a cliente</button>
            <button class="btn btn-primary btn-sm">Editar</button>
            <button class="btn btn-danger btn-sm">Eliminar</button>
          </div>
        </div>
      `;

      // Eventos dinámicos
      card.querySelector(".btn-success").onclick = () => asignarPropiedad(p.id);
      card.querySelector(".btn-primary").onclick = () => mostrarFormularioEdicionPropiedad(p);
      card.querySelector(".btn-danger").onclick = () => eliminarPropiedad(p.id);

      lista.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    document.getElementById("lista-propiedades-libres").innerHTML =
      "<p>Error al cargar propiedades libres</p>";
  }
}

// Desde tu card o formulario, usás FormData para enviar el archivo.

async function subirImagen(propiedadId, fileInput) {
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const respuesta = await fetch(`http://127.0.0.1:8000/propiedades/libres${propiedadId}/upload-image`, {
      method: "POST",
      body: formData
    });
    if (!respuesta.ok) throw new Error("Error en la subida: " + respuesta.status);
    const data = await respuesta.json();
    console.log("Imagen subida:", data);
    alert("Imagen subida correctamente");
    cargarPropiedadesLibres(); // refresca cards
  } catch (error) {
    console.error(error);
    alert("Error al subir imagen");
  }
}

// INICIALIZACIÓN

// Bloque de inicialización
window.addEventListener("DOMContentLoaded", () => {
// Propiedades Libres
cargarPropiedadesLibres();
});