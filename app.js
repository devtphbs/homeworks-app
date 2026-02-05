const content = document.getElementById("content");
const tabs = document.querySelectorAll(".tabbar button");

let homeworks = []; // START EMPTY
let user = null;
let currentHomework = null;
let trainingIndex = 0;

/* TAB MANAGEMENT */
function setTab(i) {
  tabs.forEach(t => t.classList.remove("active"));
  tabs[i].classList.add("active");
  switch(i){
    case 0: showHome(); break;
    case 1: showCalendar(); break;
    case 2: showSearch(); break;
    case 3: showSettings(); break;
    case 4: showProfile(); break;
  }
}

/* HOME */
function showHome() {
  setTab(0);
  content.innerHTML = `
    <button class="primary" onclick="createHomework()">Scan or Add Homework</button><br><br>
    ${homeworks.length === 0 ? '<p>No homework yet</p>' : homeworks.map((h,i)=>`
      <div class="card" onclick="openHomework(${i})">
        <h3>${h.name}</h3>
        <p>Due: ${h.due}</p>
        <p>${h.description}</p>
      </div>
    `).join("")}
  `;
}

/* CREATE HOMEWORK */
function createHomework() {
  content.innerHTML = `
    <div class="card">
      <h2>New Homework</h2>
      <input id="hwName" placeholder="Name"><br>
      <input id="hwDue" type="date"><br>
      <textarea id="hwDesc" placeholder="Description"></textarea><br>
      <textarea id="hwQs" placeholder="Questions (one per line)"></textarea><br>
      <button class="primary" onclick="saveHomework()">Save</button>
    </div>
  `;
}

function saveHomework() {
  const hw = {
    name: document.getElementById("hwName").value,
    due: document.getElementById("hwDue").value,
    description: document.getElementById("hwDesc").value,
    questions: document.getElementById("hwQs").value.split("\n")
  };
  if(!hw.name) return alert("Enter a name");
  homeworks.push(hw);
  showHome();
}

/* HOMEWORK DETAIL */
function openHomework(i) {
  currentHomework = homeworks[i];
  content.innerHTML = `
    <div class="card">
      <h2>${currentHomework.name}</h2>
      <p><b>Due:</b> ${currentHomework.due}</p>
      <p>${currentHomework.description}</p>

      <h3>Questions</h3>
      <ul>${currentHomework.questions.map(q => `<li>${q}</li>`).join("")}</ul>

      <br>
      <button class="primary" onclick="startTraining()">Training Mode</button>
      <br><br>
      <button class="primary" onclick="startTest()">Test Mode</button>
      <br><br>
      <button class="primary" onclick="showRemembering()">Remembering Techniques</button>
    </div>
  `;
}

/* TRAINING MODE */
function startTraining() {
  if(Notification.permission !== "granted"){
    Notification.requestPermission().then(startTraining);
    return;
  }
  trainingIndex = 0;
  trainingStep();
}

function trainingStep() {
  if(trainingIndex < currentHomework.questions.length){
    content.innerHTML = `
      <div class="card">
        <h3>Read this twice</h3>
        <p>${currentHomework.questions[trainingIndex]}</p>
        <button class="primary" onclick="nextTraining()">Complete</button>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div class="card">
        <h3>Done</h3>
        <p>You will be notified in 10 minutes</p>
      </div>
    `;
    setTimeout(()=>{ new Notification("Training Time", {body:"Repeat your homework training"}); },600000);
  }
}

function nextTraining(){ trainingIndex++; trainingStep(); }

/* TEST MODE */
function startTest() {
  if(currentHomework.questions.length === 0){
    return alert("No questions to test");
  }
  let testIndex = 0;

  function testStep(){
    if(testIndex >= currentHomework.questions.length){
      return alert("Test complete");
    }
    content.innerHTML = `
      <div class="card">
        <h3>Question</h3>
        <p>${currentHomework.questions[testIndex]}</p>
        <input id="answer" placeholder="Your answer">
        <br><br>
        <button class="primary" onclick="checkAnswer()">Submit</button>
      </div>
    `;
  }

  function checkAnswer(){
    // Simple feedback placeholder
    alert("Answer recorded"); 
    testIndex++;
    testStep();
  }

  testStep();
}

/* REMEMBERING TECHNIQUES */
function showRemembering() {
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

/* CALENDAR */
function showCalendar() {
  setTab(1);
  if(homeworks.length === 0){
    content.innerHTML = "<p>No homework added yet</p>";
    return;
  }
  let calendarHTML = "<div class='card'><h2>Upcoming Homework</h2><ul>";
  homeworks.forEach(h => calendarHTML += `<li>${h.due}: ${h.name}</li>`);
  calendarHTML += "</ul></div>";
  content.innerHTML = calendarHTML;
}

/* SEARCH */
function showSearch() {
  setTab(2);
  content.innerHTML = `
    <div class="card">
      <h2>Search Homework</h2>
      <input placeholder="Search by name..." id="searchInput" oninput="doSearch(this.value)">
      <div id="searchResults"></div>
    </div>
  `;
}

function doSearch(query){
  const results = homeworks.filter(h => h.name.toLowerCase().includes(query.toLowerCase()));
  document.getElementById("searchResults").innerHTML = results.map((h,i)=>`
    <div class="card" onclick="openHomework(${homeworks.indexOf(h)})">
      <h3>${h.name}</h3>
      <p>Due: ${h.due}</p>
    </div>
  `).join("");
}

/* SETTINGS */
function showSettings() {
  setTab(3);
  content.innerHTML = `
    <div class="card">
      <h2>Appearance</h2>
      <button class="primary" onclick="toggleTheme()">Toggle Dark/Light Mode</button>
    </div>
  `;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* PROFILE */
function showProfile() {
  setTab(4);
  if(!user){
    content.innerHTML = `
      <div class="card">
        <h2>Login / Sign Up</h2>
        <input id="username" placeholder="Username"><br>
        <input id="password" placeholder="Password" type="password"><br>
        <button class="primary" onclick="login()">Login / Sign Up</button>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div class="card">
        <h2>Welcome, ${user}</h2>
        <button class="primary" onclick="logout()">Logout</button>
      </div>
    `;
  }
}

function login(){
  const uname = document.getElementById("username").value;
  if(!uname) return alert("Enter username");
  user = uname;
  showProfile();
}

function logout(){
  user = null;
  showProfile();
}

/* INITIAL LOAD */
setTab(0);
