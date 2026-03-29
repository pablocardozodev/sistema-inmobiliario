


                            // CLIENTES
// Listar todos los clientes
/*async function cargarTodosLosClientes() {
  try {
    const respuesta = await fetch("http://127.0.0.1:8000/clientes/");
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    const clientes = await respuesta.json();

    const lista = document.getElementById("lista-todos-clientes");
    lista.innerHTML = "";
    
    clientes.forEach(c => {
      const item = document.createElement("li");
      item.textContent = `${c.nombre} - ${c.email}`;

      // Botón para ver propiedades del cliente
      const btnPropiedades = document.createElement("button");
      btnPropiedades.textContent = "Ver propiedades";
      btnPropiedades.onclick = () => cargarPropiedadesDeCliente(c.id);
      item.appendChild(btnPropiedades);

      // Botón editar
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.onclick = () => mostrarFormularioEdicionCliente(c);
      item.appendChild(btnEditar);

      // Botón eliminar
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar";
      btnEliminar.onclick = () => eliminarCliente(c.id);
      item.appendChild(btnEliminar);

      lista.appendChild(item);
    });
  } catch (error) {
    console.error(error);
    document.getElementById("lista-todos-clientes").innerHTML = "<li>Error al cargar clientes</li>";
  }
}*/

// Nuevo Listar todos los clientes
async function cargarTodosLosClientes() {
  try {
    const respuesta = await fetch("http://127.0.0.1:8000/clientes/");
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    let clientes = await respuesta.json();

    // Obtener criterio de orden
    const criterio = document.getElementById("filtro-orden").value;

    if (criterio === "apellido-asc") {
      clientes.sort((a, b) => a.apellido.localeCompare(b.apellido));
    } else if (criterio === "apellido-desc") {
      clientes.sort((a, b) => b.apellido.localeCompare(a.apellido));
    } else if (criterio === "nombre-asc") {
      clientes.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (criterio === "nombre-desc") {
      clientes.sort((a, b) => b.nombre.localeCompare(a.nombre));
} // Solo usamos por apellido
    
    // Renderizado tabla y cards
    const tablaBody = document.querySelector("#lista-todos-clientes tbody");
    tablaBody.innerHTML = "";

    const cardsContainer = document.querySelector("#vista-cards-clientes");
    cardsContainer.innerHTML = "";

    clientes.forEach(c => {
      const clienteCompleto = `${c.apellido} ${c.nombre}`; // Trae de la BD y une ambos objetos apellido y nombre
      // --- Tabla ---
      const fila = document.createElement("tr");
      
      fila.innerHTML = `
        <td>${clienteCompleto}</td>
        <td>${c.email}</td>
        <td>${c.telefono}</td>
        <td>
          <button class="btn btn-sm btn-primary">Editar</button>
          <button class="btn btn-sm btn-danger">Eliminar</button>
        </td>
      `;
      fila.querySelector(".btn-primary").onclick = () => mostrarFormularioEdicionCliente(c);
      fila.querySelector(".btn-danger").onclick = () => eliminarCliente(c.id);
      tablaBody.appendChild(fila);

      // --- Card ---
      const card = document.createElement("div");
      card.className = "col-md-4 mb-3";
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${clienteCompleto}</h5>
            <p class="card-text">Email: ${c.email}</p>
            <p class="card-text">Teléfono: ${c.telefono}</p>
          </div>
          <div class="card-footer">
            <button class="btn btn-sm btn-primary">Editar</button>
            <button class="btn btn-sm btn-danger">Eliminar</button>
          </div>
        </div>
      `;
      card.querySelector(".btn-primary").onclick = () => mostrarFormularioEdicionCliente(c);
      card.querySelector(".btn-danger").onclick = () => eliminarCliente(c.id);
      cardsContainer.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
}

// 🔹 Evento para cambiar filtro
document.getElementById("filtro-orden").onchange = cargarTodosLosClientes;

// Toggle vista clientes
document.getElementById("toggle-vista-clientes").onchange = (e) => {
  const tabla = document.getElementById("vista-tabla-clientes");
  const cards = document.getElementById("vista-cards-clientes");
  const label = document.querySelector("label[for='toggle-vista-clientes']");

  if (e.target.checked) {
    tabla.classList.add("d-none");
    cards.classList.remove("d-none");
    label.textContent = "Vista en cards";
  } else {
    tabla.classList.remove("d-none");
    cards.classList.add("d-none");
    label.textContent = "Vista en tabla";
  }
};

// Limpiar el formulario y “salir” del modo edición
function limpiarFormularioEdicionCliente() {
  document.getElementById("editar-id").value = "";
  document.getElementById("editar-nombre").value = "";
  document.getElementById("editar-email").value = "";
  document.getElementById("editar-telefono").value = "";
  alert("Edición cancelada");
}

// Cancelar edición
/*document.getElementById("btn-cancelar-edicion-cliente").addEventListener("click", () => {
  limpiarFormularioEdicionCliente();
  document.getElementById("seccion-editar-cliente").style.display = "none";
});*/ // Ahora el botón Cancelar del modal ya tiene , así que no necesitás manipular . 
// Basta con limpiar el formulario y dejar que Bootstrap cierre el modal


// Eliminar cliente
async function eliminarCliente(clienteId) {
  if (!confirm("¿Seguro que quieres eliminar este cliente?")) return;
  try {
    const respuesta = await fetch(`http://127.0.0.1:8000/clientes/${clienteId}`, {
      method: "DELETE"
    });
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    alert("Cliente eliminado correctamente");
    cargarTodosLosClientes(); // refrescar lista
  } catch (error) {
    console.error(error);
    alert("Error al eliminar cliente");
  }
}

// Editar clientes
/*function mostrarFormularioEdicionCliente(cliente) {
  document.getElementById("editar-id").value = cliente.id;
  document.getElementById("editar-nombre").value = cliente.nombre;
  document.getElementById("editar-email").value = cliente.email;
  document.getElementById("editar-telefono").value = cliente.telefono;

  document.getElementById("seccion-editar-cliente").style.display = "block";
}*/ // Probasmos nuevo. Luego eliminar

// Nuevo Editar Clientes
function mostrarFormularioEdicionCliente(cliente) {
  // Cargar datos en los inputs del modal
  document.getElementById("editar-id").value = cliente.id;
  document.getElementById("editar-nombre").value = cliente.nombre;
  document.getElementById("editar-apellido").value = cliente.apellido;
  document.getElementById("editar-email").value = cliente.email;
  document.getElementById("editar-telefono").value = cliente.telefono || "";

  // Abrir modal con Bootstrap
  const modal = new bootstrap.Modal(document.getElementById("modalEditarCliente"));
  modal.show();
}

// Guardar cambios de edición de clientes (PUT)
/*async function editarCliente(event) {
  event.preventDefault();
  const id = document.getElementById("editar-id").value;
  const nombre = document.getElementById("editar-nombre").value;
  const email = document.getElementById("editar-email").value;
  const telefono = document.getElementById("editar-telefono").value;

  try {
    const respuesta = await fetch(`http://127.0.0.1:8000/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, telefono })
    });
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    const clienteActualizado = await respuesta.json();
    alert(`Cliente actualizado: ${clienteActualizado.nombre}`);
    cargarTodosLosClientes(); // refrescar lista
  } catch (error) {
    console.error(error);
    alert("Error al editar cliente");
  }
}

document.getElementById("form-editar-cliente").addEventListener("submit", editarCliente);*/ // Probamos nuevo

// Nuevo Guardar cambios de edición de clientes (PUT)
async function editarCliente(event) {
  event.preventDefault();

  const id = document.getElementById("editar-id").value;
  const nombre = document.getElementById("editar-nombre").value;
  const apellido = document.getElementById("editar-apellido").value;
  const email = document.getElementById("editar-email").value;
  const telefono = document.getElementById("editar-telefono").value;

  try {
    const respuesta = await fetch(`http://127.0.0.1:8000/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, apellido, email, telefono })
    });

    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);

    const clienteActualizado = await respuesta.json();
    alert(`Cliente actualizado: ${clienteActualizado.nombre} ${clienteActualizado.apellido}`);

    cargarTodosLosClientes(); // refrescar lista

    // limpiar formulario
    document.getElementById("form-editar-cliente").reset();

    // 🔹 cerrar modal automáticamente
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarCliente"));
    modal.hide();

  } catch (error) {
    console.error(error);
    alert("Error al editar cliente");
  }
}

// Vincular el formulario con la función de edición
document.getElementById("form-editar-cliente").addEventListener("submit", editarCliente);

// Crear clientes
/*async function crearCliente(event) {
  event.preventDefault(); // evita recargar la página

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;

  try {
    const respuesta = await fetch("http://127.0.0.1:8000/clientes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email,telefono, apellido })
    });

    if (!respuesta.ok) {
  const errorData = await respuesta.json();
  console.error("Detalle del error:", errorData);

    if (errorData.detail && errorData.detail.length > 0) {
      const campo = errorData.detail[0].loc[1]; // ej: "email"
      const mensaje = errorData.detail[0].msg;  // ej: "value is not a valid email address"

      // 🔹 Traducción simple al español
      let mensajeTraducido = mensaje;
      if (mensaje.includes("valid email")) {
        mensajeTraducido = "El correo electrónico no es válido";
      }

      alert(`Error en el campo ${campo}: ${mensajeTraducido}`);
    } else {
      alert("Error en la petición: " + respuesta.status);
    }
    return;
  }
  
    const nuevoCliente = await respuesta.json();
    alert(`Cliente creado: ${nuevoCliente.nombre}`);

    // refrescar la lista de clientes sin propiedades
    //cargarClientesSinPropiedades(); // Por ahora no se usa
    cargarTodosLosClientes();
    limpiarFormularioCliente();
  } catch (error) {
    console.error(error);
    alert("Error al crear cliente");
  }
}

function limpiarFormularioCliente() {
  document.getElementById("nombre").value = "";
  document.getElementById("apellido").value = "";
  document.getElementById("email").value = "";
  document.getElementById("telefono").value = "";
}

// Vincular el formulario con la función de creación de clientes y limpiar el formulario
document.getElementById("form-cliente").addEventListener("submit", crearCliente);

// Limpiar: borra campos pero deja el formulario abierto
document.getElementById("btn-limpiar-cliente").addEventListener("click", limpiarFormularioCliente);

// Cancelar: borra campos y oculta el formulario
document.getElementById("btn-cancelar-cliente").addEventListener("click", () => {
  limpiarFormularioCliente();
  document.getElementById("seccion-crear-cliente").style.display = "none";
  alert("Operación cancelada");
}); */

//Nuevo Crear Cliente en formato flotante
 
async function crearCliente(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const email = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value;

  try {
    const respuesta = await fetch("http://127.0.0.1:8000/clientes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, apellido, email, telefono })
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      if (errorData.detail && errorData.detail.length > 0) {
        const campo = errorData.detail[0].loc[1];
        let mensaje = errorData.detail[0].msg;
        if (mensaje.includes("valid email")) {
          mensaje = "El correo electrónico no es válido";
        }
        alert(`Error en el campo ${campo}: ${mensaje}`);
      } else {
        alert("Error en la petición: " + respuesta.status);
      }
      return;
    }

    const nuevoCliente = await respuesta.json();
    alert(`Cliente creado: ${nuevoCliente.nombre} ${nuevoCliente.apellido}`);

    cargarTodosLosClientes();
    limpiarFormularioCliente();

    // cerrar modal automáticamente
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalCrearCliente"));
    modal.hide();

  } catch (error) {
    console.error(error);
    alert("Error al crear cliente");
  }
}

function limpiarFormularioCliente() {
  document.getElementById("form-cliente").reset();
}

document.getElementById("form-cliente").addEventListener("submit", crearCliente);
document.getElementById("btn-limpiar-cliente").addEventListener("click", limpiarFormularioCliente);

// Vincular el formulario con la función de creación
document.getElementById("form-cliente").addEventListener("submit", crearCliente);

// Limpiar: borra campos
document.getElementById("btn-limpiar-cliente").addEventListener("click", limpiarFormularioCliente);


// Mostrar las propiedades de un cliente
async function cargarPropiedadesDeCliente(clienteId) {
  try {
    const respuesta = await fetch(`http://127.0.0.1:8000/clientes/${clienteId}/propiedades`);
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    const propiedades = await respuesta.json();
    let mensaje = `Propiedades de cliente ${clienteId}:\n`;
    if (propiedades.length === 0) {
      mensaje += "No tiene propiedades asignadas.";
    } else {
      propiedades.forEach(p => {
        mensaje += `- ${p.ubicacion} ($${p.precio})\n`;
      });
    }
    alert(mensaje);  // por ahora se muestra en un alert
  } catch (error) {
    console.error(error);
    alert("Error al cargar propiedades del cliente");
  }
}

// Cargar clientes sin propiedades
/*async function cargarClientesSinPropiedades() {
  try {
    const respuesta = await fetch("http://127.0.0.1:8000/clientes/sin_propiedades");
    if (!respuesta.ok) throw new Error("Error en la petición: " + respuesta.status);
    const clientes = await respuesta.json();
    const lista = document.getElementById("lista-clientes-sin-propiedades");
    lista.innerHTML = "";
    clientes.forEach(c => {
      const item = document.createElement("li");
      item.textContent = `${c.nombre} - ${c.email}`;
      const btn = document.createElement("button");
      btn.textContent = "Asignar propiedad";
      btn.onclick = () => alert(`Asignar propiedad a ${c.nombre}`);
      item.appendChild(btn);
      lista.appendChild(item);
    });
  } catch (error) {
    console.error(error);
    document.getElementById("lista-clientes-sin-propiedades").innerHTML = "<li>Error al cargar clientes</li>";
  }
}*/ // Por el momento lo ocultamos, luego quizas lo volvemos a utilizar

/*document.getElementById("btn-nuevo-cliente").addEventListener("click", () => {
  document.getElementById("seccion-crear-cliente").style.display = "block";
});*/ // El botón Nuevo Cliente ahora abre el modal automáticamente gracias a Bootstrap (). Por lo tanto, ese bloque de JS ya no es necesario.

// INICIALIZACIÓN
// Bloque de inicialización
window.addEventListener("DOMContentLoaded", () => {
// Clientes
//cargarTodosLosClientes(); //por el momento se comenta
cargarTodosLosClientes();
//cargarClientesSinPropiedades();
});
