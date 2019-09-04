const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const config = require('config');
const fs = require('fs');

const getAllSeals = () => {
    const folders = fs.readdirSync(config.imagesDir);
    const seals = {};
    folders.forEach(folder => {
        const seal = {};
        const folderPath = `${config.imagesDir}${folder}`;
        const subfolders = fs.readdirSync(folderPath);
        let totalFiles = 0;
        subfolders.forEach(subfolder => {
            const subfolderPath = `${config.imagesDir}${folder}/${subfolder}`;
            const files = fs.readdirSync(subfolderPath).length || 0;
            totalFiles += files;
            seal[subfolder] = files;
        });
        seal.total = totalFiles;
        seals[folder] = seal;
    });
    return seals;
};

const getSealImages = seal => {
    const folder = config.imagesDir + seal;
    const folders = fs.readdirSync(folder);
    const files = {};
    folders.forEach(subfolder => {
        const subFolderPath = `${folder}/${subfolder}`;
        const subFolderFiles = fs.readdirSync(subFolderPath);
        files[subfolder] = subFolderFiles;
    });

    return files;
};

const getSeals = request => {
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
                return resolve(getAllSeals());
            }
            return resolve(Boom.unauthorized('Incorrect API Key'));
        });
    });
};

const listAllFiles = request => {
    const { headers } = request;

    const apiKey = headers['x-api-key'] || '';

    const { params } = request;
    const { seal = '' } = params;
    const configApiKey = config.apiKey;

    if (!configApiKey) {
        return Boom.internal(
            'Sorry, this project has not been setup with the correct security. Failing to process your request.'
        );
    }
    if (seal === '') {
        return Boom.badRequest('Please supply a seal name');
    }
    return new Promise(resolve => {
        Bcrypt.compare(apiKey, configApiKey).then(match => {
            if (match) {
                resolve(getSealImages(seal));
            } else {
                resolve(Boom.unauthorized('Incorrect API Key'));
            }
        });
    });
};

module.exports = {
    getSeals,
    listAllFiles
};
