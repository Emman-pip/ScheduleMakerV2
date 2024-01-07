const clearSched = () => {
  const row = document.querySelectorAll('[class^="time-"]');
  row.forEach((e) => {
    e.textContent = "";
  });
};

const changeTitle = (text) => {
  const target = document.querySelector(".name");
  target.textContent = text;
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
    updateRecords() {
      const data = JSON.parse(localStorage.getItem("folders"));
      if (data === null || Object.keys(data).length === 0) {
        return;
      }
      const target = document.querySelector(".blocks");
      target.innerHTML = "";
      Object.keys(data).forEach((e) => {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.width = "100%";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
        container.style.gap = "0.2rem";
        container.style.padding = "0.3rem";
        container.style.outline = "1px solid black";
        const newElement = document.createElement("div");
        newElement.classList.add("blockName");
        newElement.textContent = e;
        newElement.style.width = "100%";
        const btn = document.createElement("div");
        btn.textContent = "❌";
        btn.classList.add("deleteBlock");
        container.appendChild(newElement);
        container.appendChild(btn);
        target.appendChild(container);
        console.log("lol");
        btn.addEventListener("click", (ev) => {
          console.log("deleted: ", e);
          delete data[e];
          localStorage.setItem("folders", JSON.stringify(data));
          target.removeChild(container);
        });
      });
    },
    displayRecords() {
      const record = document.querySelectorAll(".blockName");
      const data = JSON.parse(localStorage.getItem("folders"));
      console.log(data);
      record.forEach((e) => {
        e.addEventListener("click", (ev) => {
          this.refreshData(data[e.textContent]);
          changeTitle(e.textContent);
        });
      });
    },
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
      let i = 0;
      const btn = document.querySelector(".addSubject");
      btn.addEventListener("click", (e) => {
        const day = document.querySelector("#day");
        const start = document.querySelector("#start");
        const end = document.querySelector("#end");
        const subject = document.querySelector("#subject");
        changeTitle("Enter new sched");
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
      this.gui.refreshData({});
      this.gui.read();
      this.gui.populateSubjects();
      this.gui.time("#start");
      this.gui.time("#end");
      this.gui.updateRecords();
      this.gui.displayRecords();
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
        console.log("localstg:", JSON.parse(localStorage.getItem("folders")));
        this.gui.refreshData(this.data);
        this.clearData();
        clearSched();
        this.gui.updateRecords();
        this.gui.displayRecords();
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
      this.folders = JSON.parse(localStorage.getItem("folders"));
      this.folders[blockname.value] = data;
      localStorage.setItem("folders", JSON.stringify(this.folders));
      blockname.value = "";
    },
  };
};

const blocksCompatibility = () => {};

(() => {
  const obj = tempStorage();
  obj.addSchedMethod();
  obj.init();
  obj.unifySched();
})();

// TODO:
// 1. organize gui -> try to add delete button for added blocks
// 2. logic for conflicts between schedules
// notes:
//   the function should do a string check to section name to know year level and compare each other
//   results should be organized in the following order: least conflict first
