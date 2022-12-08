
var dataVar = await fetch('https://ukhomeoffice.github.io/scm-repository-catalogue/enterprise.json')
.then((response) => response.json())
.then((data) => {
  return data.licence.values
});

new Chart(
  document.getElementById('lCanvas'),
  {
    type: 'line',
    options: {
      scales: {
        x: {
          ticks: {
            callback: value => 
              `${new Date(dataVar[value].lastUpdatedAt).toLocaleDateString()}`
          }
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
          label: 'Available',
          data: dataVar.map(row => row.available),
          borderColor: '#FF6384',
        },
        {
          label: 'Used',
          data: dataVar.map(row => row.used),
          borderColor: '#00FF00',
        },
        {
          label: 'Total',
          data: dataVar.map(row => row.total),
          borderColor: '#0000FF',

        },
        
      ]
    }
  }
);