import { graphql } from 'graphql'
import schema from '../../../server/api/sites'

const myStepDefinitionsWrapper = function stepDefinition() {
    this.When(/^User adds site with name: (.*), url: (.*), destinations: (.*)$/, (name, url, rawDestinations) => {
        const destinations = rawDestinations.split(';');

        const query = `mutation AddSite{ addSite(name: "${name}", url: "${url}"){ id, name, destinations, url } }`;

        graphql(schema, query).then(result => {
            console.log(JSON.stringify(result));
        });
    });
};
module.exports = myStepDefinitionsWrapper;