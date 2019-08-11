const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const config = require('config');
const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: config.minioEndPoint,
    port: config.minioPort,
    useSSL: false,
    accessKey: config.minioAccessKey,
    secretKey: config.minioSecretKey
});

const getBuckets = request => {
    const { headers } = request;

    const apiKey = headers['x-api-key'] || '';

    return new Promise(resolve => {
        Bcrypt.compare(apiKey, config.apiKey).then(match => {
            if (match) {
                minioClient.listBuckets((err, buckets) => {
                    if (err) return resolve(err);
                    resolve(buckets);
                });
            } else {
                resolve(Boom.unauthorized('Incorrect API Key'));
            }
        });
    });
};

const listAllFiles = request => {
    const { headers } = request;

    const apiKey = headers['x-api-key'] || '';

    const { params } = request;
    const { bucket = '' } = params;

    if (bucket === '') {
        return Boom.badRequest('Please supply a bucket name');
    }
    return new Promise(resolve => {
        Bcrypt.compare(apiKey, config.apiKey).then(match => {
            if (match) {
                const stream = minioClient.listObjects(bucket, '', true);
                stream.on('data', obj => {
                    resolve(obj);
                });
            } else {
                resolve(Boom.unauthorized('Incorrect API Key'));
            }
        });
    });
};
module.exports = {
    getBuckets,
    listAllFiles
};
