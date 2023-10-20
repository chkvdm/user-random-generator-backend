import UsersService from '../services/usersService.js';
const usersService = new UsersService();

export default class UsersController {
  async getUsers(req, res, next) {
    try {
      const { seed, pageNumber, count, region, errorCount } = req.query;
      const users = await usersService.getUsersRow(
        seed,
        pageNumber,
        count,
        region,
        errorCount
      );
      const maxTotalRowCount = 10000000;
      const usersCleanRows = users.map((el) => ({
        id: el.id,
        fullName: `${el.firstName} ${el.lastName}`,
        address: `${el.zipCode}, ${el.city}, ${el.address}`,
      }));
      return res.status(200).json({
        data: usersCleanRows,
        meta: {
          totalRowCount: maxTotalRowCount,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
