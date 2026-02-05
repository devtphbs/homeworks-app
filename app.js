const content = document.getElementById("content");
const tabs = document.querySelectorAll(".tabbar button");

let homeworks=[],user=null,currentHomework=null,trainingIndex=0,testIndex=0,language="en";

// Multi-language translations
const translations={
  en:{homeworks:"Homeworks",scanAdd:"Scan or Add Homework",noHomework:"No homework yet",newHomework:"New Homework",name:"Name",due:"Due",description:"Description",questions:"Questions (one per line)",save:"Save",upcoming:"Upcoming Homework",search:"Search Homework",searchPlaceholder:"Search by name...",appearance:"Appearance",toggleTheme:"Toggle Dark/Light Mode",language:"Language",trainingMode:"Training Mode",testMode:"Test Mode",remembering:"Remembering Techniques",readTwice:"Read this twice",done:"Done",notify:"You will be notified in 10 minutes",profileLogin:"Login / Sign Up",username:"Username",password:"Password",loginBtn:"Login / Sign Up",welcome:"Welcome",logout:"Logout",noQuestions:"No questions to test",testComplete:"Test complete",answerRecorded:"Answer recorded"},
  sv:{homeworks:"Läxor",scanAdd:"Skanna eller lägg till läxa",noHomework:"Inga läxor ännu",newHomework:"Ny läxa",name:"Namn",due:"Inlämning",description:"Beskrivning",questions:"Frågor (en per rad)",save:"Spara",upcoming:"Kommande Läxor",search:"Sök Läxa",searchPlaceholder:"Sök efter namn...",appearance:"Utseende",toggleTheme:"Växla Ljus/Mörk",language:"Språk",trainingMode:"Träningsläge",testMode:"Testläge",remembering:"Minnestekniker",readTwice:"Läs detta två gånger",done:"Klart",notify:"Du får en påminnelse om 10 minuter",profileLogin:"Logga in / Registrera",username:"Användarnamn",password:"Lösenord",loginBtn:"Logga in / Registrera",welcome:"Välkommen",logout:"Logga ut",noQuestions:"Inga frågor att testa",testComplete:"Test klart",answerRecorded:"Svar registrerat"},
  es:{homeworks:"Tareas",scanAdd:"Escanear o agregar tarea",noHomework:"No hay tareas",newHomework:"Nueva tarea",name:"Nombre",due:"Entrega",description:"Descripción",questions:"Preguntas (una por línea)",save:"Guardar",upcoming:"Próximas Tareas",search:"Buscar Tarea",searchPlaceholder:"Buscar por nombre...",appearance:"Apariencia",toggleTheme:"Modo Claro/Oscuro",language:"Idioma",trainingMode:"Modo de Entrenamiento",testMode:"Modo de Prueba",remembering:"Técnicas de Memoria",readTwice:"Lee esto dos veces",done:"Hecho",notify:"Se te notificará en 10 minutos",profileLogin:"Iniciar sesión / Registrarse",username:"Usuario",password:"Contraseña",loginBtn:"Iniciar / Registrar",welcome:"Bienvenido",logout:"Cerrar sesión",noQuestions:"No hay preguntas para probar",testComplete:"Prueba completa",answerRecorded:"Respuesta registrada"},
  pl:{homeworks:"Prace domowe",scanAdd:"Skanuj lub dodaj pracę",noHomework:"Brak prac domowych",newHomework:"Nowa praca",name:"Nazwa",due:"Termin",description:"Opis",questions:"Pytania (po jednym w wierszu)",save:"Zapisz",upcoming:"Nadchodzące prace",search:"Szukaj pracy",searchPlaceholder:"Szukaj po nazwie...",appearance:"Wygląd",toggleTheme:"Tryb jasny/ciemny",language:"Język",trainingMode:"Tryb treningowy",testMode:"Tryb testowy",remembering:"Techniki zapamiętywania",readTwice:"Przeczytaj to dwa razy",done:"Gotowe",notify:"Zostaniesz powiadomiony za 10 minut",profileLogin:"Zaloguj / Zarejestruj",username:"Nazwa użytkownika",password:"Hasło",loginBtn:"Zaloguj / Zarejestruj",welcome:"Witaj",logout:"Wyloguj",noQuestions:"Brak pytań do testu",testComplete:"Test zakończony",answerRecorded:"Odpowiedź zapisana"},
  de:{homeworks:"Hausaufgaben",scanAdd:"Hausaufgabe scannen oder hinzufügen",noHomework:"Keine Hausaufgaben",newHomework:"Neue Hausaufgabe",name:"Name",due:"Fällig",description:"Beschreibung",questions:"Fragen (eine pro Zeile)",save:"Speichern",upcoming:"Kommende Hausaufgaben",search:"Hausaufgabe suchen",searchPlaceholder:"Nach Name suchen...",appearance:"Erscheinungsbild",toggleTheme:"Hell/Dunkel Modus",language:"Sprache",trainingMode:"Trainingsmodus",testMode:"Testmodus",remembering:"Merktechniken",readTwice:"Lies dies zweimal",done:"Fertig",notify:"Du wirst in 10 Minuten benachrichtigt",profileLogin:"Anmelden / Registrieren",username:"Benutzername",password:"Passwort",loginBtn:"Anmelden / Registrieren",welcome:"Willkommen",logout:"Abmelden",noQuestions:"Keine Fragen zum Testen",testComplete:"Test abgeschlossen",answerRecorded:"Antwort aufgezeichnet"}
};
function t(key){ return translations[language][key] || key; }

/* TAB MANAGEMENT */
function setTab(i){
  tabs.forEach(tbtn=>tbtn.classList.remove("active"));
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
function showHome(){
  content.innerHTML = `<button class="primary" onclick="createHomework()">`+t("scanAdd")+`</button><br><br>`+
    (homeworks.length===0?'<p>'+t("noHomework")+'</p>':homeworks.map((h,i)=>`<div class="card" onclick="openHomework(${i})"><h3>${h.name}</h3><p>${t("due")}: ${h.due}</p><p>${h.description}</p></div>`).join(""));
}

/* CREATE HOMEWORK */
function createHomework(){
  content.innerHTML=`<div class="card"><h2>`+t("newHomework")+`</h2>
    <input id="hwName" placeholder="`+t("name")+`"><br>
    <input id="hwDue" type="date"><br>
    <textarea id="hwDesc" placeholder="`+t("description")+`"></textarea><br>
    <textarea id="hwQs" placeholder="`+t("questions")+`"></textarea><br>
    <button class="primary" onclick="saveHomework()">`+t("save")+`</button><br><br>
    <button class="primary" onclick="scanHomework()">📷 `+t("scanAdd")+`</button>
    <input type="file" id="cameraInput" accept="image/*" capture="environment" style="display:none" onchange="processScan(this.files)">
  </div>`;
}

function saveHomework(){
  const hw={name:document.getElementById("hwName").value,due:document.getElementById("hwDue").value,description:document.getElementById("hwDesc").value,questions:document.getElementById("hwQs").value.split("\n")};
  if(!hw.name) return alert(t("name")+" required");
  homeworks.push(hw); showHome();
}

/* CAMERA SCAN */
function scanHomework(){document.getElementById("cameraInput").click();}
function processScan(files){if(!files||files.length===0) return;
  Tesseract.recognize(files[0],'eng').then(({data:{text}})=>{
    const lines=text.split("\n").filter(l=>l.trim()!=="");
    const hw={name:lines[0]||"Scanned Homework",due:"",description:lines.slice(1,3).join(" "),questions:lines.slice(3)};
    homeworks.push(hw); showHome();
  });
}

/* HOMEWORK DETAIL */
function openHomework(i){
  currentHomework=homeworks[i];
  trainingIndex=0; testIndex=0;
  content.innerHTML=`<div class="card">
    <h2>${currentHomework.name}</h2>
    <p><b>${t("due")}:</b> ${currentHomework.due}</p>
    <p>${currentHomework.description}</p>
    <h3>${t("questions")}</h3>
    <ul>${currentHomework.questions.map(q=>`<li>${q}</li>`).join("")}</ul>
    <br>
    <button class="primary" onclick="startTraining()">${t("trainingMode")}</button><br><br>
    <button class="primary" onclick="startTest()">${t("testMode")}</button><br><br>
    <button class="primary" onclick="showRemembering()">${t("remembering")}</button>
  </div>`;
}

/* TRAINING MODE */
function startTraining(){
  if(Notification.permission!=="granted"){Notification.requestPermission().then(startTraining);return;}
  trainingIndex=0; trainingStep();
}
function trainingStep(){
  if(trainingIndex<currentHomework.questions.length){
    content.innerHTML=`<div class="card"><h3>`+t("readTwice")+`</h3><p>${currentHomework.questions[trainingIndex]}</p>
      <button class="primary" onclick="nextTraining()">Complete</button></div>`;
  } else {
    content.innerHTML=`<div class="card"><h3>`+t("done")+`</h3><p>`+t("notify")+`</p></div>`;
    setTimeout(()=>{new Notification(t("trainingMode"),{body:t("notify")});},600000);
  }
}
function nextTraining(){trainingIndex++; trainingStep();}

/* TEST MODE */
function startTest(){
  if(currentHomework.questions.length===0){alert(t("noQuestions")); return;}
  testIndex=0; testStep();
}
function testStep(){
  if(testIndex>=currentHomework.questions.length){alert(t("testComplete")); return;}
  content.innerHTML=`<div class="card"><h3>${currentHomework.questions[testIndex]}</h3>
    <input id="answer" placeholder="Answer"><br><br>
    <button class="primary" onclick="checkAnswer()">Submit</button></div>`;
}
function checkAnswer(){
  alert(t("answerRecorded"));
  testIndex++; testStep();
}

/* REMEMBERING TECHNIQUES */
function showRemembering(){
  content.innerHTML=`<div class="card"><h2>`+t("remembering")+`</h2>
  <ul>
  <li>Read aloud</li>
  <li>Rewrite in your own words</li>
  <li>Explain to someone else</li>
  <li>Use training mode regularly</li>
  </ul></div>`;
}

/* CALENDAR */
function showCalendar(){
  if(homeworks.length===0){content.innerHTML="<p>"+t("noHomework")+"</p>"; return;}
  content.innerHTML="<div class='card'><h2>"+t("upcoming")+"</h2><ul>"+
    homeworks.map(h=>`<li>${h.due}: ${h.name}</li>`).join("")+"</ul></div>";
}

/* SEARCH */
function showSearch(){
  content.innerHTML=`<div class="card"><h2>${t("search")}</h2>
    <input placeholder="`+t("searchPlaceholder")+`" id="searchInput" oninput="doSearch(this.value)">
    <div id="searchResults"></div></div>`;
}
function doSearch(query){
  const results=homeworks.filter(h=>h.name.toLowerCase().includes(query.toLowerCase()));
  document.getElementById("searchResults").innerHTML=results.map(h=>`<div class="card" onclick="openHomework(${homeworks.indexOf(h)})"><h3>${h.name}</h3><p>${t("due")}: ${h.due}</p></div>`).join("");
}

/* SETTINGS */
function showSettings(){
  content.innerHTML=`<div class="card"><h2>${t("appearance")}</h2>
    <button class="primary" onclick="toggleTheme()">${t("toggleTheme")}</button>
    <h2>${t("language")}</h2>
    <select onchange="setLanguage(this.value)">
      <option value="en">English (US)</option>
      <option value="sv">Svenska</option>
      <option value="es">Español</option>
      <option value="pl">Polski</option>
      <option value="de">Deutsch</option>
    </select></div>`;
}
function toggleTheme(){document.body.classList.toggle("dark");}
function setLanguage(l){language=l; showSettings();}

/* PROFILE */
function showProfile(){
  if(!user){
    content.innerHTML=`<div class="card"><h2>`+t("profile
