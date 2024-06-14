import {Types} from "mongoose";
import mongoose from "mongoose";
import {env} from "@tan/data/interface/EnvConfig";

abstract class Singleton<T extends Singleton<T>> {
  // Private static instance of the class
  private static _instance: Singleton<any>;
  
  // Protected constructor to prevent direct instantiation
  protected constructor(options: { db?: boolean } = {}) {
    if ((this.constructor as typeof Singleton)._instance) {
      throw new Error("Error: Instantiation failed. Use Singleton.getInstance() instead of new.");
    }
    (this.constructor as typeof Singleton)._instance = this;
    // TODO: This would probably not be required for all services. So need to come up with an alternative approach
    if (options.db) {
      this.connect().then(r => {
        console.debug(`Database connected for ${this.constructor.name}`);
      });
    }
  }
  
  // Static method to get the single instance of the class
  public static getInstance<T extends Singleton<T>>(this: new () => T): T {
    if (!(this as any)._instance) {
      (this as any)._instance = new this();
    }
    return (this as any)._instance;
  }
  
  protected objectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }
  
  protected async connect(): Promise<void> {
    try {
      // TODO: get rid of sensitive string from mongoose environment url
      // console.log(`Mongoose Connection to uri: ${env.MONGO_URI}`);
      await mongoose.connect(env.MONGO_URI);
      const connection = mongoose.connection;
      
      connection.on('connected', () => {
        console.log('MongoDB connected successfully!');
      });
      
      connection.on('error', (err) => {
        console.error('MongoDB connection error', err);
      });
    } catch (error) {
      console.error(error);
    }
  }
}

export default Singleton;
