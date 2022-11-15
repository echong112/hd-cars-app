const db = require('../../src/persistence');
const addItem = require('../../src/routes/addItem');
const ITEM = { id: 12345 };
const uuid = require('uuid/v4');

jest.mock('uuid/v4', () => jest.fn());

jest.mock('../../src/persistence', () => ({
    removeItem: jest.fn(),
    storeItem: jest.fn(),
    getItem: jest.fn(),
}));

test('it stores item correctly', async () => {
    const id = 'something-not-a-uuid';
    const make = 'Toyota';
    const model = 'Camry';
    const carPackage = 'Base';
    const color = 'White';
    const mileage = 200;
    const price = 3500000;
    const year = 2021;
    const category = 'Sedan';
    const req = { body: { id, make, model, carPackage, color, mileage, price, year, category } };
    const res = { send: jest.fn() };

    uuid.mockReturnValue(id);

    await addItem(req, res);

    const expectedItem = { id, make, model, carPackage, color, mileage, price, year, category };

    expect(db.storeItem.mock.calls.length).toBe(1);
    expect(db.storeItem.mock.calls[0][0]).toEqual(expectedItem);
    expect(res.send.mock.calls[0].length).toBe(1);
    expect(res.send.mock.calls[0][0]).toEqual(expectedItem);
});
