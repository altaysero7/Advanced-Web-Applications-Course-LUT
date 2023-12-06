// Referencing week 6 source code

import express, { Express, Request, Response } from 'express';
import helloRouter from './routes/hello';
import vehicleRouter from './routes/vehicle';

const app: Express = express();
const port: number = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use('/hello', helloRouter);
app.use('/vehicle', vehicleRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});