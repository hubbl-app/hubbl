import { Router } from 'express';
import { GymZoneCreateController, GymZoneUpdateController } from '../controllers';
import middlewares from '../middlewares';

const GymZoneRouter: Router = Router();

/**
 * @description Creates a gym zone in the database
 */
GymZoneRouter.post('', middlewares.auth, (req, res) => {
  GymZoneCreateController.execute(req, res);
});

/**
 * @description Updates a gym zone in the database
 */
GymZoneRouter.put('', middlewares.auth, (req, res) => {
  GymZoneUpdateController.execute(req, res);
});

export default GymZoneRouter;
