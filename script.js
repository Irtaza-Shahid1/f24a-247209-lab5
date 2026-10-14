var form = document.querySelector("#wait");
var join = document.querySelector("#join");
var call = document.querySelector("#call");
var nameBox = document.querySelector("#who");
var minsBox = document.querySelector("#mins");
var bayBox = document.querySelector("#bay");
var board = document.querySelector("#board");
var statusLine = document.querySelector("#status");
var waiting = document.querySelector("#waiting");
var longest = document.querySelector("#longest");

// Only add listeners when the page elements exist.
if (form && join && call && nameBox && minsBox && bayBox && board && statusLine && waiting && longest) {
  var queue = [];

  function showQueue() {
    board.innerHTML = "";
    var highest = 0;
    var hasNumber = false;

    for (var i = 0; i < queue.length; i++) {
      var row = document.createElement("tr");
      var nameCell = document.createElement("td");
      var minsCell = document.createElement("td");
      var bayCell = document.createElement("td");

      nameCell.textContent = queue[i].name;
      minsCell.textContent = queue[i].minutes;
      bayCell.textContent = queue[i].bay;

      row.appendChild(nameCell);
      row.appendChild(minsCell);
      row.appendChild(bayCell);
      board.appendChild(row);

      if (isFinite(queue[i].minutes) && (!hasNumber || queue[i].minutes > highest)) {
        highest = queue[i].minutes;
        hasNumber = true;
      }
    }

    waiting.textContent = queue.length;
    longest.textContent = hasNumber ? highest : 0;
  }

  function addVisitor(event) {
    event.preventDefault();
    var data = new FormData(form);
    var name = data.get("who");
    var minsText = data.get("mins");
    var bay = data.get("bay");

    if (name === null || name.trim() === "") {
      statusLine.textContent = "undefined";
      return;
    }

    var minutes = Number(minsText);
    if (minsText === null || minsText.trim() === "" || !isFinite(minutes)) {
      minsBox.setCustomValidity("not a number");
      minsBox.reportValidity();
      return;
    }
    minsBox.setCustomValidity("");
    name = name.trim();

    var found = -1;
    for (var i = 0; i < queue.length; i++) {
      if (queue[i].name === name && queue[i].bay === bay) {
        found = i;
        break;
      }
    }

    if (found === -1) {
      queue.push({ name: name, minutes: minutes, bay: bay });
    } else {
      queue[found].minutes = queue[found].minutes + minutes;
    }

    statusLine.textContent = name + " added to " + bay + ".";
    nameBox.value = "";
    minsBox.value = "";
    showQueue();
  }

  function callNext() {
    var next = -1;

    for (var i = 0; i < queue.length; i++) {
      if (isFinite(queue[i].minutes) &&
          (next === -1 || queue[i].minutes >= queue[next].minutes)) {
        next = i;
      }
    }

    if (next === -1) {
      statusLine.textContent = "No one to call.";
      showQueue();
      return;
    }

    statusLine.textContent = "Called " + queue[next].name + " from " + queue[next].bay + ".";
    queue.splice(next, 1);
    showQueue();
  }

  minsBox.addEventListener("input", function () {
    minsBox.setCustomValidity("");
  });
  form.addEventListener("submit", addVisitor);
  call.addEventListener("click", callNext);
}
