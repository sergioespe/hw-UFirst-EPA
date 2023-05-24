import { parseEPA } from "./parseEPA.js";
let content = await readEPA();

const JSONrows = await parseEPA(content);

createDownloadLink();

const { getNum, postNum, headNum } = HTTPMethodNumber();
// const { get200,  }
console.log("GET: " + getNum + " , POST: " + postNum + " , HEAD: " + headNum);

const methodChart = document.getElementById("methodChart");
const codeChart = document.getElementById("codeChart");

const methodObject = [
  { label: "GET", count: getNum },
  { label: "POST", count: postNum },
  { label: "HEAD", count: headNum },
];

//const codeObject = [
//   { label: "200", count: get200 },
//   { label: "200", count: get200 }
//]

new Chart(methodChart, {
  type: "bar",
  data: {
    labels: methodObject.map((row) => row.label),
    datasets: [
      {
        label: "Distribution of HTTP Methods",
        data: methodObject.map((row) => row.count),
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

function HTTPMethodNumber() {
  let getNum = 0;
  let postNum = 0;
  let headNum = 0;
  JSONrows.map((row) => {
    if (row.request.method === "GET") getNum++;
    if (row.request.method === "POST") postNum++;
    if (row.request.method === "HEAD") headNum++;
  });

  return {
    getNum,
    postNum,
    headNum,
  };
}

function HTTPCodesNumber() {
  JSONrows.map((row) => {
    if (row.response_code === "200") getNum++;
    if (row.response_code === "302") postNum++;
    if (row.response_code === "404") headNum++;
  });
}

async function readEPA() {
  const file = "./epa-http.txt";
  let response = await fetch(file);

  try {
    if (response.ok) {
      var content = await response.text(); // File content
      return content;
    } else {
      throw new Error("Error reading file. Status code " + response.status);
    }
  } catch (error) {
    console.error("Error reading file:", error); // Handle the error
  }
}

function createDownloadLink() {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(JSONrows));
  const dlAnchorElem = document.getElementById("downloadLink");
  dlAnchorElem.setAttribute("href", dataStr);
}
