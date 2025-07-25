const cron = require("node-cron");
const { bookingOrderModel } = require("./models/userModel"); // Adjust path as needed
const axios = require("axios");

// Function to check reports and update status
const checkReportsAndUpdateStatus = async () => {
  try {
    // Get all bookings that are not yet completed (status 0)
    const pendingBookings = await bookingOrderModel.find({
      bookingStatus: 0,
      memberId: { $exists: true, $ne: null },
      bill_no: { $exists: true, $ne: null },
    });

    for (const booking of pendingBookings) {
      try {
        const formData = new FormData();
        formData.append("empId", "KLR099101");
        formData.append("secretKey", "KLR@74123");
        formData.append("member_id", booking.memberId);
        formData.append("bill_no", booking.bill_no);

        const response = await axios.post(
          "https://medicityguwahati.in/klar_diag/api/getReport/",
          formData
        );

        const result = response.data.response[0];

        if (result.status === "success" && result.url) {
          // Report is available, update status to completed (1)
          await bookingOrderModel.findByIdAndUpdate(booking._id, {
            $set: {
              bookingStatus: 1,
              report: result.url,
            },
          });
          console.log(`Updated booking ${booking._id} to completed status`);
        }
      } catch (error) {
        console.error(
          `Error checking report for booking ${booking._id}:`,
          error.message
        );
        // Continue with next booking even if one fails
      }
    }
  } catch (error) {
    console.error("Error in report check cron job:", error.message);
  }
};

// Schedule the cron job to run every hour (adjust as needed)
const setupReportCheckCron = () => {
  // Runs at the start of every hour
  cron.schedule("0 * * * *", checkReportsAndUpdateStatus);

  console.log("Report check cron job scheduled to run hourly");
};

module.exports = {
  checkReportsAndUpdateStatus,
  setupReportCheckCron,
};
