import { getHistogram, getAverageByPriority, getTotalTimeSpentByDifficulty, getFinishedTasksByTime } from "./connectionBackend.js";

const formSubmit = document.getElementById("form-chart"); 
const selectChart = document.getElementById("select-chart");
const chart = document.getElementById("myChart");
let myChart;
let numberTasksByDifficult;
let averageTasksByPriority;
let timeSpentByDifficult;
let finishedTasksByTime;

formSubmit.addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = event.target; 
    const formData = new FormData(form);
    let chartSelected = formData.get('selected-chart');

    if(myChart != undefined) myChart.destroy();

    if(chartSelected === 'Tareas por dificultad'){
        createChartTasksByDifficult();
    }else if(chartSelected === 'Tareas por prioridad'){
        createChartTasksByPriority();
    }else if(chartSelected === 'Tiempo total tareas'){
        createChartTimeSpentByTasksDifficult();
    }else if(chartSelected === 'Tareas finalizadas por tiempo'){
        createChartFinishedTasksByTime();
    }
});

async function createChartTasksByDifficult(){
    if(numberTasksByDifficult === undefined) {
        numberTasksByDifficult = await getHistogram();
    }
    let labels = [];
    let dataHistogram = [];
    Object.keys(numberTasksByDifficult).forEach(key => {
        labels.push(key);
        dataHistogram.push(numberTasksByDifficult[key]);
    });
    const data = {
        labels: labels,
        datasets: [{
            label: 'Tareas por Dificultad',
            data: dataHistogram,
            backgroundColor:[
                'rgba(239, 236, 20, 0.2)',
                'rgba(40, 85, 236, 0.2)',
                'rgba(223, 48, 48, 0.2)',
            ],
            borderWidth: 1
        }]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,        
                        text: 'Dificultad', 
                        font: {
                            size: 16           
                        }
                    }
                },
                y: {
                    title: {
                        display: true,        // Mostrar etiqueta del eje Y
                        text: 'Número de Tareas', // Texto para el eje Y
                        font: {
                            size: 16           // Tamaño de la fuente del texto
                        }
                    },
                    beginAtZero: true          // Empezar desde 0 en el eje Y
                }
            } // Permitir más flexibilidad en las proporciones
        }
    }
    myChart = new Chart(chart, config);
}

//Crea un gráfico del promedio de las tareas por su prioridad basado en la dificultad
async function createChartTasksByPriority(){
    if(averageTasksByPriority === undefined){
        averageTasksByPriority = await getAverageByPriority();
    }
    let labels = [];
    let dataPriority = [];

    Object.keys(averageTasksByPriority).forEach(key => {
        labels.push(key);
        dataPriority.push(Math.ceil(averageTasksByPriority[key]));
    });

    const data = {
        labels: labels,
        datasets: [{
            label: 'Promedio Tareas por Prioridad',
            data: dataPriority,
            backgroundColor:[
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderWidth: 1
        }]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,        
                        text: 'Prioridad', 
                        font: {
                            size: 16           
                        }
                    }
                },
                y: {
                    title: {
                        display: true,        // Mostrar etiqueta del eje Y
                        text: 'Número de Tareas Promedio', // Texto para el eje Y
                        font: {
                            size: 16           // Tamaño de la fuente del texto
                        }
                    },
                    beginAtZero: true          // Empezar desde 0 en el eje Y
                }
            } // Permitir más flexibilidad en las proporciones
        }
    };
    myChart = new Chart(chart, config);
}

async function createChartTimeSpentByTasksDifficult(){
    if(timeSpentByDifficult === undefined){
        timeSpentByDifficult = await getTotalTimeSpentByDifficulty();
    }
    let labels = [];
    let dataTime = [];

    Object.keys(timeSpentByDifficult).forEach(key => {
        labels.push(key);
        dataTime.push(timeSpentByDifficult[key]);
    });

    const data = {
        labels: labels,
        datasets: [{
          label: 'Tiempo total invertido por tareas realizadas',
          data: dataTime,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4,
          borderWidth: 1
        }]
      };
    const config = {
        type: 'pie',
        data: data,
        options: { 
            maintainAspectRatio: false,
        }
    }
    myChart = new Chart(chart, config);
}

async function createChartFinishedTasksByTime(){
    if(finishedTasksByTime === undefined){
        finishedTasksByTime = await getFinishedTasksByTime();
    }
    let labels = [];
    let dataTime = [];

    Object.keys(finishedTasksByTime).forEach(key => {
        labels.push(key);
        dataTime.push(finishedTasksByTime[key]);
    });

    const data = {
        labels: labels,
        datasets: [{
          label: 'Tareas Finalizadas por Tiempo',
          data: dataTime,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
    const config = {
        type: 'line',
        data: data,
        options:{
            scales: {
                x: {
                    title: {
                        display: true,        
                        text: 'Tiempo(horas)', 
                        font: {
                            size: 16           
                        }
                    }
                },
                y: {
                    title: {
                        display: true,        // Mostrar etiqueta del eje Y
                        text: 'Número de Tareas', // Texto para el eje Y
                        font: {
                            size: 16           // Tamaño de la fuente del texto
                        }
                    }          
                }
            }
        } 
      };
    myChart = new Chart(chart, config);
}
