import Chart from "chart.js";

var dataVar = await fetch('../dormantusers.json')
.then((response) => response.json())
.then((data) => {
    console.log(data)
    return data.values
});


let chart = new Chart(
    document.getElementById('duCanvas'),
    {
      type: 'line',
      data: {
        labels: dataVar.map(row => row.lastUpdatedAt),
        datasets: [
          {
            label: 'Collabs',
            data: dataVar.map(row => row.collaborators)
          }
        ]
      }
    }
);