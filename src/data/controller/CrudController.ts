import {NextRequest, NextResponse} from "next/server";
import {QueryOptions, UpdateQuery} from "mongoose";
import SingletonService from "@tan/data/service/SingletonService";
import CrudService from "@tan/data/service/CrudService";
import {PageOptions, Params} from "@tan/data/interface/CommonInterfaces";

class CrudController<Entity, NewEntity, UpdateEntity extends UpdateQuery<Entity>> extends SingletonService<CrudController<Entity, NewEntity, UpdateEntity>> {
  service: CrudService<Entity, NewEntity, UpdateEntity>;
  
  protected constructor(service: CrudService<Entity, NewEntity, UpdateEntity>) {
    super();
    this.service = service;
  }
  
  async findAll(req: NextRequest): Promise<NextResponse> {
    try {
      const results = await this.service.findAll({ page: PageOptions(req) });
      return NextResponse.json(results);
    } catch (error) {
      console.error("Unexpected error", error);
      return NextResponse.json({ message: "Unexpected error occurred", error: error }, { status: 500 });
    }
  }
  
  async findById(options: QueryOptions<Entity>): Promise<NextResponse> {
    try {
      const data = await this.service.findById(options?.id!);
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      console.error("Unexpected error", error);
      return NextResponse.json({ message: "Unexpected error occurred", error: error }, { status: 500 });
    }
  }
  
  async create(req: NextRequest): Promise<NextResponse> {
    try {
      const request: NewEntity = await req.json();
      const data = this.service.create(request);
      return NextResponse.json({ message: `${this.service.name} created successfully`, data }, { status: 201 });
    } catch (error) {
      console.error("Unexpected error", error);
      return NextResponse.json({ message: "Unexpected error occurred", error: error }, { status: 500 });
    }
  }
  
  async updateById(req: NextRequest, params: Params): Promise<NextResponse> {
    try {
      const request: UpdateEntity = await req.json();
      const data = await this.service.update(params.id, request);
      return NextResponse.json({ data }, { status: 200 })
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: error }, { status: 500 });
    }
  }
  
  async deleteById(req: NextRequest, params: Params): Promise<NextResponse> {
    try {
      const data = await this.service.delete(params.id);
      return NextResponse.json({ data });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: error }, { status: 500 });
    }
  }
  
  async seed(req: NextRequest): Promise<NextResponse> {
    try {
      const options = await req.json();
      const data = await this.service.seed(options);
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: error }, { status: 500 });
    }
  }
  
  private handleError(error: any): NextResponse {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export default CrudController;