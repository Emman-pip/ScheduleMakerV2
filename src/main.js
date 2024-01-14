const primaryColor = "#faf8ff";
const purpleLight = "#948aca";

const clearSched = () => {
  const row = document.querySelectorAll('[class^="time-"]');
  row.forEach((e) => {
    e.style.backgroundColor = primaryColor;
    // e.style.color = "white";
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
    let bool = true;
    const keys = Object.values(obj);
    for (let i = 0; i < keys.length; i++) {
      if (data["day"] != keys[i]["day"]) {
        continue;
      }
      if (
        // keys[i]["day"] == data["day"] &&
        (data["start"] <= keys[i]["start"] &&
          data["end"] - 1 >= keys[i]["start"] + 1) ||
        (keys[i]["start"] <= data["start"] &&
          keys[i]["end"] - 1 >= data["start"]) ||
        (data["start"] <= keys[i]["start"] && data["end"] > keys[i]["start"]) ||
        (keys[i]["start"] <= data["start"] &&
          keys[i]["end"] - 1 >= data["start"])
      ) {
        console.log("conflict");
        alert(keys[i]["subject"] + " was replaced by " + data["subject"]);
        obj[Object.keys(obj)[i]] = data;
        bool = false;
      }
    }
    return bool;
  };
  return {
    // FIX BUG WHERE SHIT BECOMES RED PAG MAY NAGCCONFLICT;
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
        container.style.border = "1px solid black";
        container.classList.add("recordsContainer");
        target.style.paddingRight = "0.5rem";
        const newElement = document.createElement("div");
        newElement.classList.add("blockName");
        newElement.textContent = e;
        newElement.style.width = "100%";

        const editBtn = document.createElement("div");
        editBtn.textContent = "Add";
        editBtn.style.textAlign = "center";
        editBtn.classList.add("editBtn");

        const btn = document.createElement("div");
        btn.textContent = "❌";
        btn.classList.add("deleteBlock");
        container.appendChild(newElement);
        container.appendChild(editBtn);
        container.appendChild(btn);
        target.appendChild(container);
        console.log("lol");
        btn.addEventListener("click", (ev) => {
          console.log("deleted: ", e);
          delete data[e];
          localStorage.setItem("folders", JSON.stringify(data));
          target.removeChild(container);
        });

        // TODO: HERE
        editBtn.addEventListener("click", () => {
          const data = JSON.parse(localStorage.getItem("folders"));
          let i =
            parseInt(
              Object.keys(data[newElement.textContent])[
                Object.keys(data[newElement.textContent]).length - 1
              ]
            ) + 1;
          const subjData = {};
          console.log("i", i);
          subjData["day"] = document.querySelector("#day").value;
          subjData["subject"] = document.querySelector("#subject").value;
          const start = document.querySelector("#start");
          const end = document.querySelector("#end");
          const endValue = end.value.includes("AM")
            ? parseInt(end.value.substring(0, end.value.length - 2)) - 5
            : parseInt(end.value.substring(0, end.value.length - 2)) + 7;
          const startValue = start.value.includes("AM")
            ? start.value.substring(0, start.value.length - 2) - 5
            : parseInt(start.value.substring(0, start.value.length - 2)) + 7;

          subjData["start"] = startValue;
          subjData["end"] = endValue;
          let bool = checkSubjectConflict(
            data[newElement.textContent],
            subjData
          );
          if (!bool) {
            console.log("conflict");
            localStorage.setItem("folders", JSON.stringify(data));
            this.refreshData(data[newElement.textContent]);
            this.displayRecords();
            return;
          }
          data[newElement.textContent][i] = subjData;
          localStorage.setItem("folders", JSON.stringify(data));
          this.refreshData(
            JSON.parse(localStorage.getItem("folders"))[newElement.textContent]
          );
          this.displayRecords();
        });
      });
    },
    displayRecords() {
      const record = document.querySelectorAll(".blockName");
      record.forEach((e) => {
        const newRecordBtn = e.cloneNode(true);
        e.parentElement.replaceChild(newRecordBtn, e);
        const data = JSON.parse(localStorage.getItem("folders"));
        newRecordBtn.addEventListener("click", (ev) => {
          this.refreshData(data[newRecordBtn.textContent]);
          changeTitle(newRecordBtn.textContent);
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
      // const btn = document.querySelector(".addSubject");
      const target = document.querySelectorAll(".time-" + day);

      let i = 1;
      target.forEach((e) => {
        // console.log("start:", start, "end", end);
        if (i >= start && i <= end - 1) {
          e.style.color = "red";
          if (e.textContent !== "") {
            e.style.backgroundColor = "red";
            e.style.color = "white";
          }
          if (e.textContent !== subject && e.textContent !== "") {
            e.textContent = e.textContent + ", " + subject;
          }
          if (e.textContent === "") {
            e.textContent = subject;
          }
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
      this.clearTable();
      this.undo();
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
    clearTable() {
      document.querySelector(".clearSubjects").addEventListener("click", () => {
        this.clearData();
        clearSched();
      });
    },
    undo() {
      document.querySelector(".undo").addEventListener("click", () => {
        delete this.data[
          Object.keys(this.data)[Object.keys(this.data).length - 1]
        ];
        this.gui.refreshData(this.data);
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

// user will choose between 2 blocks and the program will run like a biatch
const blocksCompatibility = (num1, num2) => {
  // this function will be used by an even listener. the parameters will come from the analyze scheds section
  const data = JSON.parse(localStorage.getItem("folders"));
  const keys = Object.keys(data);
  const first = [];
  const second = [];
  const third = [];
  const fourth = [];
  const levels = [first, second, third, fourth];
  // push to corresponding year level
  keys.forEach((e) => {
    if (e[0] == num1 || e[0] == num2) levels[parseInt(e[0]) - 1].push(e);
  });

  // console.log(data);
  // storage for conflicted data here.
  const blockCombinations = {};
  for (let i = 0; i < levels[parseInt(num1) - 1].length; i++) {
    const blockData = data[levels[parseInt(num1) - 1][i]];
    for (let v = 0; v < Object.keys(blockData).length; v++) {
      for (let j = 0; j < levels[parseInt(num2) - 1].length; j++) {
        const blockData2 = data[levels[parseInt(num2) - 1][j]];
        if (
          blockCombinations[
            levels[parseInt(num1) - 1][i] + "+" + levels[parseInt(num2) - 1][j]
          ] === undefined
        ) {
          blockCombinations[
            levels[parseInt(num1) - 1][i] + "+" + levels[parseInt(num2) - 1][j]
          ] = [];
        }
        for (let k = 0; k < Object.keys(blockData2).length; k++) {
          if (
            blockData[Object.keys(blockData)[v]]["day"] !=
            blockData2[Object.keys(blockData2)[k]]["day"]
          ) {
            continue;
          }
          const blockData1Shortened = blockData[Object.keys(blockData)[v]];
          const blockData2Shortened = blockData2[Object.keys(blockData2)[k]];
          if (
            (blockData1Shortened["start"] <= blockData2Shortened["start"] &&
              blockData1Shortened["end"] - 1 >=
                blockData2Shortened["start"] + 1) ||
            (blockData2Shortened["start"] <= blockData1Shortened["start"] &&
              blockData2Shortened["end"] - 1 >= blockData1Shortened["start"]) ||
            (blockData1Shortened["start"] <= blockData2Shortened["start"] &&
              blockData1Shortened["end"] > blockData2Shortened["start"]) ||
            (blockData2Shortened["start"] <= blockData1Shortened["start"] &&
              blockData2Shortened["end"] > blockData1Shortened["start"])
          ) {
            blockCombinations[
              levels[parseInt(num1) - 1][i] +
                "+" +
                levels[parseInt(num2) - 1][j]
            ].push([
              blockData[Object.keys(blockData)[v]]["subject"],
              blockData2[Object.keys(blockData2)[k]]["subject"],
            ]);
          }
        }
      }
    }
  }
  return blockCombinations;
};

const resultsGUI = (data) => {
  const generateNewSchedule = (data1, data2) => {
    const storageData = JSON.parse(localStorage.getItem("folders"));
    const block1 = storageData[data1];
    const block2 = storageData[data2];
    const data1Keys = Object.keys(block1);
    const data2Keys = Object.keys(block2);
    clearSched();
    for (let i = 0; i < data1Keys.length; i++) {
      console.log(storageData);
      console.log("HEREE: ", block1[data1Keys[0]]);
      DOMStuff().fillSpace(
        block1[data1Keys[i]]["day"],
        block1[data1Keys[i]]["subject"],
        block1[data1Keys[i]]["start"],
        block1[data1Keys[i]]["end"]
      );
      console.log("KEETTSS: ", Object.keys(data1)[i]);
    }

    for (let i = 0; i < data2Keys.length; i++) {
      console.log(storageData);
      // console.log("HEREE: ", block2[data2Keys[0]]);
      DOMStuff().fillSpace(
        block2[data2Keys[i]]["day"],
        block2[data2Keys[i]]["subject"],
        block2[data2Keys[i]]["start"],
        block2[data2Keys[i]]["end"]
      );
      // console.log("KEETTSS: ", Object.keys(data1)[i]);
    }
  };
  const target = document.querySelector(".results");
  target.innerHTML = "";
  const keys = Object.keys(data);
  const table = document.createElement("table");
  const headRow = document.createElement("tr");
  table.appendChild(headRow);
  const headers = ["Combination", "Number of conflicts", "conflicts"];
  for (let i = 0; i < headers.length; i++) {
    const th = document.createElement("th");
    th.textContent = headers[i];
    headRow.appendChild(th);
  }
  keys.forEach((item) => {
    const tr = document.createElement("tr");

    let color = primaryColor;
    if (data[item].length === 0) {
      color = purpleLight;
    }
    const combinationName = document.createElement("td");

    combinationName.textContent = item;
    const numberOfConflicts = document.createElement("td");
    numberOfConflicts.textContent = data[item].length;
    numberOfConflicts.style.backgroundColor = color;
    const conflicts = document.createElement("td");
    const list = document.createElement("ul");
    list.style.listStylePosition = "inside";
    conflicts.appendChild(list);

    for (let i = 0; i < Object.keys(data[item]).length; i++) {
      const listItem = document.createElement("li");
      listItem.textContent = data[item][i][0] + " and " + data[item][i][1];
      list.appendChild(listItem);
    }

    const btnSeeSched = document.createElement("div");
    btnSeeSched.textContent = "See schedule";
    btnSeeSched.classList.add("btnSeeSched");
    btnSeeSched.addEventListener("click", (e) => {
      const data = JSON.parse(localStorage.getItem("folders"));
      // console.log("item: ", data[item.split("+")[0]]);
      generateNewSchedule(item.split("+")[0], item.split("+")[1]);
      changeTitle(item);
      window.scrollTo(null, 0);
      // generateNewSchedule()
    });
    conflicts.appendChild(btnSeeSched);

    tr.appendChild(combinationName);
    tr.appendChild(numberOfConflicts);
    tr.appendChild(conflicts);
    table.appendChild(tr);
  });
  target.appendChild(table);
};

const analyzeData = () => {
  const btn = document.querySelector(".analyzeBtn");
  btn.addEventListener("click", (e) => {
    const level1 = document.getElementById("levels1");
    const level2 = document.getElementById("levels2");
    const data = blocksCompatibility(level1.value, level2.value);
    console.log(data);
    resultsGUI(data);
  });
};

const clickOnHead = () => {
  document.querySelector(".github").addEventListener("click", () => {
    window.open("https://github.com/Emman-pip");
  });
};

(() => {
  const obj = tempStorage();
  obj.addSchedMethod();
  obj.init();
  obj.unifySched();
  analyzeData();
  clickOnHead();
})();

// TODO:
// 2. add a clear button
