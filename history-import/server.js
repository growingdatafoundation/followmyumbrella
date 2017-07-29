'use strict';

const fetch = require('node-fetch');
const {Promise} = require('bluebird');
const jmespath = require('jmespath');
const {MongoClient} = require('mongodb');
const Joi = require('joi');


const envSchema = Joi.object().keys({
    MONGO_DB_URL: Joi.string().required()
});

const env = Joi.validate(process.env, envSchema, { allowUnknown: true, stripUnknown: true })

if (env.error) {

    console.log('Can not continue. Environment is invalid');
    console.log(env.error.details);

    process.exit(0);
}

const options = env.value

const historyHub = {
    thing: 'http://data.history.sa.gov.au/sahistoryhub/thing',
    place: 'http://data.history.sa.gov.au/sahistoryhub/place',
    organisation: 'http://data.history.sa.gov.au/sahistoryhub/thing',
    event: 'http://data.history.sa.gov.au/sahistoryhub/thing',
};

Promise.all([
    MongoClient.connect(options.MONGO_DB_URL),
    fetch(historyHub.thing)
        .then((res) => res.text())
        .then((body) => JSON.parse(body))
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
        .then((body) => jmespath.search(body, `
            features[?geometry].{
                title: properties.TITLE,
                description: properties.DESCRIPTION,
                url: properties.MORE_INFORMATION,
                location: geometry,
                tags: ['event']
            }`))
    ]).then(async ([db, things, places, organisations, events]) => {

        const pointOfInterests = db.collection('pointOfInterests');

        try {
            await pointOfInterests.drop();
        } catch (err) {
            // Do nothing
        }

        try {

            await pointOfInterests.insertMany(things);
            console.log(`Imported ${things.length} things`);

            await pointOfInterests.insertMany(places);
            console.log(`Imported ${places.length} places`);

            await pointOfInterests.insertMany(organisations);
            console.log(`Imported ${organisations.length} organisations`);

            await pointOfInterests.insertMany(events);
            console.log(`Imported ${events.length} events`);

            await pointOfInterests.createIndex({"location":"2dsphere"});
            console.log(`Created index`);

            console.log(`Done`);
        } catch (err) {

            console.error(err);
        }

        db.close();
    })
    .catch(console.error);
