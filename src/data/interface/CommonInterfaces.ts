import {FilterQuery, PaginateModel} from "mongoose";
import {NextRequest} from "next/server";


export interface Params {
  id: string;
}

export interface Seeder<Entity> {
  model: PaginateModel<Entity, {}, {}>;
}

export interface SeederOptions {
  count: number;
}


export interface Page {
  page: number;
  limit: number;
}

export interface QueryOptions<Entity> {
  id?: string;
  forceCreate?: boolean;
  filter?: FilterQuery<Entity>,
  page?: Page,
}

export const PageOptions = (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page");
  const limit = req.nextUrl.searchParams.get("limit");
  return {
    limit: Number(limit) || 10,
    page: Number(page) || 1
  }
}
