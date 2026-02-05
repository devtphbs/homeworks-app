let questions = [
  "Plants use sunlight to make food",
  "Carbon dioxide is taken in",
  "Oxygen is released"
];

let index = 0;

function showHome() {
  content.innerHTML = `
    <div class="card">
      <h2>Photosynthesis Homework</h2>
      <p>3 training sentences</p>
    </div>`;
}

function showTraining() {
  if (Notification.permission !== "granted") {
    content.innerHTML = `
      <div class="card">
        <h2>Training Mode</h2>
        <p>Notifications are required.</p>
        <button onclick="requestPermission()">Allow Notifications</button>
      </div>`;
    return;
  }

  if (index < questions.length) {
    content.innerHTML = `
      <div class="card">
        <h3>Read twice</h3>
        <p>${questions[index]}</p>
        <button onclick="next()">Complete</button>
      </div>`;
  } else {
    content.innerHTML = `
      <div class="card">
        <h3>Done</h3>
        <p>You will be notified in 10 minutes</p>
      </div>`;
    setTimeout(sendNotification, 600000);
  }
}

function next() {
  index++;
  showTraining();
}

function requestPermission() {
  Notification.requestPermission().then(showTraining);
}

function sendNotification() {
  new Notification("Training Time", {
    body: "Repeat your homework sentences"
  });
}

function showSettings() {
  content.innerHTML = `
    <div class="card">
      <h2>Appearance</h2>
      <input type="color" onchange="setGradient1(this.value)">
      <input type="color" onchange="setGradient2(this.value)">
    </div>`;
}

function setGradient1(val) {
  document.documentElement.style.setProperty('--g1', val);
}
function setGradient2(val) {
  document.documentElement.style.setProperty('--g2', val);
}

showHome();
