                      // PROPIEDADES

// Listar todas las propiedades en tabla
async function cargarTodasLasPropiedades() {
  try {
    const respuesta = await fetch("http://127.0.0.1:8000/propiedades/");
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    let propiedades = await respuesta.json();

    // Obtener criterio de orden
    const criterio = document.getElementById("filtro-orden").value;

    if (criterio === "ubicacion") {
      propiedades.sort((a, b) => a.ubicacion.localeCompare(b.ubicacion));
    } else if (criterio === "precio") {
      propiedades.sort((a, b) => a.precio - b.precio);
    } else if (criterio === "estado") {
      propiedades.sort((a, b) => a.estado.localeCompare(b.estado));
    }

    // Renderizado tabla y cards
    const tablaBody = document.querySelector("#lista-todas-propiedades tbody");
    tablaBody.innerHTML = "";
    const cardsContainer = document.querySelector("#vista-cards");
    cardsContainer.innerHTML = "";

    propiedades.forEach(p => {
      // --- Tabla ---
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${p.imagen ? `<img src="http://127.0.0.1:8000/static/${p.imagen}" width="80">` : "Sin imagen"}</td>
        <td>${p.ubicacion}</td>
        <td>$${p.precio}</td>
        <td>${p.estado}</td>
        <td>
          ${p.cliente_id ? `<button class="btn btn-sm btn-info">Ver cliente</button>` : ""}
          <button class="btn btn-sm btn-primary">Editar</button>
          <button class="btn btn-sm btn-danger">Eliminar</button>
          <button class="btn btn-sm btn-warning">Subir imagen</button>
        </td>
      `;

      // 🔹 Reasignar eventos
      if (p.cliente_id) fila.querySelector(".btn-info").onclick = () => cargarClienteAsignado(p.cliente_id);
      fila.querySelector(".btn-primary").onclick = () => mostrarFormularioEdicionPropiedad(p);
      fila.querySelector(".btn-danger").onclick = () => eliminarPropiedad(p.id);
      fila.querySelector(".btn-warning").onclick = () => mostrarFormularioUpload(p.id);

      tablaBody.appendChild(fila);

      // --- Card ---
      const card = document.createElement("div");
      card.className = "col-md-4 mb-3";
      card.innerHTML = `
        <div class="card h-100">
          ${p.imagen ? `<img src="http://127.0.0.1:8000/static/${p.imagen}" class="card-img-top" alt="Foto propiedad">` : ""}
          <div class="card-body">
            <h5 class="card-title">${p.ubicacion}</h5>
            <p class="card-text">Precio: $${p.precio}</p>
            <p class="card-text">Estado: ${p.estado}</p>
          </div>
          <div class="card-footer">
            ${p.cliente_id ? `<button class="btn btn-sm btn-info">Ver cliente</button>` : ""}
            <button class="btn btn-sm btn-primary">Editar</button>
            <button class="btn btn-sm btn-danger">Eliminar</button>
            <button class="btn btn-sm btn-warning">Subir imagen</button>
          </div>
        </div>
      `;

      // 🔹 Reasignar eventos
      if (p.cliente_id) card.querySelector(".btn-info").onclick = () => cargarClienteAsignado(p.cliente_id);
      card.querySelector(".btn-primary").onclick = () => mostrarFormularioEdicionPropiedad(p);
      card.querySelector(".btn-danger").onclick = () => eliminarPropiedad(p.id);
      card.querySelector(".btn-warning").onclick = () => mostrarFormularioUpload(p.id);

      cardsContainer.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
}

// 🔹 Evento para cambiar filtro
document.getElementById("filtro-orden").onchange = cargarTodasLasPropiedades;

// El botón alterna entre mostrar tabla y cards
document.getElementById("toggle-vista").onchange = (e) => {
  const tabla = document.getElementById("vista-tabla");
  const cards = document.getElementById("vista-cards");
  const label = document.querySelector("label[for='toggle-vista']");

  if (e.target.checked) {
    // Mostrar cards
    tabla.classList.add("d-none");
    cards.classList.remove("d-none");
    label.textContent = "Vista en cards";
  } else {
    // Mostrar tabla
    tabla.classList.remove("d-none");
    cards.classList.add("d-none");
    label.textContent = "Vista en tabla";
  }
};

// Asignar propiedad
function asignarPropiedad(propId, clienteId) {
  // Ejemplo de lógica: enviar al backend la asignación
  fetch(`/propiedades/${propId}/asignar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clienteId })
  })
  .then(res => res.json())
  .then(data => {
    alert("Propiedad asignada correctamente");
    cargarTodasLasPropiedades(); // refrescar lista
    cargarTodosLosClientes();    // refrescar lista
  })
  .catch(err => console.error("Error al asignar propiedad:", err));
}

// Asignar cliente a una propiedad
async function cargarClienteAsignado(clienteId) {
  try {
    const respuesta = await fetch(`http://127.0.0.1:8000/clientes/${clienteId}`);
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    const cliente = await respuesta.json();
    alert(`Cliente asignado: ${cliente.nombre} - ${cliente.email}`);
  } catch (error) {
    console.error(error);
    alert("Error al cargar cliente asignado");
  }
}

// Mostrar formulario al presionar "Nueva Propiedad"
/*document.getElementById("btn-nueva-propiedad").addEventListener("click", () => {
document.getElementById("seccion-crear-propiedad").style.display = "block";
});*/ // De logica anterior, se usa ahora modal flotante. Luego eliminar si no se usa

/*const btnNueva = document.getElementById("btn-nueva-propiedad");
if (btnNueva) {
  btnNueva.addEventListener("click", () => {
    document.getElementById("seccion-crear-propiedad").style.display = "block";
  });
}*/ // se comenta para posible uso en caso de unificar la lógica, sino elimimar luego

// Crear propiedades
/*async function crearPropiedad(event) {
  event.preventDefault();

  const ubicacion = document.getElementById("ubicacion").value;
  const precio = document.getElementById("precio").value;
  const estado = document.getElementById("estado").value;

  try {
    const respuesta = await fetch("http://127.0.0.1:8000/propiedades/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ubicacion, precio, estado })
    });
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    const nuevaPropiedad = await respuesta.json();
    alert(`Propiedad creada: ${nuevaPropiedad.ubicacion} (${nuevaPropiedad.estado})`);
    
    // Refrescar listas 
    cargarTodasLasPropiedades();
    
    // limpiar y ocultar formulario
    limpiarFormularioPropiedad();
    document.getElementById("seccion-crear-propiedad").style.display = "none";

  } catch (error) {
    console.error(error);
    alert("Error al crear propiedad");
  }
}*/ // Función de lógica anterior, ahora se usa modal flotante. Eliminar si no se usa

// Limpiar formulario propiedad
/*function limpiarFormularioPropiedad() {
  document.getElementById("ubicacion").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("estado").value = "libre"; // 👈 vuelve al valor por defecto
}

// Limpiar: borra campos pero deja el formulario abierto
document.getElementById("btn-limpiar-propiedad").addEventListener("click", limpiarFormularioPropiedad);

// form para crear propiedad
document.getElementById("form-propiedad").addEventListener("submit", crearPropiedad);

// Cancelar: borra campos y oculta el formulario
document.getElementById("btn-cancelar-propiedad").addEventListener("click", () => {
  limpiarFormularioPropiedad();
  document.getElementById("seccion-crear-propiedad").style.display = "none";
  alert("Operación cancelada");
});*/ // se copio mas abajo. si no se usa borrar


//Nuevo Crear Propiedad en formato flotante
async function crearPropiedad(event) {
  event.preventDefault();

  const ubicacion = document.getElementById("ubicacion").value;
  const precio = document.getElementById("precio").value;
  const estado = document.getElementById("estado").value;

  try {
    const respuesta = await fetch("http://127.0.0.1:8000/propiedades/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ubicacion, precio, estado })
    });

    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    const nuevaPropiedad = await respuesta.json();
    alert(`Propiedad creada: ${nuevaPropiedad.ubicacion} (${nuevaPropiedad.estado})`);

    // Refrescar listas 
    cargarTodasLasPropiedades();
    
    // limpiar y cerrar modal de creación de propiedad
    limpiarFormularioPropiedad();

    // cerrar modal automáticamente
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalCrearPropiedad"));
    modal.hide();

  } catch (error) {
    console.error(error);
    alert("Error al crear propiedad");
  }

    cargarTodasLasPropiedades();
    limpiarFormularioPropiedad();

}

/*
document.getElementById("form-propiedad").addEventListener("submit", crearPropiedad);
document.getElementById("btn-limpiar-propiedad").addEventListener("click", limpiarFormularioPropiedad);

// Vincular el formulario con la función de creación de propiedad
document.getElementById("form-propiedad").addEventListener("submit", crearPropiedad);

// Limpiar: borra campos
document.getElementById("btn-limpiar-propiedad").addEventListener("click", limpiarFormularioPropiedad);
*/ // De lógica de cliente, se usa ahora en modal flotante. Luego eliminar si no se usa


// Limpiar formulario propiedad
function limpiarFormularioPropiedad() {
  document.getElementById("ubicacion").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("estado").value = "libre"; // 👈 vuelve al valor por defecto
}

// Limpiar: borra campos pero deja el formulario abierto
document.getElementById("btn-limpiar-propiedad").addEventListener("click", limpiarFormularioPropiedad);

// form para crear propiedad
document.getElementById("form-propiedad").addEventListener("submit", crearPropiedad);

// Cancelar: borra campos y oculta el formulario
/* document.getElementById("btn-cancelar-propiedad").addEventListener("click", () => {
  limpiarFormularioPropiedad();
  document.getElementById("seccion-crear-propiedad").style.display = "none";
  alert("Operación cancelada");
});*/ // De logica anterior, ahora el formulario se cierra por Bootstrap, eliminar si no se usa


// Editar propiedades
/* function mostrarFormularioEdicionPropiedad(propiedad) {
  document.getElementById("editar-prop-id").value = propiedad.id;
  document.getElementById("editar-ubicacion").value = propiedad.ubicacion;
  document.getElementById("editar-precio").value = propiedad.precio;
  document.getElementById("editar-estado").value = propiedad.estado;

  // mostrar formulario
  document.getElementById("seccion-editar-propiedad").style.display = "block";
}

async function editarPropiedad(event) {
  event.preventDefault();
  const id = document.getElementById("editar-prop-id").value;
  const ubicacion = document.getElementById("editar-ubicacion").value;
  const precio = document.getElementById("editar-precio").value;
  const estado = document.getElementById("editar-estado").value;

  try {
    const respuesta = await fetch(`http://127.0.0.1:8000/propiedades/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ubicacion, precio, estado })
    });
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    const propiedadActualizada = await respuesta.json();
    alert(`Propiedad actualizada: ${propiedadActualizada.ubicacion} (${propiedadActualizada.estado})`);
    // Refrescar listas

    cargarTodasLasPropiedades();

    // Limpiar y ocultar formulario de edición
    limpiarFormularioEdicionPropiedad();
    document.getElementById("seccion-editar-propiedad").style.display = "none";

  } catch (error) {
    console.error(error);
    alert("Error al editar propiedad");
  }
} */ // Ahora se usa nueva logica por modal flotante. Esta eliminar luego si no se usa

// Limpiar formulario
/* function limpiarFormularioEdicionPropiedad() {
  document.getElementById("editar-prop-id").value = "";
  document.getElementById("editar-ubicacion").value = "";
  document.getElementById("editar-precio").value = "";
  document.getElementById("editar-estado").value = "libre"; // vuelve al valor por defecto
}
function cancelarEdicionPropiedad() {
  document.getElementById("editar-prop-id").value = "";
  document.getElementById("editar-ubicacion").value = "";
  document.getElementById("editar-precio").value = "";
  document.getElementById("editar-estado").value = "libre"; // 👈 vuelve al valor por defecto
  alert("Edición cancelada");
}

document.getElementById("form-editar-propiedad").addEventListener("submit", editarPropiedad);
//document.getElementById("btn-cancelar-edicion-prop").addEventListener("click", cancelarEdicionPropiedad);

// Cancelar edición
document.getElementById("btn-cancelar-edicion-prop").addEventListener("click", () => {
  limpiarFormularioEdicionPropiedad();
  document.getElementById("seccion-editar-propiedad").style.display = "none";
});

// Restarura valores en form de editar si se arrepeinte antes guardar
let propiedadOriginal = null;

function mostrarFormularioEdicion(prop) {
  // Guardar valores originales en memoria
  propiedadOriginal = { ...prop };

  // Cargar valores en el formulario
  document.getElementById("editar-prop-id").value = prop.id;
  document.getElementById("editar-ubicacion").value = prop.ubicacion;
  document.getElementById("editar-precio").value = prop.precio;
  document.getElementById("editar-estado").value = prop.estado;

  document.getElementById("seccion-editar-propiedad").style.display = "block";
} */ // Usamos nueva logica

/*document.getElementById("btn-restaurar-edicion-prop").addEventListener("click", () => {
  if (propiedadOriginal) {
    document.getElementById("editar-ubicacion").value = propiedadOriginal.ubicacion;
    document.getElementById("editar-precio").value = propiedadOriginal.precio;
    document.getElementById("editar-estado").value = propiedadOriginal.estado;
  } else {
    alert("No hay valores originales cargados");
  }
});*/ // De lógica anterior. Luego eliminar si no se usa


// Nuevo Editar Propiedades por modal flotante
function mostrarFormularioEdicionPropiedad(propiedad) {
  // Cargar datos en los inputs del modal
  document.getElementById("editar-id").value = propiedad.id;
  document.getElementById("editar-ubicacion").value = propiedad.ubicacion;
  document.getElementById("editar-precio").value = propiedad.precio;
  document.getElementById("editar-estado").value = propiedad.estado;

  // Abrir modal con Bootstrap
  const modal = new bootstrap.Modal(document.getElementById("modalEditarPropiedad"));
  modal.show();
}

// Nuevo Guardar cambios de edición de propeidades (PUT)
async function editarPropiedad(event) {
  event.preventDefault();

  const id = document.getElementById("editar-id").value;
  const ubicacion = document.getElementById("editar-ubicacion").value;
  const precio = document.getElementById("editar-precio").value;
  const estado = document.getElementById("editar-estado").value;

  try {
    const respuesta = await fetch(`http://127.0.0.1:8000/propiedades/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ubicacion, precio, estado })
    });

    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);

    const propiedadActualizada = await respuesta.json();
    alert(`Propiedad actualizada: ${propiedadActualizada.ubicacion} ${propiedadActualizada.precio} ${propiedadActualizada.estado}`);

    cargarTodasLasPropiedades(); // refrescar lista

    // limpiar formulario
    document.getElementById("form-editar-propiedad").reset();

    // 🔹 cerrar modal automáticamente
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarPropiedad"));
    modal.hide();

  } catch (error) {
    console.error(error);
    alert("Error al editar propieda");
  }
}

// Vincular el formulario con la función de edición
document.getElementById("form-editar-propiedad").addEventListener("submit", editarPropiedad);

// Eliminar propiedades
async function eliminarPropiedad(propiedadId) {
  console.log("ID recibido en eliminarPropiedad:", propiedadId); //para pruebas en consola

  if (!confirm(`¿Seguro que quieres eliminar la propiedad con ID ${propiedadId}?`)) return;
  //if (!confirm(`¿Seguro que quieres eliminar la propiedad ${propiedadId.ubicacion} (ID ${propiedadId}) por $${propiedadId.precio}?`)) return;
  try {
    const respuesta = await fetch(`http://127.0.0.1:8000/propiedades/${propiedadId}`, {
      method: "DELETE"
    });
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    alert("Propiedad eliminada correctamente");
    cargarTodasLasPropiedades();
  } catch (error) {
    console.error(error);
    alert("Error al eliminar propiedad");
  }
}

//---LÓGICA PARA SUBIR IMAGEN

// Función para mostrar el formulario de upload de imagen
function mostrarFormularioUpload(propiedadId) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.onchange = () => {
    subirImagen(propiedadId, fileInput);
  };

  fileInput.click(); // dispara el selector de archivos
} 

// Función para subir la imagen
async function subirImagen(propiedadId, fileInput) {
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const respuesta = await fetch(`http://127.0.0.1:8000/propiedades/${propiedadId}/upload-image`, {
      method: "POST",
      body: formData
    });
    if (!respuesta.ok) throw new Error("Error en la subida: " + respuesta.status);
    const data = await respuesta.json();
    alert("Imagen subida correctamente");
    cargarTodasLasPropiedades(); // refresca la tabla
  } catch (error) {
    console.error(error);
    alert("Error al subir imagen");
  }
}
// INICIALIZACIÓN

// Bloque de inicialización
window.addEventListener("DOMContentLoaded", () => {
// Propiedades
cargarTodasLasPropiedades();
});