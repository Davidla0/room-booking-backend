
import { Request, Response, NextFunction } from 'express';


export function validateRoomSearchDates(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { checkIn, checkOut } = req.query;

  if (!checkIn || !checkOut) {
    return res.status(400).json({
      error: 'INVALID_SEARCH_DATES',
      message: 'checkIn and checkOut query params are required',
    });
  }

  const start = new Date(String(checkIn));
  const end = new Date(String(checkOut));

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return res.status(400).json({
      error: 'INVALID_DATE_RANGE',
      message:
        'checkIn and checkOut must be valid ISO dates and checkOut must be after checkIn',
    });
  }

  (req as any).parsedDates = { checkIn: start, checkOut: end };

  next();
}
