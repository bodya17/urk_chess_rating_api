function renderChart(data) {
    Highcharts.mapChart('container', {
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

fetch('/national-masters')
    .then(res => res.json())
    .then(renderChart)