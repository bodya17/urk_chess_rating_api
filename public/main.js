function renderChart(data, containerID) {
    Highcharts.mapChart(containerID, {
        chart: {
            map: 'countries/ua/ua-all'
        },

        title: {
            text: 'Ratings'
        },

        subtitle: {
            text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ua/ua-all.js">Ukraine</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data: data,
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

}


function renderAge(cats, data, container) {
        var options = {
            chart: {
                renderTo: container,
                type: 'column'
            },
            title: {
                text: 'Player count by age'
            },
            xAxis: {
                categories: cats
            },
            yAxis: {
                title: {
                    text: 'number of players'
                }
            },
            series: [{
                data
            }]
        };

    var chart = new Highcharts.Chart(options);
}

// fetch('/ratings/кмс')
//     .then(res => res.json())
//     .then((players) => renderChart(players, 'container'))

// fetch('/ratings/1')
//     .then(res => res.json())
//     .then((players) => renderChart(players, 'container1'))

// fetch('/age')
//     .then(res => res.json())
//     .then((players) => {
//         const cats = players.map(p => p._id);
//         const counts = players.map(p => p.count);
//         renderAge(cats, counts, 'container25');
//     })

// fetch('/age-average-rating')
//     .then(res => res.json())
//     .then((players) => {
//         const cats = players.map(p => p._id);
//         const counts = players.map(p => p.rating);
//         renderAge(cats, counts, 'container');
// })

function renderlist(data, container) {
    // let html = '';
}

// fetch('/average-rating-by-fed')
//     .then(res => res.json())
//     .then((players) => {
//         console.log(players)
//         renderChart(players, 'container');
// })

fetch('/sort')
    .then(res => res.json())
    .then((players) => {
        let html = '<table>';
        players.forEach((p, i) => {
            html += `<tr>
                        <td>${i}</td>
                        <td>${p.lastName}</td>
                        <td>${p.ukrRating}</td>
                    </tr>`
        })
        html += '</table>'
        document.body.innerHTML = html;

    })
