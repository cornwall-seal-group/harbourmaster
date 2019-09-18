const AlbumController = require('../controllers/album-controller');
const SealController = require('../controllers/seal-controller');

module.exports = [
    {
        method: 'GET',
        path: '/api/v1/seals',
        config: {
            description: 'List all seals',
            tags: ['api', 'v1', 'seals']
        },
        handler: SealController.getSeals
    },
    {
        method: 'GET',
        path: '/api/v1/seals/{seal}',
        config: {
            description: 'List all files for a seal',
            tags: ['api', 'v1', 'seal', 'files']
        },
        handler: SealController.listAllFiles
    },
    {
        method: 'GET',
        path: '/api/v1/seal/{seal}/poses/{pose}',
        config: {
            description: 'List all images for a seal against a particular pose',
            tags: ['api', 'v1', 'seal', 'pose']
        },
        handler: SealController.listAllPoseImages
    },
    {
        method: 'GET',
        path: '/api/v1/albums',
        config: {
            description: 'List all albums',
            tags: ['api', 'v1', 'albums']
        },
        handler: AlbumController.getAlbums
    },
    {
        method: 'GET',
        path: '/api/v1/albums/{album}',
        config: {
            description: 'List details from an album',
            tags: ['api', 'v1', 'seal', 'files']
        },
        handler: AlbumController.getAlbumDetails
    }
];
