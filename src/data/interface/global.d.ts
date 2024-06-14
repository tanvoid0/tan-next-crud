import mongoose, {FilterQuery, PaginateModel} from "mongoose";
import {NextRequest} from "next/server";

declare global {
  type EnvKey<T> = { [key in keyof T]: string };
  
  interface BaseEnvConfig {
    IS_PRODUCTION: boolean;
    ENVIRONMENT: string;
    MONGO_URI: string;
  }
  
  export interface Params {
    id: string;
  }
  
  export interface Seeder<Entity> {
    model: PaginateModel<Entity, {}, {}>;
  }
  
  export interface SeederOptions {
    count: number;
  }
  
  
  export interface QueryOptions<Entity> {
    id?: string;
    forceCreate?: boolean;
    filter?: FilterQuery<Entity>,
    page?: Page,
  }
}

export const pageOptions = (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page");
  const limit = req.nextUrl.searchParams.get("limit");
  return {
    limit: Number(limit) || 10,
    page: Number(page) || 1
  }
}

export {}