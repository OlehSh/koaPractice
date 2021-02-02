import * as request from "supertest"
import app from '../../app';
import { expect} from "chai"

const apptest = request(app.listen(3000));



describe('Home', () => {
    it('GET not Existing route ""', async () => {
        const response = await apptest.get('/')
        expect(response.status).eql(404);
        expect(response.text).contain('Not Found');
    })
    it('GET basic route /v1/', async () => {
        const response = await apptest.get('/v1/')
        expect(response.status).eql(200);
        expect(response.text).eql('HOME PAGE');
    })
})
