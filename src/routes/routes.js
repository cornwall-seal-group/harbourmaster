const BucketController = require('../controllers/bucket-controller');
const ImageController = require('../controllers/image-controller');

module.exports = [
    {
        method: 'GET',
        path: '/api/v1/buckets/{folder}',
        config: {
            description: 'List all buckets and return their count against a folder',
            tags: ['api', 'v1', 'buckets']
        },
        handler: BucketController.getBuckets
    },
    {
        method: 'GET',
        path: '/api/v1/bucket/{bucket}/files',
        config: {
            description: 'List all files in a bucket',
            tags: ['api', 'v1', 'bucket', 'files']
        },
        handler: BucketController.listAllFiles
    },
    {
        method: 'GET',
        path: '/api/v1/bucket/{bucket}/files/{pdIteration}',
        config: {
            description: 'List all files in a bucket against a pattern detection model',
            tags: ['api', 'v1', 'bucket', 'files', 'pattern detection']
        },
        handler: BucketController.listAllPatternDetectionFiles
    },
    {
        method: 'DELETE',
        path: '/api/v1/bucket/{bucket}/files/{filename}',
        config: {
            description: 'Remove an image that had been identified by the pattern detection model',
            tags: ['api', 'v1', 'image', 'remove', 'pattern detection']
        },
        handler: ImageController.removePatternDetectionImage
    }
];
