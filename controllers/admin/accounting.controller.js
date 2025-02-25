const { PaymentsModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");

module.exports = {
  // count of all sales ammount by (daily, weekly, monthly)
  countTotalSalesAmmount: async (req, res) => {
    try {
      const { start_date, end_date } = req.query;
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      let totalSales = await PaymentsModel.aggregate([
        {
          $match: { created_at: { $gte: startDate, $lte: endDate } },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            total_amount: "$total",
          },
        },
      ]);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Total sales amount data"), data: totalSales[0] || { total_amount: 0 } });
    } catch (error) {
      console.log("🚀 ~ countAllSalesAmmount: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
