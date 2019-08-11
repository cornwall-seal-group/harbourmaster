const BucketController = require('../controllers/bucket-controller');

module.exports = [
    {
        method: 'GET',
        path: '/harbourmaster/api/v1/buckets',
        config: {
            description: 'View all buckets',
            tags: ['api', 'v1', 'buckets']
        },
        handler: BucketController.getBuckets
    },
    {
        method: 'GET',
        path: '/harbourmaster/api/v1/bucket/{bucket}/files',
        config: {
            description: 'List all files in a bucket',
            tags: ['api', 'v1', 'bucket', 'files']
        },
        handler: BucketController.listAllFiles
    }
];
