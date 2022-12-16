var dataVar = await fetch('../organisations.json')
    .then((response) => response.json())
    .then((data) => {
        const orgData = _.groupBy(data.organisationApps.values, o =>  o.organisation);
        //const groupedData = _.groupBy(data.organisationApps.values[data.organisationApps.values.length - 1].installedApps, yr => new Date(yr.installedAt).getUTCFullYear());
        return orgData;
    });
//console.log(JSON.stringify(dataVar));

const COLORS = {
    'greenkeeper': '#4dc9f6',
    'slack': '#f67019',
    'wip': '#f53794',
    'travis-ci': '#537bc4',
    'signed-commit-checker-beta': '#acc236',
    'everyone-app': '#166a8f',
    'travis-ci': '#00a950',
    'railway-app': '#58595b',
    'render': '#8549ba',
    'scm-reporting-app': 'blue'
};

for (var org of Object.keys(dataVar)) {
    const appsData = _.groupBy(dataVar[org][dataVar[org].length -1].installedApps, yr => new Date(yr.installedAt).getUTCFullYear());
new Chart(
    document.getElementById('orgCanvas_'+org), {
        type: 'bar',
        options: {
            plugins: {
                aspectRatio: 1,
                legend:{
                    display: true,
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: dataVar[org][0].organisation
                },
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        },
        data: {

            datasets: Object.keys(appsData).flatMap(year => {
                return appsData[year].map((app, idx) => ({

                    label: app.app,
                    data: {
                        [year]: 1
                    },
                    backgroundColor: COLORS[app.app]
                }))
            })
        }
    });
}