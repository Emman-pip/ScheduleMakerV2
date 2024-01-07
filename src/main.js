const clearSched = () => {
  const row = document.querySelectorAll('[class^="time-"]');
  row.forEach((e) => {
    e.textContent = "";
  });
};

const DOMStuff = () => {
  // create a function to check if a data has a conflict in the empty storage
  const checkSubjectConflict = (obj, data) => {
    const keys = Object.values(obj);
    for (let i = 0; i < keys.length; i++) {
      if (
        keys[i]["day"] == data["day"] &&
        data["start"] >= keys[i]["start"] &&
        data["end"] <= keys[i]["end"]
      ) {
        console.log("conflict");
        alert(keys[i]["subject"] + " was replaced by " + data["subject"]);
        obj[i] = data;
        return false;
      }
    }
    return true;
  };
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
    // dapat dito ay mag derive ng display from temp object
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
    refreshData(obj) {
      const keys = Object.values(obj);
      // subhere
      clearSched();
      keys.forEach((e) => {
        try {
          this.fillSpace(e["day"], e["subject"], e["start"], e["end"]);
        } catch (err) {
          console.log(err);
        }
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

        const bool = checkSubjectConflict(object, data);
        console.log(bool);
        if (bool) {
          console.log("bool: true");
          object[i] = data;
          i++;
        }

        console.log(object);
        this.refreshData(object);

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
    localStr: StorageObj(),
    clearData() {
      for (var member in this.data) delete this.data[member];
    },
    addSchedMethod() {
      console.log(this.gui.addSched(this.data));
      console.log(this.data);
    },
    unifySched() {
      this.localStr.toLocalStorage();
      const btn = document.querySelector(".saveRecord");
      btn.addEventListener("click", () => {
        this.localStr.addBlockToFolder(this.data);
        console.log("localstg:", localStorage.getItem("folders"));
        this.gui.refreshData(this.data);
        // this.clearData();
        clearSched();
        this.clearData();
      });
    },
  };
};

const StorageObj = () => {
  return {
    folders: {},
    toLocalStorage() {
      if (localStorage.getItem("folders") === null) {
        localStorage.setItem("folders", JSON.stringify(this.folders));
        return;
      }
      this.folders = JSON.parse(localStorage.getItem("folders"));
      console.log(this.folders);
    },
    addBlockToFolder(data) {
      const blockname = document.querySelector(".className");
      if (blockname.value.includes(" ") || blockname.value === "") {
        alert("Please remove the space on the block name.");
        return;
      }
      this.folders[blockname.value] = data;
      localStorage.setItem("folders", JSON.stringify(this.folders));
      blockname.value = "";
    },
  };
};

(() => {
  const obj = tempStorage();
  obj.addSchedMethod();
  obj.init();
  obj.unifySched();
  // to.toLocalStorage();
  // console.log("etoh ba: ", to.folders);
})();

// TODO: display records saved blocks
