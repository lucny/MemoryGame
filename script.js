const presidents = [
  { name: "Tomáš Garigue Masaryk", photo: "prez1.jpg" },
  { name: "Edvard Beneš", photo: "prez2.jpg" },
  { name: "Emil Hácha", photo: "prez3.jpg" },
  { name: "Klement Gottwald", photo: "prez4.jpg" },
  { name: "Antonín Zápotocký", photo: "prez5.jpg" },
  { name: "Antonín Novotný", photo: "prez6.jpg" },
  { name: "Ludvík Svoboda", photo: "prez7.jpg" },
  { name: "Gustáv Husák", photo: "prez8.jpg" },
  { name: "Václav Havel", photo: "prez9.jpg" },
  { name: "Václav Klaus", photo: "prez10.jpg" },
  { name: "Miloš Zeman", photo: "prez11.jpg" },
  { name: "Petr Pavel", photo: "prez12.jpg" },
];

let errors = 0;

const sorted = [...presidents].sort(() => Math.random() - 0.5);
const selected = sorted.slice(0, 8);
const unselectedNames = sorted.slice(8, 12).map((president) => president.name);

const selection = [...selected, ...selected];	

const tilesContainer = document.querySelector(".tiles");
const colors = [
  "aqua",
  "aquamarine",
  "crimson",
  "blue",
  "dodgerblue",
  "gold",
  "greenyellow",
  "teal",
];
const colorsPicklist = [...colors, ...colors];
const tileCount = colorsPicklist.length;

// Game state
let revealedCount = 0;
let activeTile = null;
let awaitingEndOfMove = false;

function buildTile(color, president) {
  const img = document.createElement("img");
  img.src = `img/${president.photo}`;
  img.classList.add("tile__img");
  img.style.display = "none";
  img.setAttribute("data-revealed", "false");
  const label = document.createElement("div");
  label.classList.add("tile__label");
  label.textContent = president.name;
  label.style.display = "none";
  const element = document.createElement("div");
  element.classList.add("tile");
  element.setAttribute("data-color", color);
  element.setAttribute("data-revealed", "false");
  element.appendChild(img);

  element.addEventListener("click", () => {
    const revealed = element.getAttribute("data-revealed");

    if (awaitingEndOfMove || revealed === "true" || element == activeTile) {
      return;
    }

    // Reveal this color
    element.style.backgroundColor = color;
    img.style.display = "block";

    if (!activeTile) {
      activeTile = element;
      activeImg = img;
      return;
    }

    const colorToMatch = activeTile.getAttribute("data-color");

    if (colorToMatch === color) {
      element.setAttribute("data-revealed", "true");
      img.setAttribute("data-revealed", "true"); 
      activeTile.setAttribute("data-revealed", "true");
      activeImg.setAttribute("data-revealed", "true");

      activeTile = null;
      activeImg = null;
      awaitingEndOfMove = false;
      revealedCount += 2;

      if (revealedCount === tileCount) {
        createQuiz();
        quizCheckboxes();
        //alert("You win! Refresh to start again.");
      }

      return;
    }

    awaitingEndOfMove = true;

    setTimeout(() => {
      activeTile.style.backgroundColor = null;
      activeImg.style.display = "none";
      element.style.backgroundColor = null;
      img.style.display = "none";

      awaitingEndOfMove = false;
      activeTile = null;
      activeImg = null;
      errors++;
      document.getElementById("errors").innerHTML = errors;
    }, 1000);
  });

  return element;
}

// Build up tiles
for (let i = 0; i < tileCount; i++) {
  const randomIndex = Math.floor(Math.random() * colorsPicklist.length);
  const tile = buildTile(colorsPicklist[randomIndex], selection[randomIndex]);

  colorsPicklist.splice(randomIndex, 1);
  selection.splice(randomIndex, 1);
  tilesContainer.appendChild(tile);
}


function createCheckbox(labelText, value) {
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = value;
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(labelText));
  return label;
}

function createQuiz() {
  const quizOptions = document.getElementById("quiz_options");
  presidents.forEach((president) => {
    const quizOption = document.createElement("div");
    const checkbox = createCheckbox(president.name, president.name);
    quizOption.appendChild(checkbox);
    quizOptions.appendChild(quizOption);
  });
  document.querySelector(".quiz__button").style.display = "block";
}    

function quizCheckboxes() {
  const quiz = document.getElementById("quiz_options");
  const checkboxes = quiz.querySelectorAll("input[type=checkbox]");
  const submit = document.querySelector("button");
  submit.addEventListener("click", (event) => {
    event.preventDefault();
    const checked = [...checkboxes].filter((checkbox) => checkbox.checked);
    const checkedNames = checked.map((checkbox) => checkbox.value);
    const correct = unselectedNames.every((name) => checkedNames.includes(name)) && checkedNames.length === 4;
    document.getElementById('result').innerHTML = (correct ? "Správně!" : "Špatně!");
    console.log(unselectedNames, checkedNames);
  });
}

