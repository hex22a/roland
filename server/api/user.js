/**
 * Created by hex22a on 31.03.16.
 * user api
 */
import passport from 'passport'
import bcrypt from 'bcrypt'

import { GraphQLString, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLNonNull } from 'graphql'
import * as db from './service/db'

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User object',
    fields: () => ({
        id: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        }
    })
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        user: {
            type: UserType,
            args: {
                id: {
                    name: 'id',
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async (root, { id }) => await db.getUser(id)
        }
    })
});

const AddUserResult = new GraphQLObjectType({
    name: 'AddUserResult',
    fields: {
        errors: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        user: { type: UserType },
    }
});

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addUser: {
            type: AddUserResult,
            args: {
                id: {
                    name: 'id',
                    type: new GraphQLNonNull(GraphQLString)
                },
                password: {
                    name: 'password',
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            resolve: async(root, { id, password }) => {
                let result = null;
                const errors = [];

                const existing = await db.getUser(id);
                if (existing) {
                    errors.push('A user with this email address already exists.');
                } else {
                    const user = { id };

                    user.password = bcrypt.hashSync(password, 8);
                    result = await db.saveUser(user);
                }
                return { user: result, errors }
            }
        }
    })
});

export default new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
});

/**
 * @param req
 * @param res
 * @param next
 */
export function logIn(req, res, next) {
    // noinspection JSUnresolvedFunction
    passport.authenticate('json-login', (err, token, user) => {
        if (err) {
            res.status(400);
            res.json({ error: err });
        } else if (user) {
            req.logIn(user, logInError => {
                if (logInError) {
                    res.status(400);
                    res.json({ error: logInError });
                } else {
                    res.json({ token });
                    return next();
                }
                return logInError;
            });
        } else {
            res.status(400);
            res.json({ error: 'No user' });
        }
        return err;
    })(req, res, next);
}

/**
 * @param req
 * @param res
 */
export function logOut(req, res) {
    req.logout();
    res.json({ logout: true });
}