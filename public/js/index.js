const updateButton = document.querySelector('#update-button');
const minValueElement = document.querySelector('#pc-min-value');
const maxValueElement = document.querySelector('#pc-max-value');

const currentDate = new Date();
let currentHour = currentDate.getHours();

let chartLabels = [];

for(let i=0; i<24; i++){
    if(currentHour < 0){ currentHour = 23 };
    // chartLabels.push(currentHour.toLocaleString('en-US', { minimumIntegerDigits: 2 }) + 'h');
    chartLabels.push('');
    currentHour--;
}

chartLabels = chartLabels.reverse();

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
                backgroundColor: 'red'
            },
        ]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 3.5,
                steps: 7,
                stepValue: 0.5
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
