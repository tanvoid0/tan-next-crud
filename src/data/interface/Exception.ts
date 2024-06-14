
class Exception extends Error {
  status: number;
  properties: object | null;
  
  constructor(name: string, message: string, status: number, properties: object | null) {
    super(message);
    this.name = name;
    this.message = message;
    this.status = status || 500;
    this.properties = properties;
  }
  
  static NotFoundException(name: string, id: number | string): Exception {
    return new Exception(
      `${name}NotFound`,
      `${name} with id=${id} does not exist.`,
      404,
      {id}
    )
  }
}

export default Exception;