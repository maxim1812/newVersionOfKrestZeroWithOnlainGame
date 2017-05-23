"use strict";

// класс для получения информации о игроках с самыми лучшими результатами
export default class TopOfPlayersResultsGetter{
    // конструктор
    // инициализация полей класса
    constructor(url,contentManager){
        this.url = url;
        this.contentManager = contentManager;
        this.count = 3;
    }

    // метод для отправки запроса и получении информации о лучших игроках
    getInformationAboutBestUsers(){
        // переменная для доступа к THIS в блоке onreadystatechange
        let thisManager = this;
        // создание строки - запроса
        const query = this.url + "stats/" + this.count;
        // отпраляем запрос на сервер
        let request = new XMLHttpRequest();
        let url = query;
        request.open("POST",url, true);
        request.setRequestHeader("Content-Type","application/json;charset=UTF-8");
        request.send(null);
        // при получении ответа с сервера
        request.onreadystatechange = function(){
            // если ответ нормальный
            if(request.readyState === 4 && request.status === 200){
                // сохраняем полученные данные в строку
                const answerContent = request.responseText;
                // вызываем метод вывода данных на экран
                thisManager.printInformationAboutBestUsers(answerContent);
                console.log(answerContent);
            }
        }
    }

    // метод вывода данных на экран
    printInformationAboutBestUsers(contentText){
        // очищаем блок для вывода данных
        this.contentManager.clear();
        // записываем в блок для вывода данных информацию о лучших игроках
        this.contentManager.setText(contentText);
    }

    // метод для получения информации о лучших игроках и её вывод на экран
    getInfoAboutBestUsersAndRenderIt(){
        this.getInformationAboutBestUsers();
    }
}
