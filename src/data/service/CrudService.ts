import mongoose, {FilterQuery, QueryOptions, UpdateQuery} from "mongoose";
import SingletonService from "@tan/data/service/SingletonService";
import DataSeederService from "@tan/data/service/DataSeederService";
import {SeederOptions} from "@tan/data/interface/CommonInterfaces";
import Exception from "@tan/data/interface/Exception";

class CrudService<Entity, NewEntity, UpdateEntity extends UpdateQuery<Entity>> extends SingletonService<CrudService<Entity, NewEntity, UpdateEntity>> {
  readonly name: string;
  model: mongoose.PaginateModel<Entity, {}, {}>;
  
  protected constructor(name: string, model: mongoose.PaginateModel<Entity, {}, {}>) {
    super({db: true});
    this.name = name;
    this.model = model;
  }
  
  async findAll(options: QueryOptions<Entity>) {
    return await this.model.paginate(options?.filter, options?.page);
  }
  
  async findById(id: string, options?: QueryOptions<Entity>): Promise<Entity> {
    const entity = await this.model.findById(id);
    if (!entity) {
      throw Exception.NotFoundException(this.name, id);
    }
    return entity;
  }
  
  async findOneByFilter(filter: FilterQuery<Entity>): Promise<Entity | null> {
    return this.model.findOne(filter);
  }
  
  async create(request: NewEntity, options?: QueryOptions<Entity>): Promise<Entity> {
    const filteredEntity = await this.model.findOne(options?.filter);
    if (filteredEntity) {
      throw new Exception(`${this.name}ExistsException`, `${this.name} already exists`, 400, {filter: options?.filter});
    }
    const newEntity = new this.model(request);
    await newEntity.save();
    return newEntity;
  }
  
  async update(id: string, request: UpdateEntity): Promise<Entity> {
    const query: UpdateQuery<Entity> = request;
    const entity = await this.model.findOneAndUpdate(super.objectId(id), query, {new: true});
    if (entity == null) {
      throw Exception.NotFoundException(this.name, id);
    }
    return entity;
  }
  
  async delete(id: string): Promise<Entity> {
    const entity = await this.model.findOneAndDelete(super.objectId(id));
    if (!entity) {
      throw Exception.NotFoundException(this.name, id);
    }
    return entity;
  }
  
  async seed(options: SeederOptions = {count: 25}) {
    const seeder = new DataSeederService<Entity>(`${this.name}`);
    await seeder.seed(this.model, options);
  }
}

export default CrudService;