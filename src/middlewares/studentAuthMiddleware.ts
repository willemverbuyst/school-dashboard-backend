import { NextFunction, Response } from 'express';
import Student from '../db/models/student';
import { toData } from '../auth/jwt';
import { RequestWithBody } from '../interfaces/Requests';

export const studentAuthMiddleware = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(' ');

  if (!auth || !(auth[0] === 'Bearer') || !auth[1]) {
    res.status(401).send({
      message:
        'This endpoint requires an Authorization header with a valid token',
    });
  } else {
    try {
      const data = toData(auth[1]);
      const student = await Student.findByPk(
        (<{ studentId: number }>data).studentId
      ).then((data) => data?.get({ plain: true }));

      if (!student) {
        res.status(404).send({ message: 'Student does not exist' });
      } else {
        req.student = student;
      }

      return next();
    } catch (error) {
      console.log('ERROR IN AUTH MIDDLEWARE', error);

      switch (error.name) {
        case 'TokenExpiredError':
          res.status(401).send({ error: error.name, message: error.message });

        case 'JsonWebTokenError':
          res.status(400).send({ error: error.name, message: error.message });

        default:
          res.status(400).send({
            message: 'Something went wrong, sorry',
          });
      }
    }
  }
};
