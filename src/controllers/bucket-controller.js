const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const config = require('config');
const Minio = require('minio');
const btoa = require('btoa');

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

const encodeImage = data => {
    const str = data.reduce((a, b) => {
        return a + String.fromCharCode(b);
    }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
};

const getImage = (request, h) => {
    const { headers } = request;

    const apiKey = headers['x-api-key'] || '';

    const { params } = request;
    const { bucket = '', image = '' } = params;
    const configApiKey = config.apiKey;

    if (!configApiKey) {
        return Boom.internal(
            'Sorry, this project has not been setup with the correct security. Failing to process your request.'
        );
    }
    if (bucket === '') {
        return Boom.badRequest('Please supply a bucket name');
    }
    if (image === '') {
        return Boom.badRequest('Please supply a image name');
    }
    return new Promise(resolve => {
        minioClient.getObject(bucket, image, (err, dataStream) => {
            if (err) {
                return resolve(err);
            }
            const data = [];
            dataStream.on('data', chunk => {
                data.push(chunk);
            });
            dataStream.on('end', () => {
                const buf = Buffer.from(data).toString('base64');
                console.log(buf.length, buf);
                resolve(
                    h
                        .response(buf)
                        .bytes(buf.length)
                        .header('Content-type', 'image/jpeg')
                        .header('Content-Disposition', 'inline')
                );
            });

            dataStream.on('error', error => {
                resolve(error);
            });
        });
    });
};

module.exports = {
    getBuckets,
    listAllFiles,
    getImage
};
