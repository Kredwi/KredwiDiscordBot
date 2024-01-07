const fs = require('fs');
const locales = fs.readdirSync('./locales');

module.exports = function getLocaleFile(lang) {
    const locale = locales.filter(locale => locale.toLowerCase().includes(lang.toLowerCase() + '.json'));
    if (locale.length > 0)
        return require('./locales/' + locale.join("").toLowerCase());
    else
        return require('./locales/en-us.json');
}