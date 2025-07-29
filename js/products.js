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
    disponible: 150,
    gob: 939303
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
    disponible: 23,
    gob: 638892
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
    disponible: 124,
    gob: 19374
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
    disponible: 152,
    gob: 387837
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
    disponible: 15,
    gob: 84638
  },
];

const seleccionadosSku = new Set();
let dataTable; 

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
      <td>
        <input type="checkbox" class="med-check" data-sku="${med.sku}" ${seleccionadosSku.has(med.sku) ? "checked" : ""}>
      </td>
      <td>${med.nombre}</td>
      <td>${med.principio}</td>
      <td>${med.concentracion}</td>
      <td>${med.forma}</td>
      <td>${med.presentacion}</td>
      <td>${med.sku}</td>
      <td>${med.codigoBarras}</td>
      <td>${med.laboratorio}</td>
    `;
    tbody.appendChild(row);
  });
}

function sincronizarCheckboxes() {
  document.querySelectorAll(".med-check").forEach(checkbox => {
    const sku = checkbox.dataset.sku;
    checkbox.checked = seleccionadosSku.has(sku);
  });
}

document.addEventListener("change", (e) => {
  if (e.target.classList.contains("med-check")) {
    const sku = e.target.dataset.sku;
    if (e.target.checked) {
      seleccionadosSku.add(sku);
    } else {
      seleccionadosSku.delete(sku);
    }
    actualizarContador();
    actualizarSelectAll();
  }
});

function actualizarContador() {
  btnSolicitar.textContent = `Solicitar Pedido (${seleccionadosSku.size})`;
}

function actualizarSelectAll() {
  const selectAllCheckbox = document.getElementById("selectAll");
  const checkboxesVisibles = document.querySelectorAll(".med-check");
  const checkboxesVisiblesSeleccionados = Array.from(checkboxesVisibles).filter(cb => seleccionadosSku.has(cb.dataset.sku));
  
  if (checkboxesVisibles.length === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (checkboxesVisiblesSeleccionados.length === checkboxesVisibles.length) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else if (checkboxesVisiblesSeleccionados.length > 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderTabla();
  
  setTimeout(() => {
    dataTable = $('#tablaMedicamentos').DataTable({
      paging: true,
      searching: true, 
      info: false,
      lengthChange: false,
      pageLength: 5,
      language: {
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior"
        },
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        infoEmpty: "Mostrando 0 a 0 de 0 registros",
        infoFiltered: "(filtrado de _MAX_ registros totales)",
        lengthMenu: "Mostrar _MENU_ registros por página",
        loadingRecords: "Cargando...",
        processing: "Procesando...",
        search: "Buscar:",
        zeroRecords: "No se encontraron registros coincidentes",
        emptyTable: "No hay datos disponibles en la tabla"
      },
      dom: 'rt<"bottom"p>', 
      drawCallback: function(settings) {
        sincronizarCheckboxes();
        actualizarSelectAll();
      }
    });
    
    dataTable.on('page.dt', function() {
      setTimeout(sincronizarCheckboxes, 10);
    });
    
  }, 200);
});

document.getElementById("selectAll").addEventListener("change", function () {
  const isChecked = this.checked;
  
  if (isChecked) {
    medicamentos.forEach(med => {
      seleccionadosSku.add(med.sku);
    });
  } else {
    seleccionadosSku.clear();
  }
  
  sincronizarCheckboxes();
  actualizarContador();
});

document.getElementById("searchInput").addEventListener("input", function () {
  const filtro = this.value.trim();

  if (dataTable) {
    dataTable.search(filtro).draw();
  } else {
    const filtrados = medicamentos.filter((med) => {
      return (
        med.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        med.principio.toLowerCase().includes(filtro.toLowerCase()) ||
        med.laboratorio.toLowerCase().includes(filtro.toLowerCase())
      );
    });
    renderTablaFiltrada(filtrados);
  }
});

function renderTablaFiltrada(lista) {
  tbody.innerHTML = "";

  lista.forEach((med, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <input type="checkbox" class="med-check" data-sku="${med.sku}" ${seleccionadosSku.has(med.sku) ? "checked" : ""}>
      </td>
      <td>${med.nombre}</td>
      <td>${med.principio}</td>
      <td>${med.concentracion}</td>
      <td>${med.forma}</td>
      <td>${med.presentacion}</td>
      <td>${med.sku}</td>
      <td>${med.codigoBarras}</td>
      <td>${med.laboratorio}</td>
    `;
    tbody.appendChild(row);
  });

  actualizarContador();
  actualizarSelectAll();
}

document.getElementById("btnSolicitar").addEventListener("click", () => {
  if (seleccionadosSku.size === 0) return;

  const container = document.getElementById("pedidoResumen");
  const totalResumen = document.getElementById("totalResumen");

  container.innerHTML = "";
  let total = 0;
  let totalUnidades = 0;

  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  Array.from(seleccionadosSku).forEach((sku) => {
    const med = medicamentos.find((m) => m.sku === sku);
    if (!med) return;

    const card = document.createElement("div");
    card.className = "p-3 border rounded pedido-item position-relative";
    card.dataset.sku = med.sku;

    card.innerHTML = `
      <button class="btn-close position-absolute top-0 end-0 me-2 mt-2" aria-label="Eliminar" data-sku="${med.sku}"></button>      
      <h6 class="fw-bold mb-0">${med.nombre}</h6>
      <div class="text-muted small">Clave GOB: ${med.gob}<br>Sustancia: ${med.principio}<br>Presentación: ${med.concentracion} - ${med.forma}<br>Laboratorio: ${med.laboratorio}</div>
      <div class="d-flex align-items-center gap-2 my-2">
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
                data-sku="${med.sku}" />
          <small class="text-muted ms-2">Disponible: ${med.disponible}</small>
          <div class="invalid-feedback d-block text-danger small mt-1" style="display:none;">
            No puedes pedir más de ${med.disponible} piezas.
          </div>
        </div>
        <div class="text-end">
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  setTimeout(() => {
    document.querySelectorAll(".pedido-item .btn-close").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sku = btn.dataset.sku;

        seleccionadosSku.delete(sku);

        sincronizarCheckboxes();

        btn.closest(".pedido-item").remove();

        recalcularTotales();
        actualizarContador();
        actualizarSelectAll();

        const remainingItems = document.querySelectorAll(".pedido-item").length;
        if (remainingItems === 0) {
          const modal = bootstrap.Modal.getInstance(document.getElementById("modalPedido"));
          if (modal) modal.hide();
        }
      });
    });
  }, 100);

  function recalcularTotales() {
    total = 0;
    totalUnidades = 0;

    document.querySelectorAll(".pedido-item").forEach((item) => {
      const sku = item.dataset.sku;
      const med = medicamentos.find((m) => m.sku === sku);
      const input = item.querySelector(".cantidad-input");

      const cantidad = parseInt(input.value, 10) || 0;
      const precio = med.precio;
      totalUnidades += cantidad;
    });

    const totalMedicamentos = document.querySelectorAll(".pedido-item").length;
    totalResumen.textContent = `${totalMedicamentos} medicamento(s) - ${totalUnidades} unidades`;
  }

  setTimeout(() => {
    document.querySelectorAll(".cantidad-input").forEach((input) => {
      input.addEventListener("input", () => {
        const sku = input.dataset.sku;
        const med = medicamentos.find(m => m.sku === sku);
        const max = med.disponible;
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

    resumen.innerHTML = "";

    document.querySelectorAll(".pedido-item").forEach((item) => {
      const sku = item.dataset.sku;
      const med = medicamentos.find((m) => m.sku === sku);
      const cantidad = parseInt(item.querySelector(".cantidad-input").value);

      const div = document.createElement("div");
      div.classList.add("mb-2", "pb-2", "border-bottom");
      div.innerHTML = `
        <div class="d-flex justify-content-between">
          <div>
            <strong>${med.nombre}</strong><br>
            <small class="text-muted">Clave GOB: ${med.gob}<br>Sustancia: ${med.principio}<br>Presentación: ${med.concentracion} - ${med.forma}<br>Laboratorio: ${med.laboratorio}</small>
          </div>
          <div class="text-end">
            <small>Cantidad: ${cantidad}</small><br>
          </div>
        </div>
      `;
      resumen.appendChild(div);
    });

    document.getElementById("resumenTotalItems").textContent = totalResumen;

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
    const campos = document.querySelectorAll('#modalSolicitante [data-required="true"]');
    const btn = document.getElementById("btnEnviarSolicitud");

    let todosValidos = true;

    campos.forEach((campo) => {
      const valor = campo.value.trim();
      const tipo = campo.getAttribute("data-type");
      const errorMsg = campo.nextElementSibling;

      let esValido = true;

      if (!valor) {
        esValido = false;
        todosValidos = false;
      } else if (tipo === "email") {
        esValido = validarCorreo(valor);
        if (!esValido) todosValidos = false;
      } else if (tipo === "tel") {
        esValido = validarTelefono(valor);
        if (!esValido) todosValidos = false;
      }

      if (errorMsg && errorMsg.classList.contains("invalid-feedback")) {
        errorMsg.style.display = (!valor || esValido) ? "none" : "block";
      }

      campo.classList.toggle("is-invalid", !esValido && valor);
    });

    btn.disabled = !todosValidos;
  });

  /////////

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

      document.getElementById("confirmCantidadNuevo").textContent = `${seleccionadosSku.size} medicamento(s)`;

      const modalFinal = new bootstrap.Modal(document.getElementById("modalSolicitudEnviadaNuevoPedido"));
      modalFinal.show();

      spinner.classList.add("d-none");
      text.textContent = "Enviar Solicitud";
      button.disabled = false;
    }, 2000);
  });
    
  
///////////

const btnAgregarNoDisponible = document.getElementById("btnAgregarNoDisponible");
const inputNoDisponible = document.getElementById("inputNoDisponible");
const listaNoDisponibles = document.getElementById("listaNoDisponibles");
const btnContinuarNoDisponible = document.getElementById("btnContinuarNoDisponible");
const medicamentosNoDisponibles = [];
const limpiezaHabilitada = false

document.getElementById("modalNoDisponible").addEventListener('show.bs.modal', function (event) {
  console.log('El modal de medicamentos no disponibles se está abriendo');
   medicamentosNoDisponibles.length = 0;
  renderMedicamentosNoDisponibles();
});



const inputNombreMedicamento = document.getElementById("inputNombreMedicamento");
const inputPresentacion = document.getElementById("inputPresentacion");
const inputCantidad = document.getElementById("inputCantidad");
const inputClaveGob = document.getElementById("inputClaveGob");

function validarCamposFormulario() {
  const nombre = inputNombreMedicamento.value.trim();
  const presentacion = inputPresentacion.value.trim();
  const cantidad = inputCantidad.value.trim();
  
  const todosCamposValidos = nombre && presentacion && cantidad && parseInt(cantidad) > 0;
  
  document.getElementById("btnAgregarNoDisponible").disabled = !todosCamposValidos;
}

inputNombreMedicamento.addEventListener("input", validarCamposFormulario);
inputPresentacion.addEventListener("input", validarCamposFormulario);
inputCantidad.addEventListener("input", validarCamposFormulario);

document.getElementById("btnAgregarNoDisponible").addEventListener("click", () => {
  const nombre = inputNombreMedicamento.value.trim();
  const presentacion = inputPresentacion.value.trim();
  const cantidad = parseInt(inputCantidad.value.trim());
  const claveGob = inputClaveGob.value.trim();
  
  if (!nombre || !presentacion || !cantidad || cantidad <= 0) return;
  
  const nuevoMedicamento = {
    nombre: nombre,
    presentacion: presentacion,
    cantidad: cantidad,
    claveGob: claveGob || "No especificada",
    observaciones: ""
  };
  
  medicamentosNoDisponibles.push(nuevoMedicamento);
  
  inputNombreMedicamento.value = "";
  inputPresentacion.value = "";
  inputCantidad.value = "";
  inputClaveGob.value = "";
  
  document.getElementById("btnAgregarNoDisponible").disabled = true;
  
  renderMedicamentosNoDisponibles();
});

function renderMedicamentosNoDisponibles() {
  const lista = document.getElementById("listaNoDisponibles");
  const btnContinuar = document.getElementById("btnContinuarDatosSolicitante");

  if (medicamentosNoDisponibles.length === 0) {
    lista.innerHTML = `
      <div id="mensajeVacio" class="text-center text-muted border border-dashed p-4 rounded">
        No has agregado medicamentos aún
      </div>`;
    btnContinuar.disabled = true;
    return;
  }

  const container = document.createElement("div");
  container.className = "bg-light border rounded p-3";

  const titulo = document.createElement("h6");
  titulo.className = "fw-bold mb-3";
  titulo.textContent = `Medicamentos Solicitados (${medicamentosNoDisponibles.length})`;
  container.appendChild(titulo);

  medicamentosNoDisponibles.forEach((medicamento, index) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded border p-3 mb-3 position-relative";

    card.innerHTML = `
      <button class="btn-close position-absolute top-0 end-0 m-3" aria-label="Eliminar" onclick="eliminarMedicamento(${index})"></button>
      <h6 class="fw-bold mb-2">${medicamento.nombre}</h6>
      <div class="row mb-2">
        <div class="col-md-6">
          <small class="text-muted"><strong>Presentación:</strong> ${medicamento.presentacion}</small>
        </div>
        <div class="col-md-6">
          <small class="text-muted"><strong>Cantidad:</strong> ${medicamento.cantidad}</small>
        </div>
      </div>
      <div class="mb-2">
        <small class="text-muted"><strong>Clave GOB:</strong> ${medicamento.claveGob}</small>
      </div>
      <label class="form-label text-muted small mt-2">Observaciones adicionales (opcional)</label>
      <textarea class="form-control" rows="2" placeholder="Especificaciones adicionales, dosis, presentación requerida, etc." 
                data-index="${index}" onchange="actualizarObservaciones(${index}, this.value)">${medicamento.observaciones}</textarea>
    `;

    container.appendChild(card);
  });

  lista.innerHTML = "";
  lista.appendChild(container);
  btnContinuar.disabled = false;
}

function actualizarObservaciones(index, valor) {
  if (medicamentosNoDisponibles[index]) {
    medicamentosNoDisponibles[index].observaciones = valor;
  }
}

function eliminarMedicamento(index) {
  medicamentosNoDisponibles.splice(index, 1);
  renderMedicamentosNoDisponibles();
}

function renderizarMedicamentosSolicitados() {
  const contenedor = document.getElementById("listaMedicamentosSolicitados");
  
  if (!contenedor) {
    console.error("No se encontró #listaMedicamentosSolicitados");
    return;
  }
  
  contenedor.innerHTML = "";

  if (medicamentosNoDisponibles.length === 0) {
    contenedor.innerHTML = '<div class="text-muted">No se han agregado medicamentos.</div>';
    return;
  }

  medicamentosNoDisponibles.forEach((med) => {
    const div = document.createElement("div");
    div.className = "p-2 border rounded mb-2 bg-white";
    div.innerHTML = `
      <strong>${med.nombre}</strong><br>
      <small class="text-muted">
        <strong>Presentación:</strong> ${med.presentacion}<br>
        <strong>Cantidad:</strong> ${med.cantidad}<br>
        <strong>Clave GOB:</strong> ${med.claveGob}<br>
        <strong>Observaciones:</strong> ${med.observaciones || 'Ninguna'}
      </small>
    `;
    contenedor.appendChild(div);
  });
}


document.getElementById("btnContinuarDatosSolicitante").removeEventListener("click", () => {}); // Remover el anterior

document.getElementById("btnContinuarDatosSolicitante").addEventListener("click", () => {
  if (medicamentosNoDisponibles.length === 0) {
    alert("Agrega al menos un medicamento antes de continuar.");
    return;
  }

  cambiarModal('modalNoDisponible', 'modalDatosSolicitante', () => {
    renderizarMedicamentosSolicitados();
  });
});

document.getElementById("modalNoDisponible").addEventListener('hidden.bs.modal', function() {
  limpiezaCompleta();
  
  if (limpiezaHabilitada) {
    limpiarMedicamentos();
  }
});
document.getElementById("modalDatosSolicitante").addEventListener('hidden.bs.modal', function() {
  limpiezaCompleta();
  
  if (limpiezaHabilitada) {
    limpiarMedicamentos();
  }
});

document.addEventListener("input", () => {
  const campos = document.querySelectorAll('#modalDatosSolicitante [data-required="true"]');
  const btn = document.getElementById("btnEnviarSolicitudNoDisponibles");

  let todosValidos = true;

  campos.forEach((campo) => {
    const valor = campo.value.trim();
    const tipo = campo.getAttribute("data-type");
    const errorMsg = campo.nextElementSibling;

    let esValido = true;

    if (!valor) {
      esValido = false;
      todosValidos = false;
    } else if (tipo === "email") {
      esValido = validarCorreo(valor);
      if (!esValido) todosValidos = false;
    } else if (tipo === "tel") {
      esValido = validarTelefono(valor);
      if (!esValido) todosValidos = false;
    }

    if (errorMsg && errorMsg.classList.contains("invalid-feedback")) {
      errorMsg.style.display = (!valor || esValido) ? "none" : "block";
    }

    campo.classList.toggle("is-invalid", !esValido && valor);
  });

  btn.disabled = !todosValidos;
});
  

document.getElementById("btnEnviarSolicitudNoDisponibles").addEventListener("click", function () {
  const button = this;
  const spinner = button.querySelector(".spinner-border");
  const text = button.querySelector(".btn-text");

  spinner.classList.remove("d-none");
  text.textContent = "Enviando...";
  button.disabled = true;

  setTimeout(() => {
    const modalDatos = bootstrap.Modal.getInstance(document.getElementById("modalDatosSolicitante"));
    if (modalDatos) {
      modalDatos.hide();
      
      document.getElementById("modalDatosSolicitante").addEventListener('hidden.bs.modal', function handler() {
        limpiezaCompleta();
        
        const confirmCantidad = document.getElementById("confirmCantidad");
        confirmCantidad.textContent = `${medicamentosNoDisponibles.length} solicitud(es)`;

        setTimeout(() => {
          const modalFinal = new bootstrap.Modal(document.getElementById("modalSolicitudEnviada"));
          modalFinal.show();
        }, 100);
        
        this.removeEventListener('hidden.bs.modal', handler);
      }, { once: true });
    }

    spinner.classList.add("d-none");
    text.textContent = "Enviar Solicitud";
    button.disabled = false;
  }, 2000);
});


document.getElementById("modalSolicitudEnviada").addEventListener('hidden.bs.modal', function() {
  limpiezaCompleta();
  limpiarMedicamentos();
});

window.limpiarModalEmergencia = function() {
  document.querySelectorAll('.modal.show').forEach(modal => {
    const instance = bootstrap.Modal.getInstance(modal);
    if (instance) instance.hide();
  });
  
  setTimeout(() => {
    limpiezaCompleta();
    console.log('Modales limpiados completamente');
  }, 500);
};


document.addEventListener('DOMContentLoaded', function() {
  limpiezaCompleta();
});

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-backdrop')) {
    limpiezaCompleta();
  }
});

function limpiarBackdrops() {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.remove();
  });
  
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

function cambiarModal(modalActual, modalNuevo, callback = null) {
  const instanciaActual = bootstrap.Modal.getInstance(document.getElementById(modalActual));
  
  if (instanciaActual) {
    instanciaActual.hide();
    
    document.getElementById(modalActual).addEventListener('hidden.bs.modal', function handler() {
      limpiezaCompleta();
      
      if (callback) callback();
      
      setTimeout(() => {
        const nuevoModal = new bootstrap.Modal(document.getElementById(modalNuevo));
        nuevoModal.show();
      }, 100);
      
      this.removeEventListener('hidden.bs.modal', handler);
    }, { once: true });
  }
}

function limpiezaCompleta() {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.remove();
  });
  
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  document.body.style.marginRight = '';
}