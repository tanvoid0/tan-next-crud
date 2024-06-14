import {deleteModel, model, models, PaginateModel, Schema, SchemaDefinition} from "mongoose";
import mongoosePagination from 'mongoose-paginate-v2';
import SingletonService from "@tan/data/service/SingletonService";

export interface MongoModel extends Document {

}

export interface NewMongoModel {

}

export interface UpdateMongoModel {
  id: string;
}

export class SchemaService<Entity extends MongoModel, NewEntity extends NewMongoModel, UpdateEntity extends UpdateMongoModel> extends SingletonService<SchemaService<Entity, NewEntity, UpdateEntity>> {
  readonly name: string;
  model: PaginateModel<Entity>;
  
  constructor(name: string) {
    super();
    this.name = name;
    this.model = this.build();
  }
  
  protected build(definition?: SchemaDefinition): PaginateModel<Entity>{
    const MongoSchema: Schema = new Schema<Entity>(definition);
    
    if (models[this.name]) {
      deleteModel(this.name);
    }
    MongoSchema.plugin(mongoosePagination)
    
    return model<Entity, PaginateModel<Entity>>(this.name, MongoSchema);
  }
}

export default SchemaService;