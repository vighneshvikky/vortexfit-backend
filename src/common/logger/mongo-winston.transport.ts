
import  Transport, {TransportStreamOptions} from 'winston-transport';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schema/logger.schema';

export class MongoWinstonTransport extends Transport {
  private logModel: Model<LogDocument>;

  constructor(opts: TransportStreamOptions & {logModel: Model<LogDocument>}) {
    super(opts);
    this.logModel = opts.logModel;

    

  }

  async log(info: LogInfo,  callback: () => void) {
    
    setImmediate(() => this.emit('logged', info));

    try {
      await this.logModel.create({
        level: info.level,
        message: info.message,
        timestamp: new Date(),
      });

      
    } catch (err) {
      console.error('Error saving log to MongoDB:', err);
    }

    callback();
  }
}


interface LogInfo {
  level: string;
  message: string;
  [key: string]: unknown; 
}
