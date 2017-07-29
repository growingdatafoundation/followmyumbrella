'use strict';

const fetch = require('node-fetch');
const {Promise} = require('bluebird');
const jmespath = require('jmespath');
const {MongoClient} = require('mongodb');


const mongoDbUrl = 'mongodb://localhost:27017/historic';

const historyHub = {
    thing: 'http://data.history.sa.gov.au/sahistoryhub/thing',
    place: 'http://data.history.sa.gov.au/sahistoryhub/place',
    organisation: 'http://data.history.sa.gov.au/sahistoryhub/thing',
    event: 'http://data.history.sa.gov.au/sahistoryhub/thing',
};

Promise.all([
    MongoClient.connect(mongoDbUrl),
    fetch(historyHub.thing)
        .then((res) => res.text())
        .then((body) => JSON.parse(body))
        // .then((body) => jmespath.search(body, `features[?geometry]`))
        .then((body) => jmespath.search(body, `
            features[?geometry].{
                title: properties.TITLE,
                description: properties.DESCRIPTION,
                url: properties.MORE_INFORMATION,
                location: geometry,
                tags: ['thing']
            }`)),
    fetch(historyHub.place)
        .then((res) => res.text())
        .then((body) => JSON.parse(body))
        // .then((body) => jmespath.search(body, `features[?geometry]`))
        .then((body) => jmespath.search(body, `
            features[?geometry].{
                title: properties.TITLE,
                description: properties.DESCRIPTION,
                url: properties.MORE_INFORMATION,
                location: geometry,
                tags: ['place']
            }`)),
    fetch(historyHub.organisation)
        .then((res) => res.text())
        .then((body) => JSON.parse(body))
        // .then((body) => jmespath.search(body, `features[?geometry]`))
        .then((body) => jmespath.search(body, `
            features[?geometry].{
                title: properties.TITLE,
                description: properties.DESCRIPTION,
                url: properties.MORE_INFORMATION,
                location: geometry,
                tags: ['organisation']
            }`)),
    fetch(historyHub.event)
        .then((res) => res.text())
        .then((body) => JSON.parse(body))
        // .then((body) => jmespath.search(body, `features[?geometry]`))
        .then((body) => jmespath.search(body, `
            features[?geometry].{
                title: properties.TITLE,
                description: properties.DESCRIPTION,
                url: properties.MORE_INFORMATION,
                location: geometry,
                tags: ['event']
            }`))
    ]).then(async ([db, things, places, organisations, events]) => {

        console.log(JSON.stringify(events, null, 2));

        const pointOfInterests = db.collection('pointOfInterests');

        try {
            await pointOfInterests.drop();
        } catch (err) {
            // Do nothing
        }

        await pointOfInterests.insertMany(things);
        await pointOfInterests.insertMany(places);
        await pointOfInterests.insertMany(organisations);
        await pointOfInterests.insertMany(events);

        return db.close();
    })
    .catch(console.error);
