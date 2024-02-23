import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';

interface RequestUser {
    _id: ObjectId | string;
    email: string;
    password: string;
    __v: number;
}

type EmailSource = 'params' | 'body' | 'query';

// Checking if the logged-in user's email matches the email in the route parameter
export const checkUserEmail = (source: EmailSource = 'params') => (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as RequestUser;
    const email = req[source].email;
    if (!user || user.email !== email) {
        return res.status(401).send("Unauthorized");
    }
    next();
}
