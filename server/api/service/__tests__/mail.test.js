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
    it('Should success send mail', async () => {
        try {
            await mail(mailConf.login, mailConf.password, [mailConf.destination], 'hi there');
        } catch (mailError) {
            expect(mailError).toEqual('foo');
        }
    });
    it('Should trow error for fail test', async () => {
        try {
            await mail('foo', 'foo', [mailConf.destination], 'hi there');
        } catch (mailError) {
            expect(mailError).not.toBeFalsy();
        }
    });
});