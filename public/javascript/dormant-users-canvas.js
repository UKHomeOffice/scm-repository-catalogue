
var dataVar = await fetch('https://ukhomeoffice.github.io/scm-repository-catalogue/dormantusers.json')
.then((response) => response.json())
.then((data) => {
  return data.dormantUsers.values
});

new Chart(
  document.getElementById('duCanvas'),
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
          label: 'Collaborators',
          data: dataVar.map(row => row.collaborators),
          borderColor: '#FF6384',
        },
        {
          label: 'Outside Collaborators',
          data: dataVar.map(row => row.outsidecollaborators),
          borderColor: '#00FF00',
        },
        {
          label: 'Total Collaborators',
          data: dataVar.map(row => row.total),
          borderColor: '#0000FF',

        },
        
      ]
    }
  }
);