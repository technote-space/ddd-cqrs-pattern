import type { Table } from '$/server/shared/database';
import MigrationUseCase from '^/usecase/migrationUseCase';

describe('MigrationUseCase', () => {
  it('存在しないテーブルが作成される', async () => {
    const mockListTables = jest.fn(() => Promise.resolve([
      { id: 'test1', table: 'test1', columns: [] },
      { id: 'test2', table: 'test2', columns: [] },
    ] as Table[]));
    const mockCreateTable = jest.fn((table: string) => Promise.resolve({ table } as Table));
    const spyConsoleLog = jest.spyOn(global.console, 'log').mockImplementation();

    const useCase = new MigrationUseCase([
      { table: 'test1', columns: [] },
      { table: 'test3', columns: [] },
    ], {
      listTables: mockListTables,
      createTable: mockCreateTable,
    } as never);

    await useCase.invoke();

    expect(spyConsoleLog).toHaveBeenCalledTimes(5);
    expect(spyConsoleLog.mock.calls[0]).toEqual(['tables:', ['test1', 'test2']]);
    expect(spyConsoleLog.mock.calls[1]).toEqual(['create tables:', ['test3']]);
    expect(spyConsoleLog.mock.calls[2]).toEqual([]);
    expect(spyConsoleLog.mock.calls[3]).toEqual(['creating...', 'test3']);
    expect(spyConsoleLog.mock.calls[4]).toEqual(['created!']);
    expect(mockListTables).toHaveBeenCalledTimes(1);
    expect(mockCreateTable).toHaveBeenCalledTimes(1);
    expect(mockCreateTable.mock.calls[0]).toEqual(['test3']);
  });
});
