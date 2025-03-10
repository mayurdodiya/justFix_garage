const { PAYMENT_STATUS } = require("./constant");

module.exports = {
  modifyGetAppointmentServiceList: async (response) => {
    const totalBill = response.appointment_services.data.reduce((sum, item) => {
      return sum + (item?.payments[0]?.amount || 0);
    }, 0);

    return {
      appointment_data: {
        _id: response.appointment_data._id,
        description: response.appointment_data.description,
        status: response.appointment_data.status,
        user_data: {
          _id: response.appointment_data.user_id._id,
          full_name: response.appointment_data.user_id.full_name,
          email: response.appointment_data.user_id.email,
          phone_no: response.appointment_data.user_id.phone_no,
        },
        garage_data: {
          _id: response.appointment_data.garage_id._id,
          garage_name: response.appointment_data.garage_id.garage_name,
          email: response.appointment_data.garage_id.user_id.email,
          phone_no: response.appointment_data.garage_id.user_id.phone_no,
        },
        vehicle_data: {
          id: response.appointment_data.vehicle_id._id,
          vehicle_type: response.appointment_data.vehicle_id.vehicle_type,
          company: response.appointment_data.vehicle_id.company,
          model_name: response.appointment_data.vehicle_id.model_name,
          year: response.appointment_data.vehicle_id.year,
          license_plate: response.appointment_data.vehicle_id.license_plate,
          company: response.appointment_data.vehicle_id.company,
        },
      },
      appointment_services: {
        total_record: response.appointment_services.total_record,
        total_bill: totalBill,
        data: response.appointment_services.data.map((item) => {
          return {
            _id: item?._id,
            appointment_id: item?.appointment_id,
            service_name: item?.garage_service_id?.service_id?.service_name,
            user_approval: item?.user_approval,
            service_charge: item?.payments[0]?.amount,
            transaction_id: item?.payments[0]?.transaction_id,
          };
        }),
        total_page: response.appointment_services.total_page,
        currentPage: response.appointment_services.currentPage,
      },
    };
  },
  modifyAppointmentForCustomerInvoice: async (response) => {
    const totalBill = response.appointment_services.reduce((sum, item) => {
      let sumAmount = item?.net_amount
      if (item?.payment?.payment_status !== PAYMENT_STATUS.CAPTURE) {
        sumAmount = 0
      } 
      return sum + (sumAmount || 0);
    }, 0);
    return {
      appointment_data: {
        _id: response._id,
        description: response.description,
        status: response.status,
        user_data: {
          _id: response.user_id._id,
          full_name: response.user_id.full_name,
          email: response.user_id.email,
          phone_no: response.user_id.phone_no,
        },
        garage_data: {
          _id: response.garage_id._id,
          garage_name: response.garage_id.garage_name,
          email: response.garage_id.user_id.email,
          phone_no: response.garage_id.user_id.phone_no,
        },
        vehicle_data: {
          id: response.vehicle_id._id,
          company: response.vehicle_id.company,
          model_name: response.vehicle_id.model_name,
          license_plate: response.vehicle_id.license_plate,
          fuel_type: response.vehicle_id.fuel_type,
        },
      },
      appointment_services: response.appointment_services.map((item) => {
        return {
          _id: item?._id,
          appointment_id: item?.appointment_id,
          user_approval: item?.user_approval,
          service_amount: item?.service_amount,
          discount: item?.discount,
          net_amount: item?.net_amount,
          payment_status: item?.payment?.payment_status,
          transaction_id: item?.payment?.transaction_id,
          service_name: item.garage_services.map((item) => {
            let stringArr = [];
            stringArr.push(`${item?.garage_service_id?.service_id?.service_name} at ₹${item?.garage_service_price}`);
            return stringArr.join(", ");
          }),
        };
      }),
      total_bill: totalBill,
    };
  },
};
