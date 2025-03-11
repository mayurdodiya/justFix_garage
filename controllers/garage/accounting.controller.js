const { PaymentsModel, WithdrawRequestsModel, GarageModel, AppointmentsModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const { WITHDRAW_REQUESTS_STATUS, APPOINTMENT_STATUS, PAYMENT_STATUS } = require("../../utils/constant.js");
const MESSAGE = require("../../utils/message.js");

module.exports = {
  // garage can withdraw money from wallet to his bank account
  sendWithdrawRequest: async (req, res) => {
    try {
      const garageId = req.params.id;
      const { withdraw_amount } = req.body;

      const garageExist = await GarageModel.findOne({ _id: garageId, is_delete: false });
      if (!garageExist) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This Garage") });
      }

      // const isOldReqExist = await WithdrawRequestsModel.findOne({ garage_id: garageId, status: WITHDRAW_REQUESTS_STATUS.REQUESTED });
      // if (isOldReqExist) {
      //   return apiResponse.DUPLICATE_VALUE({ res, message: MESSAGE.REQUEST_ALREADY_EXISTS });
      // }

      if (garageExist.wallet_amount < req.body.withdraw_amount) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.INSUFFICIENT_BALANCE });
      }

      // check pending amount money
      const appointment = await AppointmentsModel.find({ garage_id: garageId, status: { $ne: APPOINTMENT_STATUS.COMPLETED } }).populate("appointment_services");
      console.log(appointment);
      let totalReserveAmountOfAppointments = 0;
      appointment.map((data) => {
        data.appointment_services.map((item) => {
          if (item.payment.payment_status == PAYMENT_STATUS.CAPTURE) {
            totalReserveAmountOfAppointments += item.net_amount;
          }
        });
      });
      const garageWalletBalance = garageExist.wallet_amount;
      const canWithdraw = garageWalletBalance - totalReserveAmountOfAppointments;
      const validWithdrawAmount = canWithdraw < 0 ? 0 : canWithdraw;

      console.log(canWithdraw, "------------------------- canWithdraw", garageWalletBalance);
      // working from here ********************
      if (validWithdrawAmount < withdraw_amount) {
        return apiResponse.BAD_REQUEST({ res, message: "You can withdraw only " + Number(validWithdrawAmount.toFixed(3)) + ", because running appointment reserve balance is " + totalReserveAmountOfAppointments + ", and your current wallet balance is " + garageWalletBalance });
      }
      return;

      const sendReq = await WithdrawRequestsModel.create({
        garage_id: garageId,
        withdraw_amount: req.body.withdraw_amount,
        status: WITHDRAW_REQUESTS_STATUS.REQUESTED,
      });

      return apiResponse.OK({ res, message: MESSAGE.SENT_REQUEST("Withdraw request"), data: sendReq });
    } catch (error) {
      console.log("🚀 ~ sendWithdrawRequest: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // view wallet transaction history
  viewWalletTransactionHistory: async (req, res) => {
    try {
      const garageId = req.params.id;
      const populate = [{ path: "appointment_service_id" }, { path: "withdraw_request_id" }];
      const data = await PaymentsModel.find({ garage_id: garageId }).populate(populate);
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Wallet transaction history"), data });
    } catch (error) {
      console.log("🚀 ~ viewWalletTransactionHistory: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
