import { Router } from 'express';
import { config } from '../config/index.js';
import { ipGuard } from '../middlewares/securityGuard.js';
import { getPlayerAvatar } from '../services/playerService.js';

const playerRouter = Router();

if (config.security.enableIpWhitelist) {
    playerRouter.use(ipGuard);
}

playerRouter.get('/:name/avatar', async (req, res) => {
    const name = req.params.name;
    const imageData = await getPlayerAvatar(name);

    res.set('Content-Type', 'image/png');
    
    res.status(200).send(imageData!.data);
});

playerRouter.use((req, res, _next) => {
    res.status(404).json({
        error: 'Not Found'
    });
});

export default playerRouter;