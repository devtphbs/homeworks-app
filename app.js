let homeworks = [];
let current = null;
let trainingIndex = 0;

const content = document.getElementById("content");

function showHome() {
  content.innerHTML = `
    <div class="card">
      <button class="button" onclick="scanHomework()">Scan Homework</button>
      <br><br>
      <button class="button secondary" onclick="createHomework()">Create Homework</button>
    </div>

    ${homeworks.map((h, i) => `
      <div class="card" onclick="openHomework(${i})">
        <h3>${h.name}</h3>
        <p>Due: ${h.due}</p>
      </div>
    `).join("")}
  `;
}

function scanHomework() {
  content.innerHTML = `
    <div class="card">
      <h2>Scan Homework</h2>
      <input type="file" accept="image/*" capture="environment">
      <p>Photo analysis will be added later.</p>
    </div>
  `;
}

function createHomework() {
  content.innerHTML = `
    <div class="card">
      <h2>New Homework</h2>
      <input id="name" placeholder="Name"><br><br>
      <input id="due" type="date"><br><br>
      <textarea id="desc" placeholder="Description"></textarea><br><br>
      <textarea id="qs" placeholder="Questions (one per line)"></textarea><br><br>
      <button class="button" onclick="saveHomework()">Save</button>
    </div>
  `;
}

function saveHomework() {
  const hw = {
    name: name.value,
    due: due.value,
    desc: desc.value,
    questions: qs.value.split("\n")
  };
  homeworks.push(hw);
  showHome();
}

function openHomework(i) {
  current = homeworks[i];
  content.innerHTML = `
    <div class="card">
      <h2>${current.name}</h2>
      <p><b>Due:</b> ${current.due}</p>
      <p>${current.desc}</p>

      <h3>Questions</h3>
      <ul>${current.questions.map(q => `<li>${q}</li>`).join("")}</ul>

      <br>
      <button class="button" onclick="startTraining()">Training Mode</button>
      <br><br>
      <button class="button secondary" onclick="startTest()">Test Mode</button>
      <br><br>
      <button class="button secondary" onclick="remembering()">Remembering Techniques</button>
    </div>
  `;
}

function startTraining() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then(startTraining);
    return;
  }

  trainingIndex = 0;
  trainingStep();
}

function trainingStep() {
  if (trainingIndex < current.questions.length) {
    content.innerHTML = `
      <div class="card">
        <h3>Read this twice</h3>
        <p>${current.questions[trainingIndex]}</p>
        <button class="button" onclick="nextTraining()">Complete</button>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div class="card">
        <h3>Done</h3>
        <p>You will be notified in 10 minutes</p>
      </div>
    `;
    setTimeout(sendTrainingNotification, 600000);
  }
}

function nextTraining() {
  trainingIndex++;
  trainingStep();
}

function sendTrainingNotification() {
  new Notification("Training Time", {
    body: "Repeat your homework training"
  });
}

function startTest() {
  content.innerHTML = `
    <div class="card">
      <h2>Test Mode</h2>
      <p>Question:</p>
      <p>${current.questions[0]}</p>
      <input placeholder="Your answer">
      <br><br>
      <button class="button">Submit</button>
    </div>
  `;
}

function remembering() {
  content.innerHTML = `
    <div class="card">
      <h2>Remembering Techniques</h2>
      <ul>
        <li>Read aloud</li>
        <li>Rewrite in your own words</li>
        <li>Explain to someone else</li>
        <li>Use training mode regularly</li>
      </ul>
    </div>
  `;
}

function showSettings() {
  content.innerHTML = `
    <div class="card">
      <h2>Accent Gradient</h2>
      <input type="color" onchange="setG1(this.value)">
      <br><br>
      <input type="color" onchange="setG2(this.value)">
    </div>
  `;
}

function setG1(v) {
  document.documentElement.style.setProperty('--g1', v);
}
function setG2(v) {
  document.documentElement.style.setProperty('--g2', v);
}

showHome();
