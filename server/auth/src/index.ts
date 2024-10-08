import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes/routes';
import HttpException from './models/http-exception.model';

const app = express();

/**
 * App Configuration
 */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

// Serves images
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.json({ status: 'API is running on /api' });
});

/* eslint-disable */
app.use((err: Error | HttpException, req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (err && err.errorCode) {
        // @ts-ignore
        res.status(err.errorCode).json(err.message);
    } else if (err) {
        res.status(500).json(err.message);
    }
});

/**
 * Server activation
 */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.info(`server up on port ${PORT}`);
});
