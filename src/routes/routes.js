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
    }
];
