const DOMStuff = () => {
  return {
    time(id) {
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
    },

    async read() {
      const requestURL = "./jsons/year.json";
      const request = new Request(requestURL);
      const response = await fetch(request);
      const data = await response.json();

      return data;
    },

    //

    actionPerformedPopulate(target, data, subjectContainer) {
      subjectContainer.innerHTML = "";
      let year = target.value;
      for (let i = 0; i < data[year].length; i++) {
        const option = document.createElement("option");
        option.value = data[year][i];
        option.text = data[year][i];
        subjectContainer.appendChild(option);
      }
    },
    async populateSubjects() {
      const data = await this.read();
      // let year;
      const subjectContainer = await document.querySelector("#subject");
      const target = document.querySelector("#yearlevel");

      this.actionPerformedPopulate(target, data, subjectContainer);

      target.addEventListener("click", (e) => {
        this.actionPerformedPopulate(target, data, subjectContainer);
      });
    },
    // do the start end(will be -1)
    // then do the storage struff
    fillSpace(day, subject = null, start = null, end = null, block = null) {
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
    },

    addSched(object) {
      const btn = document.querySelector(".addSubject");
      const day = document.querySelector("#day");
      const start = document.querySelector("#start");
      const end = document.querySelector("#end");
      const subject = document.querySelector("#subject");
      let i = 0;
      btn.addEventListener("click", (e) => {
        let data = {}; // add yung data sa isang global variable
        const endValue = end.value.includes("AM")
          ? parseInt(end.value.substring(0, end.value.length - 2)) - 5
          : parseInt(end.value.substring(0, end.value.length - 2)) + 7;
        const startValue = start.value.includes("AM")
          ? start.value.substring(0, start.value.length - 2) - 5
          : parseInt(start.value.substring(0, start.value.length - 2)) + 7;

        if (endValue - startValue <= 0) {
          console.log(startValue - endValue);
          return false;
        }

        data["day"] = day.value;
        data["subject"] = subject.value;
        data["start"] = startValue;
        data["end"] = endValue;
        object[i] = data;
        console.log(object);
        i++;
        // console.log(data);
        this.fillSpace(day.value, subject.value, data["start"], data["end"]);
        return true;
      });
    },
  };
};

const tempStorage = () => {
  return {
    gui: DOMStuff(),
    init() {
      this.gui.read();
      this.gui.populateSubjects();
      this.gui.time("#start");
      this.gui.time("#end");
    },
    data: {},

    addSchedMethod() {
      console.log(this.gui.addSched(this.data));
      console.log(this.data);
    },
  };
};

(() => {
  const obj = tempStorage();
  obj.addSchedMethod();
  obj.init();
})();
