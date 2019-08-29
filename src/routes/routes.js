const BucketController = require('../controllers/bucket-controller');

module.exports = [
    {
        method: 'GET',
        path: '/api/v1/buckets',
        config: {
            description: 'View all buckets',
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
    }
];
