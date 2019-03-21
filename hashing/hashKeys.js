var hashKeys = {
    mail: {
        algo:   "aes-128-cbc",
        key:    new Buffer('9vmleczko3PAsJrM', 'utf8'),
        iv:     new Buffer('!nJL7EDzjqWjcaY9', 'utf8'),
    },
    name: {
        algo:   "aes-256-cbc",
        key:    new Buffer('owdww2dfPMH95BEKAm5wyzGiixsu1gl2', 'utf8'),
        iv:     new Buffer('dIZ2vSKfLf65zZV0', 'utf8'),
    },
    surname: {
        algo:   "camellia-192-cbc",
        key:    new Buffer('wPOrHP1FBqZGjR9cltJZh2n3', 'utf8'),
        iv:     new Buffer('7ZV1Ih398c3nNh4g', 'utf8'),
    },
    gender: {
        algo:   "camellia-256-cbc",
        key:    new Buffer('Jy0t1e3mrbh7Klh8i2lST3QVgsH1kwvl', 'utf8'),
        iv:     new Buffer('QMaQcFRNAYiJyKnC', 'utf8'),
    },
    birthday: {
        algo:   "des-ede3-cbc",
        key:    new Buffer('r4pNigi4pbKVV63QCGFO1L3!', 'utf8'),
        iv:     new Buffer('FD3zJnN6', 'utf8'),
    },
    phone: {
        algo:   "aes-192-cbc",
        key:    new Buffer('EMOVC5ra1vDrrh8p57jYZ5M0', 'utf8'),
        iv:     new Buffer('Ch9qc4EZcLWwrMO6', 'utf8'),
    },
    street: {
        algo:   "camellia-128-cbc",
        key:    new Buffer('CFrGVicpFA4xbI99', 'utf8'),
        iv:     new Buffer('ZQSAFO0GlhvEcjUZ', 'utf8'),
    },
    number: {
        algo:   "cast5-cbc",
        key:    new Buffer('kSISHojSQH9az725', 'utf8'),
        iv:     new Buffer('hLqQl7z0', 'utf8'),
    },
    zipCode: {
        algo:   "bf-cbc",
        key:    new Buffer('Xhz0GNQcLEyPjqzJ', 'utf8'),
        iv:     new Buffer('H5EAjUUg', 'utf8'),
    },
    city: {
        algo:   "seed-cbc",
        key:    new Buffer('FTA61Yfvu8awPsyB', 'utf8'),
        iv:     new Buffer('D5GoHo4MVo0hl3b5', 'utf8'),
    },
    image: {
        algo:   "des-ede3-cbc",
        key:    new Buffer('GT9RqHYAxYLBsSzz51pEZ8LB', 'utf8'),
        iv:     new Buffer('M7AeYAJN', 'utf8'),
    },
};

module.exports = hashKeys;