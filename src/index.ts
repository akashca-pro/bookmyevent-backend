import express,{Request, Response} from 'express';
import helmet from 'helmet';
import cors from 'cors'
import logger from '@/utils/pinoLogger';
import { httpLogger } from '@/utils/pinoLogger';
import { config } from '@/config';
import cookieParser from 'cookie-parser';
import { globalErrorHandler, notFound } from './utils/errorHandlers';

const app = express();
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser())
app.use(helmet());

app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT','PATCH','DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
}));

// Health check endpoint
app.get('/health', (req : Request, res : Response)=>{
    req.log.info('Health check hit')
    return res.status(200).json({ status : 'OK' });
})

// 404
app.use(notFound);

// Global error handler.
app.use(globalErrorHandler);

const startServer = () => {
    try {
        
        app.listen(config.PORT, () => {
            logger.info(`HTTPS ${config.SERVICE_NAME} running on port ${config.PORT}`);
        });

    } catch (error) {
        logger.error('Failed to start server : ', error);
        process.exit(1);
    }
};

startServer()