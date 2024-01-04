const time = (id) => {
  const target = document.querySelector(id);
  let time = "AM";
  for (let i = 0; i < 2; i++) {
    let v = 6;
    if (i > 0) {
      v = 1;
      time = "PM";
    }
    for (let j = 0; j <= 6; j++, v++) {
      const option = document.createElement("option");
      option.value = v;
      option.text = v + " " + time;
      target.appendChild(option);
    }
  }
};

async function read() {
  const requestURL = "./jsons/year.json";
  const request = new Request(requestURL);
  const response = await fetch(request);
  const data = await response.json();

  return data;
}

async function populateSubjects() {
  const data = await read();
  console.log(data);
  let year;
  const subjectContainer = document.querySelector("#subject");
  const target = document.querySelector("#yearlevel");
  target.addEventListener("click", (e) => {
    subjectContainer.innerHTML = "";
    year = target.value;
    console.log(year);
    for (let i = 0; i < data[year].length; i++) {
      const option = document.createElement("option");
      option.value = data[year][i];
      option.text = data[year][i];
      subjectContainer.appendChild(option);
    }
  });
}

const fillSpace = (
  day,
  subject = null,
  start = null,
  end = null,
  block = null
) => {
  const btn = document.querySelector(".addSubject");
  const target = document.querySelectorAll(".time-" + day);

  let i = 1;
  target.forEach((e) => {
    if (e.textContent != "") {
      // fix a this condition kasi nagiging uneditable yung shits
      return;
    }
    e.textContent = subject;
    e.style.color = "red";
    // e.style.outline = "none";
    i++;
  });
};

const addSched = () => {
  const data = {}; // add yung data sa isang global variable
  const btn = document.querySelector(".addSubject");
  const day = document.querySelector("#day");
  const subject = document.querySelector("#subject");
  btn.addEventListener("click", (e) => {
    data["day"] = day.value;
    data["subject"] = subject.value;
    console.log(data);
    fillSpace(day.value, subject.value);
  });
};

(() => {
  time("#start");
  time("#end");
  read();
  populateSubjects();
  addSched();
})();
