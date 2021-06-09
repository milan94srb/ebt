const updateButton = document.querySelector('#update-button');
const minValueElement = document.querySelector('#pc-min-value');
const maxValueElement = document.querySelector('#pc-max-value');

let chartLabels = [];

for(let i=0; i<24; i++){
    chartLabels.push('');
}

var ctx = document.getElementById('pollution-chart').getContext('2d');
var pollutionChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: chartLabels,
        datasets: [
            {
                label: 'Received signal',
                data: [],
                borderColor: 'red',
                backgroundColor: 'red',
                spanGaps: true,
                pointRadius: 0
            },
        ]
    },
    options: {
        normalized: true,
        animation: false,
        maintainAspectRatio: false,
        scales: {
            x: {
                minRotation: 0,
                maxRotation: 0,
                ticks: {
                    sampleSize: 24
                }
            },
            y: {
                beginAtZero: true,
                max: 3.5,
                min: 0,
                steps: 7,
                stepValue: 0.5,
                ticks: {
                    sampleSize: 8
                }
            }
        }
    }
});

const getValue = () => {
    fetch(location.origin + '/get')
        .then((response) => {
            if(response.status == 503) {
                getValue();
            }
            else{
                response.json()
                    .then((data) => {
                        pollutionChart.data.datasets[0].data = data.CO2chartData;
                        pollutionChart.update();
            
                        minValueElement.textContent = data.minValue;
                        maxValueElement.textContent = data.maxValue;

                        getValue();
                    });
            }
        });
}

getValue();

updateButton.addEventListener('click', () => {
    fetch(location.origin + '/export')
        .then((response) => {
            response.json()
                .then((data) => {
                    var csv = 'Value,Time\n';
                    data.export.forEach((row) => {
                        csv += row.join(',');
                        csv += '\n';
                    });

                    var hiddenElement = document.createElement('a');
                    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
                    hiddenElement.target = '_blank';
                    hiddenElement.download = 'value.csv';
                    hiddenElement.click();
                });
        });
});
