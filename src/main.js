const key = atob("b1pETkE4YjVpNjVwYVhpRHBmOHNhaFpJWU53OWx3TksxVjFrQ1k0MURQR05PNHJoaVVHMURHMXhRbVJsM3o2QQk=");

const compList = [
  { name: "2026mdpas" },
  { name: "2026mdsev" },
  { name: "2025mdpas" }
];

function createOption(v,str) {
  let option = document.createElement('option');
  option.value = v;
  option.textContent = str;
  
  return option;
}

function updateCompList() {
  const comp = document.getElementById("comp");
  comp.innerHTML = "";

  comp.appendChild(createOption("","N/A"));
  for(const c of compList) {
    comp.appendChild(createOption(c.name,c.name));
  }
}

async function updateTeamList() {
  const team = document.getElementById("team");
  const compCode = document.getElementById("comp").value;
  const matchNum = document.getElementById("match").value || 1;

  team.innerHTML = "";
  team.appendChild(createOption("", "N/A"));

  if (!compCode || !matchNum) return;

  try {
    const matchKey = `${compCode}_qm${matchNum}`;
    
    const response = await fetch(`https://www.thebluealliance.com/api/v3/match/${matchKey}`, {
      headers: { 'X-TBA-Auth-Key': key }
    });
    
    const data = await response.json();

    const red = data.alliances.red.team_keys.map(t => t.replace('frc', ''));
    const blue = data.alliances.blue.team_keys.map(t => t.replace('frc', ''));

    red.forEach((t, i) => team.appendChild(createOption(t, `Red ${i + 1}: ${t}`)));
    blue.forEach((t, i) => team.appendChild(createOption(t, `Blue ${i + 1}: ${t}`)));

  } catch (e) {
    console.error("Error fetching from TBA:", e);
  }
}

// --------------------------------------------------------------------------------------------------------------------------

// add to storage
function appendData() {
  const data = {
    team: getV("team"),
    match: getV("match"),
    comp: getV("comp"),
    fuelAuto: getV("fuelAuto"),
    depotAuto: getV("depotAuto"),
    climbAuto: getV("climbAuto"),
    fuelTele: getV("fuelTele"),
    depotTele: getV("depotTele"),
    climbTele: getV("climbTele"),
    notes: getV("notes")
  };

  // make sure they added important stuff
  if(data.team == "") {return;}
  if(data.match == "") {return;}
  if(data.comp == "") {return;}

  let curData = (JSON.parse(localStorage.getItem("data")) || []);
  curData.push(data);
  curData = JSON.stringify(curData);

  localStorage.setItem("data",curData);
  console.log({ savedData : data })

  clear();
}

const checkForImportantStuff = setInterval(function() {
  document.getElementById("submit").disabled = false;

  const data = {
    team: getV("team"),
    match: getV("match"),
    comp: getV("comp"),
  };

  if(data.team == "") {document.getElementById("submit").disabled = true; return;}
  if(data.match == "") {document.getElementById("submit").disabled = true; return;}
  if(data.comp == "") {document.getElementById("submit").disabled = true; return;}

}, 50);

// --------------------------------------------------------------------------------------------------------------------------

// download file
function download() {
  document.getElementById("download").disabled = true;

  const data = (JSON.parse(localStorage.getItem("data")) || []);
  console.log({ data : data });

  if(data.length == 0) {
    console.error("Nothing saved to cache");
    document.getElementById("download").disabled = false;
    return;
  }
  
  try {
    const output = new Blob([JSON.stringify(data)],{type: "application/json"});
    const downloadUrl = URL.createObjectURL(output);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = `${Date.now()}.json`;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadUrl);

    localStorage.removeItem("data");

    document.getElementById("download").disabled = false;
    
    reload();
  } catch {
    document.getElementById("download").disabled = false;
    console.error("Couldn't download file");
  }
}

const checkForMoreImportantStuff = setInterval(function() {
  if((localStorage.getItem("data") || []).length == 0) {
    document.getElementById("download").disabled = true;
  } else {
    document.getElementById("download").disabled = false;
  }
}, 50);

function reload() {
  location.reload();
}

// --------------------------------------------------------------------------------------------------------------------------

// automatically save data
function saveForm() {
  const formData = {
    team: getV("team"),
    match: getV("match"),
    comp: getV("comp"),
    fuelAuto: getV("fuelAuto"),
    depotAuto: getV("depotAuto"),
    climbAuto: getV("climbAuto"),
    fuelTele: getV("fuelTele"),
    depotTele: getV("depotTele"),
    climbTele: getV("climbTele"),
    notes: getV("notes")
  };
  localStorage.setItem('flipSave', JSON.stringify(formData));
}

// Restore data when moving
window.onload = function() {
  const data = JSON.parse(localStorage.getItem('flipSave'));

  updateCompList();
  updateTeamList();
  
  if (data) {
    setV("team",data.team);
    setV("match",data.match);
    setV("comp",data.comp);
    setV("fuelAuto",data.fuelAuto);
    setV("depotAuto",data.depotAuto);
    setV("climbAuto",data.climbAuto);
    setV("fuelTele",data.fuelTele);
    setV("depotTele",data.depotTele);
    setV("climbTele",data.climbTele);
    setV("notes",data.notes);
  }
};

// move to landscape / portrait website
const checkForFlip = setInterval(function() {
  localStorage.removeItem('flipSave');
  if(document.head.getAttribute("displayType") == "landscape") {
    if (window.screen.width < window.screen.height) {
      saveForm();
      location.href = "../m/rebuilt";
    }
  } else {
    if (window.screen.width > window.screen.height) {
      saveForm();
      location.href = "../c/rebuilt";
    }
  }
}, 50);

// --------------------------------------------------------------------------------------------------------------------------

function getV(item) {
  return document.getElementById(item).value;
}

function setV(item,v) {
  document.getElementById(item).value = v;
}

function clear() {
    setV("team","");
    setV("match","");
    setV("fuelAuto","");
    setV("depotAuto","");
    setV("climbAuto",0),
    setV("fuelTele","");
    setV("depotTele","");
    setV("climbTele",0);
    setV("notes","");
}

// add or remove from a number value
function ibutton(n,t) {
  const number = document.getElementById(t);
  number.value = (parseInt(number.value) || 0) + n;
  if(parseInt(number.value) <= 0) {
    number.value = "";
  }
}