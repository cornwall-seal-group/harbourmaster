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

const getObjectsFromBucket = ({ bucket, prefix = 'originals' }) => {
    return new Promise(resolve => {
        const stream = minioClient.listObjects(bucket, '', true);
        const objects = [];
        stream.on('data', obj => {
            if (obj.name.indexOf(prefix) === 0) {
                objects.push(obj);
            }
        });
        stream.on('end', () => {
            resolve(objects);
        });
    });
};

const getBuckets = request => {
    const { headers } = request;

    const { params } = request;
    const { folder = 'originals' } = params;

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
                minioClient.listBuckets((err, buckets) => {
                    if (err) return resolve(err);

                    const numBuckets = buckets.length;
                    let bucketsProcessed = 0;
                    buckets.forEach(bucket => {
                        const { name } = bucket;
                        getObjectsFromBucket({ name, prefix: folder }).then(objects => {
                            bucket.files = objects.length;
                            bucketsProcessed += 1;
                            if (numBuckets === bucketsProcessed) {
                                resolve(buckets);
                            }
                        });
                    });
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
    const configApiKey = config.apiKey;

    if (!configApiKey) {
        return Boom.internal(
            'Sorry, this project has not been setup with the correct security. Failing to process your request.'
        );
    }
    if (bucket === '') {
        return Boom.badRequest('Please supply a bucket name');
    }
    return new Promise(resolve => {
        Bcrypt.compare(apiKey, configApiKey).then(match => {
            if (match) {
                getObjectsFromBucket({ bucket }).then(objects => resolve(objects));
            } else {
                resolve(Boom.unauthorized('Incorrect API Key'));
            }
        });
    });
};

const listAllPatternDetectionFiles = request => {
    const { headers } = request;

    const apiKey = headers['x-api-key'] || '';

    const { params } = request;
    const { bucket = '', pdIteration = '' } = params;
    const configApiKey = config.apiKey;

    if (!configApiKey) {
        return Boom.internal(
            'Sorry, this project has not been setup with the correct security. Failing to process your request.'
        );
    }
    if (bucket === '') {
        return Boom.badRequest('Please supply a bucket name');
    }
    if (pdIteration === '') {
        return Boom.badRequest('Please supply a pattern detection ID');
    }
    return new Promise(resolve => {
        Bcrypt.compare(apiKey, configApiKey).then(match => {
            if (match) {
                getObjectsFromBucket({ bucket, prefix: pdIteration }).then(objects => resolve(objects));
            } else {
                resolve(Boom.unauthorized('Incorrect API Key'));
            }
        });
    });
};

module.exports = {
    getBuckets,
    listAllFiles,
    listAllPatternDetectionFiles
};
