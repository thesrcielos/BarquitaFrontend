import React, { useEffect, useRef, useState} from 'react';
import {
    getHistogram,
    getAverageByPriority,
    getTotalTimeSpentByDifficulty,
    getFinishedTasksByTime,
    getHistogramAllUsers,
    getAverageByPriorityAllUsers,
    getFinishedTasksByTimeAllUsers,
    getTotalTimeSpentByDifficultyAllUsers
} from './connectionBackend.js'
import './insights.css'
import { 
    Chart, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    LineElement, 
    PointElement,
    ArcElement, 
    PieController, 
    LineController,
    BarController,
    Title, 
    Tooltip, 
    Legend
} from 'chart.js';
import { useAuth } from './AuthenticationContext.js';
import LoadingPage from './loadingPage.js';


// Registra todos los componentes que se van a usar
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, PieController, LineController, BarController, Title, Tooltip, Legend);

var numberTasksByDifficult;
var averageTasksByPriority;
var timeSpentByDifficult;
var finishedTasksByTime;

const Insights = () =>{
    const [myChart, setMyChart] = useState(null);
    const chart = useRef(null);
    const[selectChart, setSelectChart] = useState('');
    const{ getUserInfo} = useAuth();
    const[loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            let userInfo = getUserInfo();
            const userId = userInfo.usernameId;
            const role = userInfo.role;
            if(role === 'ADMIN'){
                numberTasksByDifficult = await  getHistogramAllUsers();
                averageTasksByPriority = await getAverageByPriorityAllUsers();
                timeSpentByDifficult = await getTotalTimeSpentByDifficultyAllUsers();
                finishedTasksByTime = await getFinishedTasksByTimeAllUsers();
            }else if(role === 'USER'){
                numberTasksByDifficult = await  getHistogram(userId);
                averageTasksByPriority = await getAverageByPriority(userId);
                timeSpentByDifficult = await getTotalTimeSpentByDifficulty(userId);
                finishedTasksByTime = await getFinishedTasksByTime(userId);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }finally{
            setLoading(false);
          }
        };
      
        fetchData();
      }, [getUserInfo]);


    const drawChart = (e) =>{
        e.preventDefault();
        if(myChart !== null){ 
            myChart.destroy();
        };
        if(selectChart === 'Tareas por dificultad'){
            createChartTasksByDifficult();
        }else if(selectChart === 'Tareas por prioridad'){
            createChartTasksByPriority();
        }else if(selectChart === 'Tiempo total tareas'){
            createChartTimeSpentByTasksDifficult();
        }else if(selectChart === 'Tareas finalizadas por tiempo'){
            createChartFinishedTasksByTime();
        }
    }

    const handleChange = (e) => {
        let selectedOption = e.target.value;
        setSelectChart(selectedOption);
    }

    const createChartTasksByDifficult = ()=>{
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
        setMyChart(new Chart(chart.current, config));
    }
    
    //Crea un gráfico del promedio de las tareas por su prioridad basado en la dificultad
    const createChartTasksByPriority = () => {
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
        setMyChart(new Chart(chart.current, config));
    }
    
    const createChartTimeSpentByTasksDifficult = ()=>{
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
        setMyChart(new Chart(chart.current, config));
    }
    
    const createChartFinishedTasksByTime = () => {
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
        
        setMyChart(new Chart(chart.current, config));
    }

    return loading ? <LoadingPage/>: (
        <div>
            <div className="container-chart-choose">
            <form id="form-chart" onSubmit={drawChart}>
            <select name="selected-chart" id="select-chart" value={selectChart} 
            onChange={handleChange} required>
                <option value="" disabled>Seleccionar</option>
                <option value="Tareas por dificultad"> Tareas por dificultad</option>
                <option value="Tareas finalizadas por tiempo">Tareas finalizadas por tiempo</option>
                <option value="Tiempo total tareas">Tiempo total por tareas realizadas.</option>
                <option value="Tareas por prioridad">Promedio tareas por prioridad</option>
            </select>
            <input type="submit" className="generate-button" value="Generar"/>
            </form>
        </div>
        <div>
            <canvas id="myChart" ref={chart}></canvas>
        </div>
      </div>
    );
}

export default Insights;

