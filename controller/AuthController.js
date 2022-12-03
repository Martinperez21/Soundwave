const prisma = require("../database");
const bcrypt = require("bcrypt");

class AuthController {
  async login(username, password, done) {
    const {
      password: passwd,
      id,
      ..._
    } = await prisma.usuario.findFirst({
      where: {
        username,
      },
    });

    if (!id) return done(null, false);

    const validPassword = await bcrypt.compare(password, passwd);

    if (!validPassword) return done(null, false);

    return done(null, { id });
  }

  async register(req, res) {
    console.log(req.body);
    const { username, password } = req.body;

    if (!username || !password) res.redirect("/login");

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.usuario.create({
      data: {
        username,
        password: hash,
      },
    });

    if (!user) res.redirect("/login");

    res.redirect("/login");
  }
}

module.exports = new AuthController();
