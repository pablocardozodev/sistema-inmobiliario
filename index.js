// Consumo de informacion para mostrar en el dashboard

// clientesDashboard.js
async function cargarClientesDashboard() {
  const resp = await fetch("http://127.0.0.1:8000/clientes/");
  const clientes = await resp.json();

  document.getElementById("total-clientes").textContent = clientes.length;

  /*const ultimos = clientes.slice(-5);
  const lista = document.getElementById("ultimos-clientes");
  lista.innerHTML = "";
  ultimos.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.nombre} ${c.apellido}`;
    lista.appendChild(li);
  });*/ // Luego se elimina

  const lista = document.getElementById("ultimos-clientes");
    lista.innerHTML = "";
    clientes.slice(-5).reverse().forEach(c => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${c.nombre} ${c.apellido}`;
    lista.appendChild(li);
    });
}

// propiedadesDashboard.js
async function cargarPropiedadesDashboard() {
  const resp = await fetch("http://127.0.0.1:8000/propiedades/");
  const propiedades = await resp.json();

  document.getElementById("total-propiedades").textContent = propiedades.length;

  /*const ultimas = propiedades.slice(-5);
  const lista = document.getElementById("ultimas-propiedades");
  lista.innerHTML = "";
  ultimas.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.ubicacion} - $${p.precio} (${p.estado})`;
    lista.appendChild(li);
  });*/

  const lista = document.getElementById("ultimas-propiedades");
    lista.innerHTML = "";
    propiedades.slice(-5).reverse().forEach(p => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = `${p.ubicacion} - $${p.precio} (${p.estado})`;
    lista.appendChild(li);
    });
}

// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  cargarClientesDashboard();
  cargarPropiedadesDashboard();
});
