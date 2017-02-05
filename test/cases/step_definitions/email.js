import XHR from 'xmlhttprequest'
import config from 'config'
import Browser from '../../utils/Browser'

const XMLHttpRequest = XHR.XMLHttpRequest;

const myStepDefinitionsWrapper = function stepDefinition() {
	const browser = Browser.instance;

	this.When(/^Site sends HTTP POST with JWT auth header, subject (.*) - op, text: (.*) and safe html code: (.*) - op$/, async (subject, text, html) => {
		const xhr = new XMLHttpRequest();

		const mail = JSON.stringify({ subject, text, html });

        /** @namespace config.express */
		xhr.open('POST', `http://${config.express.host}:${config.express.port}/site/api/v1/mail`, false);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Authorization', browser.getSiteJWT());
		xhr.send(mail);

		if (xhr.status !== 200 && xhr.status !== 502) {
			throw new Error(`[Bad response] Code: ${xhr.status} Res: ${xhr.responseText}`);
		}
	});
};
module.exports = myStepDefinitionsWrapper;