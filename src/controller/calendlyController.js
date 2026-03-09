const { listAvailabilitySchedules, getAccessToken } = require("../services/calendlyServices");

const calendlyListAvailabilitySchedules = async (req, res) => {
  try {
    const response = await listAvailabilitySchedules();
    console.log("response", response);
    res.status(200).json({
      status: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message:
        error.message || "An error occurred while processing the request",
    });
  }
};

const calendlygetAccessToken = async (req, res) => {
  try {
    const response = await getAccessToken();
    console.log("response", response);
    res.status(200).json({
      status: true,
      data: response,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      status: false,
      message:
        error.message || "An error occurred while processing the request",
    });
  }
};

module.exports = {
  calendlyListAvailabilitySchedules,
  calendlygetAccessToken,
};
