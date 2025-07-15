const medicamentos = [
  {
    nombre: "Paracetamol",
    principio: "Acetaminofén",
    concentracion: "500 mg",
    forma: "Tableta",
    presentacion: "Caja x 20 tabletas",
    sku: "PARA–500–TAB",
    codigoBarras: "7501031311309",
    laboratorio: "Laboratorios Pisa",
    precio: 45.0,
    disponible: 150
  },
  {
    nombre: "Amoxicilina",
    principio: "Amoxicilina",
    concentracion: "500 mg",
    forma: "Cápsula",
    presentacion: "Caja x 12 cápsulas",
    sku: "AMOX–500–CAP",
    codigoBarras: "7501031311310",
    laboratorio: "Laboratorios Sandoz",
    precio: 45.0,
    disponible: 23
  },
  {
    nombre: "Ibuprofeno",
    principio: "Ibuprofeno",
    concentracion: "400 mg",
    forma: "Tableta",
    presentacion: "Caja x 10 tabletas",
    sku: "IBU–400–TAB",
    codigoBarras: "7501031311311",
    laboratorio: "Laboratorios Liomont",
    precio: 45.0,
    disponible: 124
  },
  {
    nombre: "Metformina",
    principio: "Metformina",
    concentracion: "850 mg",
    forma: "Tableta",
    presentacion: "Caja x 30 tabletas",
    sku: "METF–850–TAB",
    codigoBarras: "7501031311312",
    laboratorio: "Laboratorios Silanes",
    precio: 45.0,
    disponible: 152
  },
  {
    nombre: "Losartán",
    principio: "Losartán Potásico",
    concentracion: "50 mg",
    forma: "Tableta",
    presentacion: "Caja x 30 tabletas",
    sku: "LOS–50–TAB",
    codigoBarras: "7501031311313",
    laboratorio: "Laboratorios Chinoin",
    precio: 45.0,
    disponible: 15
  },
];

const tbody = document.getElementById("medicamentos-body");
const btnSolicitar = document.getElementById("btnSolicitar");

function renderTabla() {
  tbody.innerHTML = "";

  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  });

  medicamentos.forEach((med, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="med-check" data-index="${index}"></td>
      <td>${med.nombre}</td>
      <td>${med.principio}</td>
      <td>${med.concentracion}</td>
      <td>${med.forma}</td>
      <td>${med.presentacion}</td>
      <td>${med.sku}</td>
      <td>${med.codigoBarras}</td>
      <td>${med.laboratorio}</td>
      <td>${formatter.format(med.precio)}</td>
    `;
    tbody.appendChild(row);
  });
}

function actualizarContador() {
  const seleccionados = document.querySelectorAll(".med-check:checked").length;
  btnSolicitar.textContent = `Solicitar Pedido (${seleccionados})`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderTabla();
  document.addEventListener("change", (e) => {
    if (e.target.classList.contains("med-check")) {
      actualizarContador();
    }
  });
});

document.getElementById("selectAll").addEventListener("change", function () {
  document.querySelectorAll(".med-check").forEach(cb => cb.checked = this.checked);
  actualizarContador();
});

document.getElementById("searchInput").addEventListener("input", function () {
  const filtro = this.value.trim().toLowerCase();

  const filtrados = medicamentos.filter((med) => {
    return Object.values(med).some((valor) =>
      String(valor).toLowerCase().includes(filtro)
    );
  });

  renderTablaMedicamentos(filtrados);
});


document.getElementById("btnSolicitar").addEventListener("click", () => {
  const seleccionados = document.querySelectorAll(".med-check:checked");
  if (seleccionados.length === 0) return;

  const container = document.getElementById("pedidoResumen");
  const totalResumen = document.getElementById("totalResumen");
  const totalPrecio = document.getElementById("totalPrecio");

  container.innerHTML = "";
  let total = 0;
  let totalUnidades = 0;

  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const pedido = [];

  seleccionados.forEach((cb) => {
    const index = cb.dataset.index;
    const med = medicamentos[index];

    const cantidad = 1; // Valor inicial
    const subtotal = med.precio * cantidad;

    pedido.push({ ...med, index, cantidad });

    const card = document.createElement("div");
    card.className = "p-3 border rounded pedido-item";
    card.dataset.index = index;

    card.innerHTML = `
      <h6 class="fw-bold mb-0">${med.nombre}</h6>
      <div class="text-muted small">${med.principio}<br>${med.concentracion} - ${med.forma}</div>
      <div class="d-flex align-items-center gap-2 my-2">
        <span class="badge bg-light text-dark">${med.laboratorio}</span>
        <span class="badge bg-success">Disponible</span>
      </div>
      <div class="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
        <div>
          <label class="small text-muted">Cantidad:</label>
          <input type="number" 
                min="1" 
                max="${med.disponible}" 
                value="1" 
                class="form-control d-inline-block w-auto cantidad-input" 
                data-index="${index}" />
          <small class="text-muted ms-2">Disponible: ${med.disponible}</small>
          <div class="invalid-feedback d-block text-danger small mt-1" style="display:none;">
            No puedes pedir más de ${med.disponible} piezas.
          </div>
        </div>
        <div class="text-end">
          <small class="text-muted precio-unitario">${formatter.format(med.precio)} c/u</small><br />
          <strong class="text-success subtotal">${formatter.format(med.precio)}</strong>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  function recalcularTotales() {
    total = 0;
    totalUnidades = 0;

    document.querySelectorAll(".pedido-item").forEach((item) => {
      const index = item.dataset.index;
      const input = item.querySelector(".cantidad-input");
      const subtotalEl = item.querySelector(".subtotal");

      const cantidad = parseInt(input.value, 10) || 0;
      const precio = medicamentos[index].precio;
      const subtotal = cantidad * precio;

      total += subtotal;
      totalUnidades += cantidad;

      subtotalEl.textContent = formatter.format(subtotal);
    });

    totalResumen.textContent = `${seleccionados.length} medicamento(s) - ${totalUnidades} unidades`;
    totalPrecio.textContent = formatter.format(total);
  }

  // Evento en todos los inputs de cantidad
  setTimeout(() => {
    document.querySelectorAll(".cantidad-input").forEach((input) => {
      input.addEventListener("input", () => {
        const index = input.dataset.index;
        const max = medicamentos[index].disponible;
        const value = parseInt(input.value, 10);
        const errorMsg = input.parentElement.querySelector(".invalid-feedback");

        if (value > max) {
          errorMsg.style.display = "block";
          input.value = max;
          setTimeout(() => errorMsg.style.display = "none", 2500);
        }

        recalcularTotales();
      });
    });
  }, 100);

  recalcularTotales();

  const modal = new bootstrap.Modal(document.getElementById("modalPedido"));
  modal.show();
});

document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "btnContinuar") {
    const resumen = document.getElementById("resumenSolicitante");
    const totalResumen = document.getElementById("totalResumen").textContent;
    const totalPrecio = document.getElementById("totalPrecio").textContent;

    resumen.innerHTML = "";

    document.querySelectorAll(".pedido-item").forEach((item) => {
      const index = item.dataset.index;
      const med = medicamentos[index];
      const cantidad = parseInt(item.querySelector(".cantidad-input").value);
      const subtotal = med.precio * cantidad;

      const div = document.createElement("div");
      div.classList.add("mb-2", "pb-2", "border-bottom");
      div.innerHTML = `
        <div class="d-flex justify-content-between">
          <div>
            <strong>${med.nombre}</strong><br>
            <small class="text-muted">${med.principio} – ${med.concentracion}<br>${med.laboratorio}</small>
          </div>
          <div class="text-end">
            <small>Cantidad: ${cantidad}</small><br>
            <small>Precio: ${new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN'
            }).format(med.precio)}</small><br>
            <strong class="text-success">${new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN'
            }).format(subtotal)}</strong>
          </div>
        </div>
      `;
      resumen.appendChild(div);
    });

    document.getElementById("resumenTotalItems").textContent = totalResumen;
    document.getElementById("resumenTotalPrecio").textContent = totalPrecio;

    bootstrap.Modal.getInstance(document.getElementById("modalPedido")).hide();
    new bootstrap.Modal(document.getElementById("modalSolicitante")).show();
  }
});

  function validarCorreo(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validarTelefono(tel) {
    const regex = /^\d{10}$/;
    return regex.test(tel);
  }

  document.addEventListener("input", () => {
    const formFields = document.querySelectorAll('#modalSolicitante [data-required="true"]');
    let allValid = true;

    formFields.forEach((input) => {
      const value = input.value.trim();
      const tipo = input.getAttribute("data-type");
      const errorEl = input.nextElementSibling;

      if (!value) {
        allValid = false;
        if (errorEl) errorEl.hidden = true;
        return;
      }

      if (tipo === "email") {
        const valido = validarCorreo(value);
        allValid = allValid && valido;
        if (errorEl) errorEl.hidden = valido;
      } else if (tipo === "tel") {
        const valido = validarTelefono(value);
        allValid = allValid && valido;
        if (errorEl) errorEl.hidden = valido;
      }
    });

    document.getElementById("btnEnviarSolicitud").disabled = !allValid;
  });

  document.getElementById("btnEnviarSolicitud").addEventListener("click", function () {
    const button = this;
    const spinner = button.querySelector(".spinner-border");
    const text = button.querySelector(".btn-text");

    spinner.classList.remove("d-none");
    text.textContent = "Enviando...";
    button.disabled = true;

    setTimeout(() => {
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalSolicitante"));
      if (modal) modal.hide();
      spinner.classList.add("d-none");
      text.textContent = "Enviar Solicitud";
    }, 2000);
  });

const btnAgregarNoDisponible = document.getElementById("btnAgregarNoDisponible");
const inputNoDisponible = document.getElementById("inputNoDisponible");
const listaNoDisponibles = document.getElementById("listaNoDisponibles");
const btnContinuarNoDisponible = document.getElementById("btnContinuarNoDisponible");
const listaMedicamentosNoDisponibles = [];

btnAgregarNoDisponible.addEventListener("click", () => {
  const valor = inputNoDisponible.value.trim();
  if (!valor) return;

  listaMedicamentosNoDisponibles.push(valor);
  inputNoDisponible.value = "";

  renderMedicamentosSolicitados(listaMedicamentosNoDisponibles);
  btnContinuarNoDisponible.disabled = false;
});

function renderMedicamentosSolicitados(lista) {
  if (lista.length === 0) {
    listaNoDisponibles.innerHTML = `
      <div class="border rounded text-center p-4" style="border-style: dashed; color: #9ca3af;">
        <p class="mb-1 fw-bold" style="color: #6b7280;">No has agregado medicamentos aún</p>
        <small>Utiliza el campo de arriba para agregar los medicamentos que necesitas</small>
      </div>`;
    btnContinuarNoDisponible.disabled = true;
    return;
  }

  const container = document.createElement("div");
  container.className = "bg-light border rounded p-3";

  const titulo = document.createElement("h6");
  titulo.className = "fw-bold mb-3";
  titulo.textContent = `Medicamentos Solicitados (${lista.length})`;
  container.appendChild(titulo);

  lista.forEach((medicamento, index) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded border p-3 mb-3 position-relative";

    const nombre = document.createElement("h6");
    nombre.className = "fw-bold";
    nombre.textContent = medicamento;

    const labelObs = document.createElement("label");
    labelObs.className = "form-label text-muted small mt-2";
    labelObs.textContent = "Observaciones adicionales (opcional)";

    const textarea = document.createElement("textarea");
    textarea.className = "form-control";
    textarea.rows = 2;
    textarea.placeholder = "Especificaciones adicionales, dosis, presentación requerida, etc.";

    const btnDelete = document.createElement("button");
    btnDelete.className = "btn-close position-absolute top-0 end-0 m-3";
    btnDelete.setAttribute("aria-label", "Eliminar");

    btnDelete.addEventListener("click", () => {
      lista.splice(index, 1);
      renderMedicamentosSolicitados(lista);
    });

    card.appendChild(nombre);
    card.appendChild(labelObs);
    card.appendChild(textarea);
    card.appendChild(btnDelete);

    container.appendChild(card);
  });

  listaNoDisponibles.innerHTML = "";
  listaNoDisponibles.appendChild(container);
  btnContinuarNoDisponible.disabled = false;
}


// Render inicial del estado vacío
renderMedicamentosSolicitados(listaMedicamentosNoDisponibles);

const input = document.getElementById("inputNoDisponible");
const btnAgregar = document.getElementById("btnAgregarNoDisponible");
const lista = document.getElementById("listaNoDisponibles");
const mensajeVacio = document.getElementById("mensajeVacio");
const medicamentosList = [];

btnAgregar.addEventListener("click", () => {
  const nombre = input.value.trim();
  if (!nombre) return;

  medicamentosList.push({ nombre, observaciones: "" });
  input.value = "";

  localStorage.setItem("medicamentosNoDisponibles", JSON.stringify(medicamentosList));
  renderMedicamentos();
});

function renderMedicamentos() {
  lista.innerHTML = "";
  if (medicamentosList.length === 0) {
    lista.appendChild(mensajeVacio);
    return;
  }
  medicamentosList.forEach((med, index) => {
    const div = document.createElement("div");
    div.className = "bg-white rounded shadow-sm p-3 mb-2";
    div.innerHTML = `
      <div class="fw-bold mb-1">${med.nombre}</div>
      <label class="text-muted small">Observaciones adicionales (opcional)</label>
      <textarea class="form-control form-control-sm mb-2" placeholder="Especificaciones adicionales, dosis, presentación requerida, etc." data-index="${index}" oninput="actualizarObservaciones(this)"></textarea>
      <button class="btn btn-sm btn-outline-danger" onclick="eliminarMedicamento(${index})">Eliminar</button>
    `;
    lista.appendChild(div);
  });
}

function actualizarObservaciones(textarea) {
  const index = textarea.getAttribute("data-index");
  medicamentosList[index].observaciones = textarea.value;
  localStorage.setItem("medicamentosNoDisponibles", JSON.stringify(medicamentosList));
}

function eliminarMedicamento(index) {
  medicamentosList.splice(index, 1);
  localStorage.setItem("medicamentosNoDisponibles", JSON.stringify(medicamentosList));
  renderMedicamentos();
}

// Al abrir el segundo modal
document.getElementById("modalSolicitanteNoDisponibles").addEventListener("show.bs.modal", () => {
  const resumen = document.getElementById("resumenNoDisponibles");
  const total = document.getElementById("totalNoDisponibles");
  const meds = JSON.parse(localStorage.getItem("medicamentosNoDisponibles")) || [];

  if (meds.length === 0) {
    resumen.innerHTML = "<div class='text-muted text-center'>No se agregaron medicamentos.</div>";
  } else {
    resumen.innerHTML = meds.map(med => `
      <div class="bg-white rounded shadow-sm p-3 mb-2">
        <div class="fw-bold mb-1">${med.nombre}</div>
        ${med.observaciones ? "<div><strong class='text-muted'>Observaciones:</strong> " + med.observaciones + "</div>" : ""}
      </div>
    `).join("");
  }

  total.textContent = `${meds.length} medicamento(s) personalizado(s)`;
});

// Validaciones para el formulario
const camposNP = {
  nombre: document.getElementById("nombreSolicitanteNP"),
  correo: document.getElementById("correoSolicitanteNP"),
  telefono: document.getElementById("telefonoSolicitanteNP"),
  direccion: document.getElementById("direccionSolicitanteNP"),
  botonEnviar: document.getElementById("btnEnviarNoDisponibles"),
};

const validacionesNP = {
  correo: (v) => /^[^s@]+@[^s@]+.[^s@]+$/.test(v),
  telefono: (v) => /^d{10}$/.test(v.replace(/[^d]/g, "")),
};

function validarFormularioNP() {
  const nombre = camposNP.nombre.value.trim();
  const correo = camposNP.correo.value.trim();
  const telefono = camposNP.telefono.value.trim();
  const direccion = camposNP.direccion.value.trim();

  const correoOK = correo === "" || validacionesNP.correo(correo);
  const telefonoOK = telefono === "" || validacionesNP.telefono(telefono);

  document.getElementById("errorCorreoNP").hidden = correoOK || correo === "";
  document.getElementById("errorTelefonoNP").hidden = telefonoOK || telefono === "";

  const formularioValido = nombre && correo && direccion && validacionesNP.correo(correo) && validacionesNP.telefono(telefono);
  camposNP.botonEnviar.disabled = !formularioValido;
}

for (const campo of Object.values(camposNP)) {
  if (campo.tagName === "BUTTON") continue;
  campo.addEventListener("input", validarFormularioNP);
}

camposNP.botonEnviar.addEventListener("click", function () {
  const spinner = this.querySelector(".spinner-border");
  const text = this.querySelector(".btn-text");

  spinner.classList.remove("d-none");
  text.textContent = "Enviando...";
  this.disabled = true;

  setTimeout(() => {
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalSolicitanteNoDisponibles"));
    modal.hide();
    spinner.classList.add("d-none");
    text.textContent = "Enviar Solicitud";
    this.disabled = false;
  }, 2000);
});


