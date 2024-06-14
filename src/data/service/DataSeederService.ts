import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import {SeederOptions} from "@tan/data/interface/CommonInterfaces";

class DatabaseSeederService<Entity> {
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
  
  async seed(model: mongoose.PaginateModel<Entity, {}, {}>, options: SeederOptions = { count: 25 }): Promise<Entity[]> {
    const schema = model.schema;
    const fields = Object.keys(schema.paths).filter(field => field !== '__v');
    const records = [];
    
    for (let i = 0; i < options.count; i++) {
      const record: Record<string, any> = new Map();
      for (const field of fields) {
        const schemaType = schema.paths[field];
        if (schemaType.instance === 'Array') {
          record[field] = this.generateRandomData(schemaType.instance, "String");
        } else {
          record[field] = this.generateRandomData(schemaType.instance, null);
        }
      }
      records.push(record);
    }
    
    try {
      const data = await model.create(records);
      console.log(`${options.count} records seeded successfully for model ${this.name}`)
      return data;
    } catch (error) {
      console.error(`Error seeding data for model '${this.name}`);
      throw error;
    }
  }
  
  generateRandomData(type: string | null, subType: string | null): any {
    switch (type) {
    case 'String':
      return faker.lorem.words();
    case 'Number':
      return faker.number.int();
    case 'Date':
      return faker.date.past();
    case 'Boolean':
      return faker.datatype.boolean();
    case 'Array':
      if (subType === null) {
        return [];
      }
      const arr = [];
      const arrayLength = faker.number.int({ min: 1, max: 5 }); // Random array length
      for (let i = 0; i < arrayLength; i++) {
        arr.push(this.generateRandomData(subType, null));
      }
      return arr;
    case 'ObjectId':
      return faker.database.mongodbObjectId()
      // Extend for other types as needed
    default:
      return null; // Default to null for unknown types
    }
  }
}

export default DatabaseSeederService;