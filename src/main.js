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
      option.value = v + time;
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

//

const actionPerformedPopulate = (target, data, subjectContainer) => {
  subjectContainer.innerHTML = "";
  let year = target.value;
  for (let i = 0; i < data[year].length; i++) {
    const option = document.createElement("option");
    option.value = data[year][i];
    option.text = data[year][i];
    subjectContainer.appendChild(option);
  }
};
async function populateSubjects() {
  const data = await read();
  // let year;
  const subjectContainer = await document.querySelector("#subject");
  const target = document.querySelector("#yearlevel");

  actionPerformedPopulate(target, data, subjectContainer);

  target.addEventListener("click", (e) => {
    actionPerformedPopulate(target, data, subjectContainer);
  });
}
// do the start end(will be -1)
// then do the storage struff
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
    // console.log("start:", start, "end", end);
    if (i >= start && i <= end - 1) {
      e.textContent = subject;
      e.style.color = "red";
      // e.style.outline = "none";
    }
    i++;
  });
};

const timeConverter = (time) => {
  "lol".length()(time.includes("AM"));
};

const addSched = () => {
  const data = {}; // add yung data sa isang global variable
  const btn = document.querySelector(".addSubject");
  const day = document.querySelector("#day");
  const start = document.querySelector("#start");
  const end = document.querySelector("#end");
  const subject = document.querySelector("#subject");
  btn.addEventListener("click", (e) => {
    data["day"] = day.value;
    data["subject"] = subject.value;
    data["start"] = start.value.includes("AM")
      ? start.value.substring(0, start.value.length - 2) - 5
      : parseInt(start.value.substring(0, start.value.length - 2)) + 7;
    data["end"] = end.value.includes("AM")
      ? parseInt(start.value.substring(0, end.value.length - 2)) - 5
      : parseInt(end.value.substring(0, end.value.length - 2)) + 7;

    console.log(data);
    fillSpace(day.value, subject.value, data["start"], data["end"]);
  });
};

(() => {
  time("#start");
  time("#end");
  read();
  addSched();
  populateSubjects();
})();
