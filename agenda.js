async function cargarAgendaVisitas() {
  try {
    const resp = await fetch("http://127.0.0.1:8000/visitas/");
    if (!resp.ok) throw new Error("Error en la petición: " + resp.status);

    const visitas = await resp.json();

    // Ordenar por fecha/hora ascendente
    visitas.sort((a, b) => new Date(a.fecha + " " + a.hora) - new Date(b.fecha + " " + b.hora));

    const lista = document.getElementById("agenda-visitas");
    lista.innerHTML = "";

    visitas.slice(0, 5).forEach(v => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = `${v.fecha} - ${v.lugar} - ${v.hora}`;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error("Error cargando agenda de visitas:", error);
  }
}