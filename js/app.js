// ===== Generador de Lorem Ipsum =====

const PALABRAS_LOREM = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing",
  "elit", "sed", "tempor", "incididunt", "labore", "dolore", "magna",
  "aliqua", "enim", "minim", "veniam", "quis", "nostrud", "exercitation",
  "ullamco", "laboris", "nisi", "aliquip", "commodo", "consequat", "duis",
  "aute", "irure", "voluptate", "velit", "esse", "cillum", "fugiat",
  "nulla", "pariatur", "excepteur", "sint", "occaecat"
];

const MIN_PALABRAS_ORACION = 8;
const MAX_PALABRAS_ORACION = 15;
const MIN_ORACIONES_PARRAFO = 4;
const MAX_ORACIONES_PARRAFO = 7;
const DURACION_FEEDBACK_MS = 1500;

// Entero aleatorio entre min y max, ambos incluidos
function enteroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function palabraAleatoria() {
  return PALABRAS_LOREM[enteroAleatorio(0, PALABRAS_LOREM.length - 1)];
}

function generarOracion() {
  const numPalabras = enteroAleatorio(MIN_PALABRAS_ORACION, MAX_PALABRAS_ORACION);
  const palabras = Array.from({ length: numPalabras }, palabraAleatoria);
  const texto = palabras.join(" ");
  return texto.charAt(0).toUpperCase() + texto.slice(1) + ".";
}

function generarParrafo() {
  const numOraciones = enteroAleatorio(MIN_ORACIONES_PARRAFO, MAX_ORACIONES_PARRAFO);
  return Array.from({ length: numOraciones }, generarOracion).join(" ");
}

function generarLoremIpsum(numParrafos) {
  return Array.from({ length: numParrafos }, generarParrafo);
}

// ===== Interacción con el DOM =====

const inputNumParrafos = document.getElementById("num-parrafos");
const btnLorem = document.getElementById("btn-lorem");
const resultadoLorem = document.getElementById("resultado-lorem");
const btnCopiarLorem = document.getElementById("btn-copiar-lorem");

btnLorem.addEventListener("click", () => {
  const minimo = Number(inputNumParrafos.min);
  const maximo = Number(inputNumParrafos.max);
  let numParrafos = Number(inputNumParrafos.value);

  // El usuario puede teclear cualquier cosa: validar y corregir el input
  if (!Number.isInteger(numParrafos)) {
    numParrafos = minimo;
  }
  numParrafos = Math.min(Math.max(numParrafos, minimo), maximo);
  inputNumParrafos.value = numParrafos;

  const parrafos = generarLoremIpsum(numParrafos);

  resultadoLorem.replaceChildren();
  for (const parrafo of parrafos) {
    const elementoParrafo = document.createElement("p");
    elementoParrafo.textContent = parrafo;
    resultadoLorem.appendChild(elementoParrafo);
  }

  btnCopiarLorem.hidden = false;
});

btnCopiarLorem.addEventListener("click", async () => {
  const texto = Array.from(resultadoLorem.querySelectorAll("p"))
    .map((parrafo) => parrafo.textContent)
    .join("\n\n");

  try {
    await navigator.clipboard.writeText(texto);
    const etiquetaOriginal = btnCopiarLorem.textContent;
    btnCopiarLorem.textContent = "¡Copiado!";
    btnCopiarLorem.disabled = true;
    setTimeout(() => {
      btnCopiarLorem.textContent = etiquetaOriginal;
      btnCopiarLorem.disabled = false;
    }, DURACION_FEEDBACK_MS);
  } catch {
    btnCopiarLorem.textContent = "Error al copiar";
    setTimeout(() => {
      btnCopiarLorem.textContent = "Copiar";
    }, DURACION_FEEDBACK_MS);
  }
});
