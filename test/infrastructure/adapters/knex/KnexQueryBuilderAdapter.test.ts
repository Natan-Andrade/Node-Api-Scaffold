import { Knex } from "knex";
import { KnexQueryBuilderAdapter } from "../../../../src/infrastructure/adapters/knex/KnexQueryBuilderAdapter";

describe("KnexQueryBuilderAdapter", () => {
  let queryBuilderMock: jest.Mocked<Knex.QueryBuilder<any, any[]>>;
  let adapter: KnexQueryBuilderAdapter<any>;

  beforeEach(() => {
    queryBuilderMock = {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      first: jest.fn(),
    } as unknown as jest.Mocked<Knex.QueryBuilder<any, any[]>>;

    adapter = new KnexQueryBuilderAdapter(queryBuilderMock);
  });

  it("should call select with correct columns", () => {
    const columns = ["column1", "column2"];
    adapter.select(...columns);
    expect(queryBuilderMock.select).toHaveBeenCalledWith(...columns);
  });

  it("should call insert with correct data and return inserted rows", async () => {
    const data = [{ key: "value" }];
    const insertedRows = [{ id: 1, key: "value" }];
    
    queryBuilderMock.insert.mockReturnValueOnce(Promise.resolve(insertedRows) as any); // Corrige a simulação para retornar os dados
  
    const result = await adapter.insert(data);
    expect(queryBuilderMock.insert).toHaveBeenCalledWith(data as any);
    expect(result).toEqual(insertedRows);
  });
  

  it("should call update with correct data and return affected rows count", async () => {
    const data = { key: "newValue" };
    const affectedRows = 1;
    queryBuilderMock.update.mockResolvedValue(affectedRows);

    const result = await adapter.update(data);
    expect(queryBuilderMock.update).toHaveBeenCalledWith(data as any);
    expect(result).toEqual(affectedRows);
  });

  it("should call update with column, value, and data and return affected rows count", async () => {
    const data = { key: "newValue" };
    const affectedRows = 1;
    queryBuilderMock.update.mockResolvedValue(affectedRows);

    const result = await adapter.update(data, "id", 123);
    expect(queryBuilderMock.where).toHaveBeenCalledWith("id", 123);
    expect(queryBuilderMock.update).toHaveBeenCalledWith(data as any);
    expect(result).toEqual(affectedRows);
  });

  it("should call delete and return affected rows count", async () => {
    const affectedRows = 1;
    queryBuilderMock.delete.mockResolvedValue(affectedRows);

    const result = await adapter.delete();
    expect(queryBuilderMock.delete).toHaveBeenCalledTimes(1);
    expect(result).toEqual(affectedRows);
  });

  it("should call delete with column and value and return affected rows count", async () => {
    const affectedRows = 1;
    queryBuilderMock.delete.mockResolvedValue(affectedRows);

    const result = await adapter.delete("id", 123);
    expect(queryBuilderMock.where).toHaveBeenCalledWith("id", 123);
    expect(queryBuilderMock.delete).toHaveBeenCalledTimes(1);
    expect(result).toEqual(affectedRows);
  });

  it("should call where with a condition object", () => {
    const condition = { key: "value" };
    adapter.where(condition);
    expect(queryBuilderMock.where).toHaveBeenCalledWith(condition);
  });

  it("should call where with a column and value", () => {
    adapter.where("id", 123);
    expect(queryBuilderMock.where).toHaveBeenCalledWith("id", 123);
  });

  it("should call first and return the first record", async () => {
    const firstRecord = { id: 1, key: "value" };
    queryBuilderMock.first.mockResolvedValueOnce(firstRecord);

    const result = await adapter.first();
    expect(queryBuilderMock.first).toHaveBeenCalled();
    expect(result).toEqual(firstRecord);
  });

});