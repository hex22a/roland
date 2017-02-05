/**
 * Crafted by x22a on 14.11.16.
 */

import { GraphQLString, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLNonNull } from 'graphql'
import * as db from './service/db'
import jwt from 'jsonwebtoken'
import config from 'config'
import crypto from 'crypto'

const SiteType = new GraphQLObjectType({
	name: 'Site',
	description: 'A site object',
	fields: () => ({
		id: {
			type: GraphQLString
		},
		name: {
			type: GraphQLString
		},
		destinations: {
			type: new GraphQLList(GraphQLString)
		},
		owners: {
			type: new GraphQLList(GraphQLString)
		},
		url: {
			type: GraphQLString
		},
		SMTPLogin: {
			type: GraphQLString
		},
		JWT: {
			type: GraphQLString
		}
	})
});

const AddSiteResult = new GraphQLObjectType({
	name: 'AddSiteResult',
	fields: {
		errors: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
		site: { type: SiteType },
	}
});

const QueryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		site: {
			type: SiteType,
			args: {
				id: {
					name: 'id',
					type: new GraphQLNonNull(GraphQLString)
				}
			},
			resolve: async(root, { id }) => {
				const JWT = jwt.sign({ id }, config.jwtSecret);

				const site = await db.getSite(id);
				return { ...site, JWT }
			}
		}
	})
});

const MutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		addSite: {
			type: AddSiteResult,
			args: {
				name: {
					name: 'name',
					type: new GraphQLNonNull(GraphQLString)
				},
				destinations: {
					name: 'destinations',
					type: new GraphQLList(GraphQLString)
				},
				url: {
					name: 'url',
					type: new GraphQLNonNull(GraphQLString)
				},
				token: {
					name: 'token',
					type: new GraphQLNonNull(GraphQLString)
				},
				SMTPLogin: {
					name: 'SMTPLogin',
					type: GraphQLString
				},
				SMTPPassword: {
					name: 'SMTPPassword',
					type: GraphQLString
				}
			},
			resolve: async(root, { destinations, url, name, token, SMTPLogin, SMTPPassword }) => {
				const errors = [];
				let result = null;

				try {
					const decoded = jwt.verify(token, config.jwtSecret);
					let site = { destinations, url, name, owners: [decoded.id] };
					if (SMTPPassword && SMTPPassword) {
						/** @namespace config.crypto */
						const cipher = crypto.createCipher(config.crypto.algorithm, config.crypto.password);
						let crypted = cipher.update(SMTPPassword, 'utf8', 'hex');
						crypted += cipher.final('hex');
						site = { ...site, SMTPLogin, SMTPPassword: crypted };
					}
					result = await db.saveSite(site);
					const user = await db.getUser(decoded.id);
					if (!{}.hasOwnProperty.call(user, 'sites')) {
						user.sites = [result.id];
					} else {
						user.sites.push(result.id);
					}
					await db.saveUser(user);
				} catch (decodingError) {
					errors.push(decodingError);
				}

				const JWT = jwt.sign({ id: result.id }, config.jwtSecret);

				result = { ...result, JWT };

				return { site: result, errors };
			}
		},
		editSite: {
			type: AddSiteResult,
			args: {
				id: {
					name: 'id',
					type: new GraphQLNonNull(GraphQLString)
				},
				name: {
					name: 'name',
					type: GraphQLString
				},
				destinations: {
					name: 'destinations',
					type: new GraphQLList(GraphQLString)
				},
				url: {
					name: 'url',
					type: GraphQLString
				},
				token: {
					name: 'token',
					type: new GraphQLNonNull(GraphQLString)
				},
				SMTPLogin: {
					name: 'SMTPLogin',
					type: GraphQLString
				},
				SMTPPassword: {
					name: 'SMTPPassword',
					type: GraphQLString
				}
			},
			resolve: async(root, { id, destinations, url, name, token, SMTPLogin, SMTPPassword }) => {
				const errors = [];
				let result = null;

				try {
					jwt.verify(token, config.jwtSecret);
					const site = await db.getSite(id);
					if (!site) {
						errors.push(`Site with id ${id} not found!`)
					} else {
						if (destinations) {
							site.destinations = destinations
						}
						if (url) {
							site.url = url;
						}
						if (name) {
							site.name = name;
						}

						if (SMTPPassword && SMTPPassword) {
							/** @namespace config.crypto */
							const cipher = crypto.createCipher(config.crypto.algorithm, config.crypto.password);
							let crypted = cipher.update(SMTPPassword, 'utf8', 'hex');
							crypted += cipher.final('hex');
							site.SMTPLogin = SMTPLogin;
							site.SMTPPassword = crypted;
						}

						result = await db.updateSite(site);
					}
				} catch (decodingError) {
					errors.push(decodingError);
				}

				const JWT = jwt.sign({ id: result.id }, config.jwtSecret);

				result = { ...result, JWT };

				return { site: result, errors };
			}
		},
		removeSite: {
			type: AddSiteResult,
			args: {
				id: {
					name: 'id',
					type: new GraphQLNonNull(GraphQLString)
				},
				token: {
					name: 'token',
					type: new GraphQLNonNull(GraphQLString)
				}
			},
			resolve: async(root, { id, token }) => {
				const errors = [];
				let result = null;

				try {
					jwt.verify(token, config.jwtSecret);
					const site = await db.getSite(id);
					if (!site) {
						errors.push(`Site with id ${id} not found!`)
					} else {
						result = site;
						await db.deleteSite(id);
					}
				} catch (decodingError) {
					errors.push(decodingError);
				}
				return { site: result, errors };
			}
		}

	})
});

export default new GraphQLSchema({
	query: QueryType,
	mutation: MutationType
});