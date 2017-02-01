/**
 * Created by x22a on 02.10.16.
 * Browser emulator fot tests
 */

const singleton = Symbol('singleton');
const singletonEnforcer = Symbol('enforcer');

const _token = Symbol('token');
const _siteJWT = Symbol('_siteJWT');

export default class Browser {
    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) throw new Error('Cannot construct singleton');
        this[_token] = null;
        this[_siteJWT] = null;
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new Browser(singletonEnforcer);
        }
        return this[singleton];
    }

    setToken(token) {
        this[_token] = token;
    }

    getToken() {
        return this[_token];
    }

    setSiteJWT(JWT) {
        this[_siteJWT] = JWT;
    }

    getSiteJWT() {
        return this[_siteJWT];
    }
}