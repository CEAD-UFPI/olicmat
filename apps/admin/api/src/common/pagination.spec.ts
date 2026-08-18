import { getSkipTake, paginate } from "./pagination.js";

describe("Pagination", () => {
  describe("getSkipTake", () => {
    it("returns default skip/take when no params", () => {
      expect(getSkipTake({})).toEqual({ skip: 0, take: 20 });
    });

    it("calculates skip correctly for page 2", () => {
      expect(getSkipTake({ page: 2, limit: 10 })).toEqual({ skip: 10, take: 10 });
    });

    it("calculates skip correctly for page 3 with limit 5", () => {
      expect(getSkipTake({ page: 3, limit: 5 })).toEqual({ skip: 10, take: 5 });
    });
  });

  describe("paginate", () => {
    it("returns correct metadata", () => {
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = paginate(data, 30, { page: 1, limit: 10 });

      expect(result).toEqual({
        data,
        total: 30,
        page: 1,
        limit: 10,
        totalPages: 3,
      });
    });

    it("calculates totalPages correctly with remainder", () => {
      const data = [{ id: 1 }];
      const result = paginate(data, 21, { page: 1, limit: 10 });

      expect(result.totalPages).toBe(3);
    });
  });
});
