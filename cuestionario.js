const preguntas = [
  {
    texto: "¿Cómo se llaman las «fotos» que Git toma de tu proyecto?",
    opciones: ["Ramas", "Commits", "Forks"],
    correcta: 1
  },
  {
    texto: "¿Qué comando sirve para elegir lo que entra en la foto?",
    opciones: ["git add", "git push", "git clone"],
    correcta: 0
  },
  {
    texto: "¿Para qué sirve una rama?",
    opciones: [
      "Para borrar el proyecto",
      "Para experimentar sin afectar la versión principal",
      "Para publicar una web"
    ],
    correcta: 1
  },
  {
    texto: "¿Cuál es la diferencia entre Git y GitHub?",
    opciones: [
      "Son lo mismo",
      "Git es un sitio web y GitHub un programa",
      "Git es la cámara y GitHub es el álbum en línea"
    ],
    correcta: 2
  },
  {
    texto: "¿Qué es un Pull Request?",
    opciones: [
      "Pedir que sumen tus cambios",
      "Bajar cambios de GitHub",
      "Copiar el repo a tu compu"
    ],
    correcta: 0
  }
];

const form = document.getElementById("cuestionario");
const tiempoEl = document.getElementById("tiempo");
const resultado = document.getElementById("resultado");
const btnCalificar = document.getElementById("calificar");

let inicio;
let intervalo;

function formatear(segundos) {
  const m = Math.floor(segundos / 60);
  const s = String(segundos % 60).padStart(2, "0");
  return m + ":" + s;
}

function segundosTranscurridos() {
  return Math.floor((Date.now() - inicio) / 1000);
}

function leerIntentos() {
  try { return Number(localStorage.getItem("intentosGit")) || 0; }
  catch (e) { return 0; }
}

function guardarIntentos(n) {
  try { localStorage.setItem("intentosGit", n); } catch (e) {}
}

function dibujarPreguntas() {
  form.innerHTML = "";
  preguntas.forEach((p, i) => {
    const div = document.createElement("div");
    div.className = "tarjeta pregunta";
    div.innerHTML = "<h3>" + (i + 1) + ". " + p.texto + "</h3>";
    p.opciones.forEach((op, j) => {
      const label = document.createElement("label");
      label.className = "opcion";
      label.innerHTML = '<input type="radio" name="p' + i + '" value="' + j + '"> ' + op;
      div.appendChild(label);
    });
    form.appendChild(div);
  });
}

function empezar() {
  dibujarPreguntas();
  resultado.classList.remove("visible");
  btnCalificar.style.display = "";
  inicio = Date.now();
  tiempoEl.textContent = "0:00";
  clearInterval(intervalo);
  intervalo = setInterval(() => {
    tiempoEl.textContent = formatear(segundosTranscurridos());
  }, 1000);
}

function calificar() {
  const sinResponder = preguntas.filter((p, i) => !form.querySelector('input[name="p' + i + '"]:checked'));
  if (sinResponder.length > 0) {
    alert("Te faltan " + sinResponder.length + " pregunta(s) por responder.");
    return;
  }

  clearInterval(intervalo);
  const segundos = segundosTranscurridos();
  let correctas = 0;

  preguntas.forEach((p, i) => {
    const elegida = form.querySelector('input[name="p' + i + '"]:checked');
    const labels = form.querySelectorAll('input[name="p' + i + '"]');
    labels.forEach((input) => {
      input.disabled = true;
      if (Number(input.value) === p.correcta) input.parentElement.classList.add("correcta");
    });
    if (Number(elegida.value) === p.correcta) {
      correctas++;
    } else {
      elegida.parentElement.classList.add("incorrecta");
    }
  });

  const intento = leerIntentos() + 1;
  guardarIntentos(intento);

  document.getElementById("correctas").textContent = correctas + "/" + preguntas.length;
  document.getElementById("intento").textContent = intento;
  document.getElementById("duracion").textContent = formatear(segundos);
  resultado.classList.add("visible");
  btnCalificar.style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

btnCalificar.addEventListener("click", calificar);
document.getElementById("reintentar").addEventListener("click", empezar);

empezar();
