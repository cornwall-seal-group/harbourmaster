const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const config = require('config');
const fs = require('fs');

const getAllAlbums = () => {
    const albums = [];
    const albumFolder = fs.readdirSync(`${config.imagesDir}albums`);
    albumFolder.forEach(file => {
        const ext = file.split('.')[1];
        if (ext === 'pptx') {
            albums.push(file);
        }
    });
    return albums;
};

const getAlbumResults = album => {
    const json = album.replace('pptx', 'json');
    const jsonFile = fs.readFileSync(`${config.imagesDir}albums/${json}`);
    const contents = JSON.parse(jsonFile);
    return contents;
};

const getAlbums = request => {
    const { headers } = request;

    const apiKey = headers['x-api-key'] || '';
    const configApiKey = config.apiKey;

    if (!configApiKey) {
        return Boom.internal(
            'Sorry, this project has not been setup with the correct security. Failing to process your request.'
        );
    }

    return new Promise(resolve => {
        Bcrypt.compare(apiKey, configApiKey).then(match => {
            if (match) {
                return resolve(getAllAlbums());
            }
            return resolve(Boom.unauthorized('Incorrect API Key'));
        });
    });
};

const getAlbumDetails = request => {
    const { headers } = request;

    const apiKey = headers['x-api-key'] || '';

    const { params } = request;
    const { album = '' } = params;
    const configApiKey = config.apiKey;

    if (!configApiKey) {
        return Boom.internal(
            'Sorry, this project has not been setup with the correct security. Failing to process your request.'
        );
    }
    if (album === '') {
        return Boom.badRequest('Please supply an album name');
    }
    return new Promise(resolve => {
        Bcrypt.compare(apiKey, configApiKey).then(match => {
            if (match) {
                resolve(getAlbumResults(album));
            } else {
                resolve(Boom.unauthorized('Incorrect API Key'));
            }
        });
    });
};

module.exports = {
    getAlbums,
    getAlbumDetails
};
