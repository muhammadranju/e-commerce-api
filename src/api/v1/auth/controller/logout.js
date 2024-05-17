const ApiResponse = require("../../../../utils/ApiResponse");
const asyncHandler = require("../../../../utils/asyncHandler");

const logoutController = asyncHandler(async (req, res) => {
  // Clear user cookies from the browser
  res.clearCookie("access_token", { expires: new Date(0) });

  // HATEOAS links
  const host = req.apiHost;
  const links = [
    {
      rel: "login",
      href: `${host}/auth/login`,
      method: "POST",
      description: "Login",
    },
  ];

  // Respond with a success message for logout
  return res
    .status(200)
    .json(
      new ApiResponse(
        204,
        { content: "204 No Content" },
        links,
        "You are now logout successfully."
      )
    );
});

module.exports = logoutController;
