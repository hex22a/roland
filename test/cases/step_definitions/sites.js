import { graphql } from 'graphql'
import schema from '../../../server/api/sites'
import Browser from '../../utils/Browser'


const myStepDefinitionsWrapper = function stepDefinition() {
    let site = null;
    const browser = Browser.instance;

    this.When(/^User adds site with name: (.*), url: (.*), destinations: (.*), SMTP login: (.*), SMTP Password: (.*)$/, async (name, url, rawDestinations, SMTPLogin, SMTPPassword) => {
        const destinations = rawDestinations.split(';');

        const query = `mutation AddSite { addSite(name: "${name}", destinations: ${JSON.stringify(destinations)}, url: "${url}", token: "${browser.getToken()}", SMTPLogin: "${SMTPLogin}", SMTPPassword: "${SMTPPassword}") {site {id, name, destinations, url, owners, SMTPLogin, JWT} errors } }`;

        const result = await graphql(schema, query);
        site = result.data.addSite.site;
        browser.setSiteJWT(site.JWT);
        console.log(result.data.addSite);
    });

    this.Then(/^User can get new site as an object$/, async () => {
        if (!site || Object.keys(site).length === 0) {
            throw new Error('No site added!');
        }
    });

    this.When(/^User edits site with name: (.*), url: (.*), destinations: (.*), SMTP login: (.*), SMTP Password: (.*)$/, async (name, url, rawDestinations, SMTPLogin, SMTPPassword) => {
        const destinations = rawDestinations.split(';');
        const query = `mutation EditSite { editSite(id: "${site.id}", name: "${name}", destinations: ${JSON.stringify(destinations)}, url: "${url}", token: "${browser.getToken()}", SMTPLogin: "${SMTPLogin}", SMTPPassword: "${SMTPPassword}") {site {id, name, destinations, url, owners, SMTPLogin, JWT} errors } }`;

        console.log(query);

        const result = await graphql(schema, query);
        site = result.data.editSite.site;
        console.log(result.data.editSite);
    });

    this.When(/^User removes site$/, async () => {
        const query = `mutation RemoveSite { removeSite(id: "${site.id}", token: "${browser.getToken()}") {site {id, name, destinations, url, owners, SMTPLogin, JWT} errors } }`;

        console.log(query);

        const result = await graphql(schema, query);
        site = result.data.removeSite.site;
    });

    this.Then(/^Nobody can get site anymore$/, async () => {
        const query = `query GetSite { site (id: "${site.id}") { id } }`;

        const result = await graphql(schema, query);
        if (result.errors && result.errors.length > 0) {
            throw new Error(`Errors: ${result.errors}`);
        } else if (result.data.site.id !== null) {
            throw new Error('Site still exists');
        }
    });
};
module.exports = myStepDefinitionsWrapper;