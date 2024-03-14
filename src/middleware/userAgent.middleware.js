function userAgent(req, res, next) {
  try {
    const reqHeaders = req.headers["user-agent"].toLowerCase();
    if (
      !reqHeaders.includes("windows") &&
      !reqHeaders.includes("android") &&
      !reqHeaders.includes("iphone;") &&
      !reqHeaders.includes("aarch64;")
    ) {
      console.log(req.headers["user-agent"]);
      return res.status(200).json({
        message: "Access declined",
        // error: {
        //   userAgent: req.headers["user-agent"],
        //   message: "This user agent not supported!",
        // },
      });
    }
    return next();
  } catch (error) {
    next(error);
  }
}

module.exports = userAgent;
