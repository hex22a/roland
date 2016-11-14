import XHR from 'xmlhttprequest'
import config from 'config'

const XMLHttpRequest = XHR.XMLHttpRequest;

const myStepDefinitionsWrapper = function stepDefinition() {
    let error = true;

    this.When(/^Гость отправляет POST запрос с полями Имя: (.*) e-mail: (.*) Тема: (.*) Сообщение: (.*)$/, (name, email, subject, message) => {
        const xhr = new XMLHttpRequest();

        const help = JSON.stringify({ help: { email, name, subject, message } });

        /** @namespace config.express */
        xhr.open('POST', `http://${config.express.host}:${config.express.port}/openapi/v1/help`, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(help);

        if (xhr.status !== 200) {
            throw new Error(`[Bad response] Code: ${xhr.status} Res: ${xhr.responseText}`);
        } else {
            error = false;
        }
    });

    this.Then(/^Админсратор получает письмо$/, () => {
        /** @namespace config.mail.destination */
        console.log(`[CUCUMBER] Check mail ${config.mail.destination}`);
    });

    this.Then(/^Сервер отвечает HTTP статусом 200$/, () => {
        if (error) throw new Error('Server fault');
    });
};
module.exports = myStepDefinitionsWrapper;