import { graphql } from 'graphql'
import schema from '../../../server/api/sites'
import Browser from '../../utils/Browser'


const myStepDefinitionsWrapper = function stepDefinition() {
    let site = null;
    const browser = Browser.instance;

    this.When(/^User adds site with name: (.*), url: (.*), destinations: (.*)$/, async (name, url, rawDestinations) => {
        const destinations = rawDestinations.split(';');

        const query = `mutation AddSite { addSite(name: "${name}", destinations: ${JSON.stringify(destinations)}, url: "${url}", token: "${browser.getToken()}") {site {id, name, destinations, url, owners} errors } }`;

        console.log(query);

        const result = await graphql(schema, query);
        site = result.data.addSite;
        console.log(result);
    });

    this.Then(/^User can get new site as an object$/, async () => {
        if (!site || Object.keys(site).length === 0) {
            throw new Error('No site added!');
        }
    });
};
module.exports = myStepDefinitionsWrapper;