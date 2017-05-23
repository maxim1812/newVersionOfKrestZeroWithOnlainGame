"use strict";

// класс, отвечающий за регистрацию
export default class CheckIn{
    // конструктор
    // инициализация полей класса
    constructor(elementFinder,stringController,messageElement){
        // инициализируем поля класса вспомогательными объектами
        this.elementFinder = elementFinder;
        this.stringController = stringController;
        this.message = messageElement;
    }

    // проверка на корректность логина и пароля
    controlLoginAndPasswordStringsInCheckInForm(){
        // получаем содержимое текстовых полей
        // содержимое строки - логина
        const loginString = this.elementFinder.getElement("check-in-box__login-field_black-shadow").value;
        // содержимое строки - пароля
        const passwordString = this.elementFinder.getElement("check-in-box__password-field_black-shadow").value;
        // содержимое строки - email
        const emailString = this.elementFinder.getElement("check-in-box__email-field_black-shadow").value;
		
		// очищаем окно с сообщениями
        this.message.clear();
        // переменнаая - флаг, отвечающая за то, корректны ли обе строки логина и пароля
        let stringsOK = true;
        // проверка на корректность логина
		const emailResult = this.stringController.isNormalEmail(emailString);
		switch(emailResult){
            // если email - это пустая строка
            case "EMPTY":
                this.message.addText("Поле ввода email-a пусто.");
                stringsOK = false;
                break;
            // если email некорректен
            case "NO_CORRECT":
                this.message.addText("Введенный email некорректен.");
                stringsOK = false;
                break;
        }
		 
        const loginResult = this.stringController.isNormalString(loginString);
        switch(loginResult){
            // если логин - это пустая строка
            case "EMPTY":
                this.message.addText("Поле ввода логина пусто.");
                stringsOK = false;
                break;
            // если логин содержит некорректные символы
            case "NO_CORRECT":
                this.message.addText("Поле ввода логина содержит запретные символы.");
                stringsOK = false;
                break;
        }
        // проверка на корректность пароля
        const passwordResult = this.stringController.isNormalString(passwordString);
        switch(passwordResult){
            // если пароль - пустая строка
            case "EMPTY":
                this.message.addText("Поле ввода пароля пусто.");
                stringsOK = false;
                break;
            // если пароль содержит некорректные символы
            case "NO_CORRECT":
                this.message.addText("Поле ввода пароля содержит запретные символы.");
                stringsOK = false;
                break;
        }
        // возврат результата проверок на корректность
        return stringsOK;
    }

    // метод для попытки регистрации пользователя
    registrate(url){
        // проверяем на корректность логин и пароль
        const flag =  this.controlLoginAndPasswordStringsInCheckInForm();
        // если логин и пароль прошли проверку на корректность
        if(flag === true){
            // получаем логин, пароль и email
			const emailString =  this.elementFinder.getElement("check-in-box__email-field_black-shadow").value;
            // получаем логин
            const loginString = this.elementFinder.getElement("check-in-box__login-field_black-shadow").value;
            // получаем пароль
            const passwordString = this.elementFinder.getElement("check-in-box__password-field_black-shadow").value;
            // создаём JSON объект
            let myObjJSON = {
				email: emailString,
                username: loginString,
                password: passwordString
            };
			//Первобразуем в JSON строку с телом запроса
			let strJSON = JSON.stringify(myObjJSON); 
            // объект для вывода сообщений
            let message = this.message;
            // объект для поиска элемента
            let elementFinder = this.elementFinder;
            // отправка данных на сервер
            // создаём строку - запрос
            const query = url + "auth/regirstration";
            // создаём объект для отправки запроса
            let request = new XMLHttpRequest();
            request.open("POST",query);
            request.setRequestHeader("Content-Type","application/json;charset=UTF-8");

			request.send(strJSON);
			// при получении ответа с сервера
			request.onreadystatechange = function(){
				if(request.readyState === 4){
					switch ( request.status){
						case 201:
							//пользователь успешно создан
							elementFinder.getElement("check-in-box__email-field_black-shadow").value = "";
							elementFinder.getElement("check-in-box__login-field_black-shadow").value = "";
							elementFinder.getElement("check-in-box__password-field_black-shadow").value = "";
							message.setText("Регистрация прошла успешно.");
							break;
						case 409:
							//Этот логин/email занят
							message.clear();
							message.addText("Такой логин и/или e-mail уже занят другим пользователем.");
							message.addText("Придумайте, пожалуйста, другой логин.");
							break;
						case 404:
							message.clear();
							message.setText("Вы ввели некорректные данные.");
							break;
						default:
							break;
						}
					}
				}
            }
        }
}