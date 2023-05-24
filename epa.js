import { parseEPA } from "./parseEPA.js";
let content = await readEPA();

const JSONrows = await parseEPA(content);

createDownloadLink();

//Distribution of HTTP methods graph
const countByMethod = _.countBy(JSONrows, "request.method");

const methodChart = document.getElementById("methodChart");

new Chart(methodChart, {
  type: "bar",
  data: {
    labels: Object.keys(countByMethod),
    datasets: [
      {
        data: Object.values(countByMethod),
      },
    ],
  },
  options: {
    plugins: {
      legend: { display: false },
    },
    title: {
      display: true,
      text: "Distribution of HTTP methods",
    },
  },
});

// Distribution of HTTP answer codes chart
const countByResponse = _.countBy(JSONrows, "response_code");

const codeChart = document.getElementById("codeChart");

new Chart(codeChart, {
  type: "pie",
  data: {
    labels: Object.keys(countByResponse),
    datasets: [
      {
        data: Object.values(countByResponse),
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Distribution of HTTP answer codes",
      },
    },
  },
});

// Distribution of the size of the answer of all requests with code 200 and size < 1000B

const filteredRows = JSONrows.filter(
  (row) => row.response_code === "200" && row.document_size < 1000
);

const countBySize = _.countBy(filteredRows, "document_size");

const sizeChart = document.getElementById("sizeChart");

new Chart(sizeChart, {
  type: "line",
  data: {
    labels: Object.keys(countBySize),
    datasets: [
      {
        label:
          "Distribution of the size of the answer of all requests with code 200 and size < 1000B",
        data: Object.values(countBySize),
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

// Requests per minute over the entire time span chart

const reqCountByMinute = _.countBy(JSONrows, ({ dateTime }) =>
  new Date(1995, 7, dateTime.day, dateTime.hour, dateTime.minute).toISOString()
);

const reqTimeChart = document.getElementById("reqTimeChart");

new Chart(reqTimeChart, {
  type: "line",
  data: {
    labels: Object.keys(reqCountByMinute),
    datasets: [
      {
        label: "Requests per minute over the entire time span",
        data: Object.values(reqCountByMinute),
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        type: "time",
      },
    },
  },
});

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
