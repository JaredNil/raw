const axios = require('axios');

// Получение текущей директории относительной общей папки работы всего приложения
let resourcesPath = __dirname.split('\\');
// resourcesPath.pop(); resourcesPath.pop(); 
resourcesPath.pop();resourcesPath.pop(); resourcesPath = resourcesPath.join('\\');

// Объявление функции запуска Python Script'a
// Обязательно должна получить данные из инпутов
// let pathPythonInit = `${__dirname}\\bin\\init.py`
let pathPythonInit = `${resourcesPath}\\TrackerVT\\tracker`
let pythonFile = `server.py`
let pathPythonEntry = `${resourcesPath}\\TrackerVT\\venv\\Scripts`
console.log(pathPythonInit)
// инпуты
const inputStream = document.querySelectorAll('.inputStream-item')[0]
const inputFile = document.querySelectorAll('.inputFile-item')[0]

// Отслеживание пути до файла
let inputFileData
const onChangeFile = (event) => {
    const files = event.target.files;
    inputFileData = files[0].path
}
inputFile.addEventListener('change', onChangeFile)


// Объявление функции запуска Python скриптов
// Глобальная переменная, сохраняющая в себе текущий поток выполнения Python скрипта
function sendToPython(type, pathCapture) {
    console.log('sendToPython is running')
    if(type ==='stream') pathCapture = inputStream.value
    else if (type === 'file') {
        pathCapture = inputFileData
            .split('').map(l => {return (l=='\\') ? l = '/' : l}).join('')
    }

    controller = new AbortController();
    var { signal } = controller;

    // var python = require('child_process').spawn('python', [pathPythonInit, pathCapture], {signal});
    var python = require('child_process').exec(`cd ${pathPythonEntry} && activate && cd ${pathPythonInit} && python ${pythonFile}`, {signal})

    python.stdout.on('data', function (data) { console.log("Python response: ", data.toString('utf8')) });

    python.stderr.on('data', (data) => console.warn(`stderr: ${data}`));

    python.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
    
    axios.get("http:\\localhost:2020\\init")

}

// Обновление canvas
var image = document.getElementById('video_localhost');

async function refresh() {
    image.src = ("http:\\localhost:2020\\image?" + new Date().getTime());
}


// СЛУШАТЕЛИ СОБЫТИЙ ПО КЛИКУ

// slice
const introSlice = document.querySelectorAll('.intro')[0]
const videoSlice = document.querySelectorAll('.video')[0]
const loaderSlice = document.querySelectorAll('.loaderSlice')[0]
const generalLoaderSlice = document.querySelectorAll('.generalLoader')[0]


// кнопки
const buttonLogo = document.querySelectorAll('.header__clicker')[0]
const buttonStream = document.querySelectorAll('.inputStream-button')[0]
const buttonFile = document.querySelectorAll('.inputFile-button')[0]
const buttonVideoBack = document.querySelectorAll('.video__back')[0]
// подпись анализа
const analyseType = document.querySelectorAll('.video__type')[0]
const analyseTitle = document.querySelectorAll('.video__title')[0]


// Интервал
let interval

var controller

// Пингуем питоновский файл, выключаем генеральный лоадер, подгружаем начальный интерфейс
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        generalLoaderSlice.classList.add('_hidden')
        introSlice.classList.remove('_hidden')
    }, 0);
})


// Переключение на окно Stream
buttonStream.addEventListener('click', () => {
    if (inputStream.value == 0) {
        buttonStream.textContent = 'Попробуйте снова. Запуск анализа'
    } else {
        sendToPython('stream')
        // interval = setInterval(() => {
        //     refresh()
        // }, 30);
        analyseType.textContent = 'Анализ в реальном времени'
        buttonStream.textContent = 'Запуск анализа'
        analyseTitle.textContent = inputStream.value.split(`\\`).at(-1)
        introSlice.classList.add('_hidden')
        loaderSlice.classList.add('_hidden')
        videoSlice.classList.remove('_hidden')
    }
})

// Переключение на окно Video
buttonFile.addEventListener('click', () => {
    console.log('buttonFile')
    if (inputFile.files[0] !== undefined) {
        sendToPython('file')
        // interval = setInterval(() => {
        //     refresh()
        // }, 30);
        analyseType.textContent = 'Анализ видеофайла'
        buttonStream.textContent = 'Запуск анализа'
        analyseTitle.textContent = inputFileData.split(`\\`).at(-1)
        introSlice.classList.add('_hidden')
        loaderSlice.classList.add('_hidden')
        videoSlice.classList.remove('_hidden')
    } else {
        buttonFile.textContent = 'Попробуйте снова. Запуск анализа'
    }
})

// На стартовый экран
buttonLogo.addEventListener('click', () => {
    clearTimeout(interval)
    controller.abort(); // Stops the child process

    introSlice.classList.remove('_hidden')
    loaderSlice.classList.add('_hidden')
    videoSlice.classList.add('_hidden')
})
// На стартовый экран с кнопки плеера
buttonVideoBack.addEventListener('click', () => {
    clearTimeout(interval)
    controller.abort(); // Stops the child process

    introSlice.classList.remove('_hidden')
    loaderSlice.classList.add('_hidden')
    videoSlice.classList.add('_hidden')
})






// video кнопки
const titleButtonVideo = document.querySelectorAll('.video__inform-title')[0]
const tableButtonVideo = document.querySelectorAll('.video__inform-table')[0]
const timeButtonVideo = document.querySelectorAll('.video__inform-time')[0]

const buttonCollection = [titleButtonVideo, tableButtonVideo, timeButtonVideo]

buttonCollection.forEach(button => {
    button.addEventListener('click', () => {
        button.children[0].classList
            .toggle('video__button-hidden')
        if (button.children[0].children[1].textContent === 'Скрыть') {
            button.children[0].children[1].textContent = 'Показать'
        } else {
            button.children[0].children[1].textContent = 'Скрыть'
        }
    })
});
