const prisma = require("../database");

const deserializeUser = async (id, done) => {
  const { password, ...user } = await prisma.usuario.findUnique({
    where: {
      id,
    },
  });

  if (!user) return done(null, false);

  return done(null, user);
};

module.exports = deserializeUser;
