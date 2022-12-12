
var dataVar = await fetch('../organisations.json')
.then((response) => response.json())
.then((data) => {
  return data.organisationApps.values
});

new Chart(
  document.getElementById('orgCanvas'),
  {
    type: 'line',
    options: {
      scales: {
        x: {
          // ticks: {
          //   callback: value => 
          //     `${new Date(dataVar[value].lastUpdatedAt).toLocaleDateString()}`
          // },
          type: 'time',
          min: (new Date(new Date().getTime() - 12096e5)),
          max: (new Date(new Date().getTime() + 8.64e7)),
        },
        y: {
          min: 0,
        }
      }
    },

    data: {
      labels: dataVar.map(row => row.lastUpdatedAt),
      datasets: [
        {
          label: 'Total Installed Apps',
          data: dataVar.map(row => row.total),
          borderColor: '#0000FF',
        },
        
      ]
    }
  }
);