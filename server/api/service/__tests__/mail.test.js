/* global define, it, describe, expect */

/**
 * Created by x22a on 21.10.16.
 * mail sender testing
 */
import mail from '../mail'
import config from 'config'

// noinspection JSUnresolvedFunction
describe('Mail sender unit testing', () => {
    // noinspection JSUnresolvedFunction
    const mailConf = config.get('mail');
    it('Should return error===false for success send (promise)', () => mail(mailConf.login, mailConf.password, [mailConf.destination], 'hi there')
        .then(error => expect(error).toBeFalsy())
    );
});