import { KnexTransactionAdapter } from "../../../../src/infrastructure/adapters/knex/KnexTransactionAdapter";
import { KnexQueryBuilderAdapter } from "../../../../src/infrastructure/adapters/knex/KnexQueryBuilderAdapter";

describe("KnexTransactionAdapter", () => {
  let transactionMock: jest.Mocked<any>;
  let adapter: KnexTransactionAdapter;

  beforeEach(() => {
    transactionMock = {
      commit: jest.fn(),
      rollback: jest.fn(),
      table: jest.fn(),
    };

    adapter = new KnexTransactionAdapter(transactionMock);
  });

  it("should call commit on the transaction", async () => {
    await adapter.commit();
    expect(transactionMock.commit).toHaveBeenCalled();
  });

  it("should call rollback on the transaction", async () => {
    await adapter.rollback();
    expect(transactionMock.rollback).toHaveBeenCalled();
  });

  it("should return a KnexQueryBuilderAdapter instance when table is called", () => {
    const tableName = "test_table";
    const queryBuilderMock = {};
    transactionMock.table.mockReturnValueOnce(queryBuilderMock);

    const result = adapter.table(tableName);

    expect(transactionMock.table).toHaveBeenCalledWith(tableName);
    expect(result).toBeInstanceOf(KnexQueryBuilderAdapter);
  });

  it("should throw an error if commit fails", async () => {
    transactionMock.commit.mockRejectedValueOnce(new Error("Commit failed"));

    await expect(adapter.commit()).rejects.toThrow("Commit failed");
  });

  it("should throw an error if rollback fails", async () => {
    transactionMock.rollback.mockRejectedValueOnce(new Error("Rollback failed"));

    await expect(adapter.rollback()).rejects.toThrow("Rollback failed");
  });
});
