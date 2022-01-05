import { NextFunction, Request, Response } from 'express';
import * as log from 'npmlog';

export const preRequest = (req: Request, _: Response, next: NextFunction) => {
  log.info('Request', `[${req.method} ${req.url}]`);

  next();
};

export const postRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on('finish', () => {
    log.info('Request', `[${req.method} ${req.url}] -> ${res.statusCode}`);
  });

  next();
};