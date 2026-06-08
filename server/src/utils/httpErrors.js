const sendClientError = (res, status, message) =>
  res.status(status).json({
    success: false,
    message,
  });

const sendServerError = (res) =>
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again later.",
  });

module.exports = {
  sendClientError,
  sendServerError,
};
