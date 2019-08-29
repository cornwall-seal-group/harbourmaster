const Boom = require('@hapi/boom');
const Bcrypt = require('bcrypt');
const config = require('config');
const Minio = require('minio');
const fs = require('fs');

const minioClient = new Minio.Client({
    endPoint: config.minioEndPoint,
    port: config.minioPort,
    useSSL: false,
    accessKey: config.minioAccessKey,
    secretKey: config.minioSecretKey
});

const deleteFile = ({ bucket, filename }) => {
    // filename = pd_123/LF1-0.3.jpg
    const splitFile = filename.split('/');
    const iteration = splitFile[0];
    const imageName = splitFile[1];

    const deletedFolderName = `${bucket}/deleted/${iteration}`;

    if (!fs.existsSync(deletedFolderName)) {
        fs.mkdirSync(deletedFolderName);
    }

    fs.renameSync(filename, `${deletedFolderName}/${imageName}`);
};

const removePatternDetectionImage = request => {
    const { headers } = request;

    const apiKey = headers['x-api-key'] || '';

    const { params } = request;
    const { bucket = '', filename = '' } = params;
    const configApiKey = config.apiKey;

    if (!configApiKey) {
        return Boom.internal(
            'Sorry, this project has not been setup with the correct security. Failing to process your request.'
        );
    }
    if (bucket === '' || filename === '') {
        return Boom.badRequest('Please supply the required params, bucket and filename');
    }

    return new Promise((resolve, reject) => {
        Bcrypt.compare(apiKey, configApiKey).then(match => {
            if (match) {
                minioClient.removeObject(bucket, filename, err => {
                    if (err) {
                        reject(err);
                    }
                    resolve(`Removed ${filename}`);
                });
                // Move folder to deleted folder for reference
                deleteFile({ bucket, filename });
            } else {
                resolve(Boom.unauthorized('Incorrect API Key'));
            }
        });
    });
};

module.exports = {
    removePatternDetectionImage
};
