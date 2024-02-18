const jsonwebtoken = require("jsonwebtoken");
const { unauthorize } = require("../handlers/reponse");
const User = require("../models/user");

const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];

      return jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
    }

    return false;
  } catch {
    return false;
  }
};

const auth = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);

  if (!tokenDecoded) return unauthorize(res);

  const user = await User.findById(tokenDecoded.data);

  if (!user) return unauthorize(res);

  req.user = user;

  next();
};

module.exports = {
  tokenDecode,
  auth,
};
