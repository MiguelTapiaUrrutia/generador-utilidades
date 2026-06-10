// ===== Utilidades compartidas =====

const DURACION_FEEDBACK_MS = 1500;

// Entero aleatorio entre min y max, ambos incluidos
function enteroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function elementoAleatorio(array) {
  return array[enteroAleatorio(0, array.length - 1)];
}

// Lee el valor del input, lo valida contra sus atributos min/max y lo corrige
function leerCantidadValidada(input) {
  const minimo = Number(input.min);
  const maximo = Number(input.max);
  let cantidad = Number(input.value);

  if (!Number.isInteger(cantidad)) {
    cantidad = minimo;
  }
  cantidad = Math.min(Math.max(cantidad, minimo), maximo);
  input.value = cantidad;
  return cantidad;
}

// Pinta cada línea de texto como un <p> dentro del contenedor
function pintarLineas(contenedor, lineas) {
  contenedor.replaceChildren();
  for (const linea of lineas) {
    const parrafo = document.createElement("p");
    parrafo.textContent = linea;
    contenedor.appendChild(parrafo);
  }
}

// Copia el texto al portapapeles y muestra feedback breve en el botón
async function copiarConFeedback(boton, texto) {
  const etiquetaOriginal = boton.textContent;
  try {
    await navigator.clipboard.writeText(texto);
    boton.textContent = "¡Copiado!";
  } catch {
    boton.textContent = "Error al copiar";
  }
  boton.disabled = true;
  setTimeout(() => {
    boton.textContent = etiquetaOriginal;
    boton.disabled = false;
  }, DURACION_FEEDBACK_MS);
}

function textoDelContenedor(contenedor) {
  return Array.from(contenedor.querySelectorAll("p"))
    .map((parrafo) => parrafo.textContent)
    .join("\n\n");
}

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

function generarOracion() {
  const numPalabras = enteroAleatorio(MIN_PALABRAS_ORACION, MAX_PALABRAS_ORACION);
  const palabras = Array.from({ length: numPalabras }, () => elementoAleatorio(PALABRAS_LOREM));
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

// ===== Generador de emails de prueba =====

const NOMBRES = [
  "jose", "maria", "juan", "carolina", "luis", "camila", "pedro",
  "francisca", "diego", "valentina", "felipe", "javiera", "matias",
  "fernanda", "sebastian", "constanza", "rodrigo", "daniela",
  "cristian", "alejandra"
];

const APELLIDOS = [
  "gonzalez", "munoz", "rojas", "diaz", "perez", "soto", "contreras",
  "silva", "martinez", "sepulveda", "morales", "rodriguez", "lopez",
  "fuentes", "hernandez", "torres", "araya", "flores", "espinoza",
  "valenzuela"
];

const DOMINIOS = [
  "correofalso.cl", "pruebamail.com", "demomail.cl",
  "testeo.com", "ejemplo.cl", "ficticio.com"
];

const SEPARADORES = [".", "_", ""];
const PROBABILIDAD_NUMERO = 0.5;
const MAX_NUMERO_EMAIL = 99;

function generarEmail() {
  const nombre = elementoAleatorio(NOMBRES);
  const apellido = elementoAleatorio(APELLIDOS);
  const separador = elementoAleatorio(SEPARADORES);
  const numero = Math.random() < PROBABILIDAD_NUMERO ? enteroAleatorio(1, MAX_NUMERO_EMAIL) : "";
  const dominio = elementoAleatorio(DOMINIOS);
  return `${nombre}${separador}${apellido}${numero}@${dominio}`;
}

function generarEmails(cantidad) {
  const emails = new Set();
  // El Set descarta duplicados; el límite de intentos evita un bucle infinito
  const maxIntentos = cantidad * 100;
  let intentos = 0;
  while (emails.size < cantidad && intentos < maxIntentos) {
    emails.add(generarEmail());
    intentos++;
  }
  return Array.from(emails);
}

// ===== Generador de contraseñas =====

const MAYUSCULAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MINUSCULAS = "abcdefghijklmnopqrstuvwxyz";
const NUMEROS = "0123456789";
const SIMBOLOS = "!@#$%^&*()-_=+[]{};:,.<>?";

// Entero aleatorio criptográficamente seguro entre 0 y limite-1.
// Descarta valores fuera del múltiplo de limite para no sesgar el módulo.
function indiceAleatorioSeguro(limite) {
  const RANGO_UINT32 = 4294967296;
  const maxSinSesgo = Math.floor(RANGO_UINT32 / limite) * limite;
  const buffer = new Uint32Array(1);
  let valor;
  do {
    crypto.getRandomValues(buffer);
    valor = buffer[0];
  } while (valor >= maxSinSesgo);
  return valor % limite;
}

function caracterAleatorioSeguro(conjunto) {
  return conjunto[indiceAleatorioSeguro(conjunto.length)];
}

// Fisher-Yates con azar criptográfico; devuelve una copia mezclada
function mezclarSeguro(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = indiceAleatorioSeguro(i + 1);
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function generarPassword(largo, opciones) {
  const conjuntosActivos = [];
  if (opciones.mayusculas) conjuntosActivos.push(MAYUSCULAS);
  if (opciones.minusculas) conjuntosActivos.push(MINUSCULAS);
  if (opciones.numeros) conjuntosActivos.push(NUMEROS);
  if (opciones.simbolos) conjuntosActivos.push(SIMBOLOS);

  if (conjuntosActivos.length === 0) {
    throw new Error("Debe haber al menos un tipo de carácter seleccionado");
  }

  // Un carácter garantizado de cada conjunto activo, el resto del pool completo
  const pool = conjuntosActivos.join("");
  const garantizados = conjuntosActivos.map(caracterAleatorioSeguro);
  const restantes = Array.from(
    { length: largo - garantizados.length },
    () => caracterAleatorioSeguro(pool)
  );

  return mezclarSeguro([...garantizados, ...restantes]).join("");
}

// ===== Interacción con el DOM =====

const inputNumParrafos = document.getElementById("num-parrafos");
const btnLorem = document.getElementById("btn-lorem");
const resultadoLorem = document.getElementById("resultado-lorem");
const btnCopiarLorem = document.getElementById("btn-copiar-lorem");

btnLorem.addEventListener("click", () => {
  const numParrafos = leerCantidadValidada(inputNumParrafos);
  pintarLineas(resultadoLorem, generarLoremIpsum(numParrafos));
  btnCopiarLorem.hidden = false;
});

btnCopiarLorem.addEventListener("click", () => {
  copiarConFeedback(btnCopiarLorem, textoDelContenedor(resultadoLorem));
});

const inputNumEmails = document.getElementById("num-emails");
const btnEmails = document.getElementById("btn-emails");
const resultadoEmails = document.getElementById("resultado-emails");
const btnCopiarEmails = document.getElementById("btn-copiar-emails");

btnEmails.addEventListener("click", () => {
  const numEmails = leerCantidadValidada(inputNumEmails);
  pintarLineas(resultadoEmails, generarEmails(numEmails));
  btnCopiarEmails.hidden = false;
});

btnCopiarEmails.addEventListener("click", () => {
  const emails = Array.from(resultadoEmails.querySelectorAll("p"))
    .map((parrafo) => parrafo.textContent)
    .join("\n");
  copiarConFeedback(btnCopiarEmails, emails);
});

const inputLargoPassword = document.getElementById("largo-password");
const btnPassword = document.getElementById("btn-password");
const resultadoPassword = document.getElementById("resultado-password");
const btnCopiarPassword = document.getElementById("btn-copiar-password");

const checksPassword = {
  mayusculas: document.getElementById("chk-mayusculas"),
  minusculas: document.getElementById("chk-minusculas"),
  numeros: document.getElementById("chk-numeros"),
  simbolos: document.getElementById("chk-simbolos")
};

btnPassword.addEventListener("click", () => {
  const opciones = {
    mayusculas: checksPassword.mayusculas.checked,
    minusculas: checksPassword.minusculas.checked,
    numeros: checksPassword.numeros.checked,
    simbolos: checksPassword.simbolos.checked
  };

  if (!Object.values(opciones).some(Boolean)) {
    const mensaje = document.createElement("p");
    mensaje.classList.add("mensaje-error");
    mensaje.textContent = "Selecciona al menos un tipo de carácter para generar la contraseña.";
    resultadoPassword.replaceChildren(mensaje);
    btnCopiarPassword.hidden = true;
    return;
  }

  const largo = leerCantidadValidada(inputLargoPassword);
  const codigo = document.createElement("code");
  codigo.textContent = generarPassword(largo, opciones);
  resultadoPassword.replaceChildren(codigo);
  btnCopiarPassword.hidden = false;
});

btnCopiarPassword.addEventListener("click", () => {
  const codigo = resultadoPassword.querySelector("code");
  if (codigo) {
    copiarConFeedback(btnCopiarPassword, codigo.textContent);
  }
});
