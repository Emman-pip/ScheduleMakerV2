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

time("#start");
time("#end");
read();
populateSubjects();
