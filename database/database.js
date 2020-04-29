const Sequelize = require('sequelize');

const connection = new Sequelize('guia_press', 'elesonsouza', 'e19961104', {
    host: 'mysql669.umbler.com',
    dialect: 'mysql',
    timezone: '-03:00' // Config de fuso horário do Brasil (Brasília).
});

module.exports = connection;