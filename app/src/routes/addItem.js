const db = require('../persistence');
const uuid = require('uuid/v4');

module.exports = async (req, res) => {
  const item = {
    id: uuid(),
    make: req.body.make,
    model: req.body.model,
    carPackage: req.body.carPackage,
    color: req.body.color,
    year: req.body.year,
    category: req.body.category,
    mileage: req.body.mileage,
    price: req.body.price,
  };
  await db.storeItem(item);
  res.send(item);
};
