const db = require('../persistence');

module.exports = async (req, res) => {
    const logs = await db.getLogs();
    res.send(logs);
};
