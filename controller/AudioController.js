const prisma = require("../database");
const { diskStorage } = require("multer");
const { join } = require("path");
const { existsSync } = require("fs");
const multer = require("multer");

class AudioController {
  async getAudioFile(req, res) {
    const { filename } = req.params;

    const sound = await prisma.sonido.findFirst({
      where: {
        userId: req.session.passport.user,
        file: `/uploads/${filename}`,
      },
    });

    if (!sound) return res.redirect("/");

    const file = join(__dirname, "..", sound.file);

    if (!existsSync(file)) return res.send({ message: "File not found" });

    res.sendFile(file);
  }

  async getUserAudios(req, res) {
    const userAudios = await prisma.sonido.findMany({
      where: {
        userId: req.session.passport.user,
      },
    });

    const audios = [];

    userAudios.forEach((audio) => {
      const file = join(__dirname, "..", audio.file);

      if (!existsSync(file)) return;

      audios.push({
        filename: audio.file.split("/")[2],
        name: audio.name,
      });
    });

    res.send(audios);
  }

  async upload(req, res) {
    const storage = diskStorage({
      destination: "./uploads",
      filename: async (req, file, cb) => {
        let [filename, ext] = file.originalname.split(".");
        filename += `-${req.session.passport.user}`;

        const _file = await prisma.sonido.create({
          data: {
            file: `/uploads/${filename}.${ext}`,
            userId: req.session.passport.user,
            name: filename,
          },
        });

        cb(null, `${filename}.${ext}`);
        res.redirect("back");
      },
    });

    const upload = multer({ storage }).any();

    upload(req, res, (err) => console.log(err));
  }
}

module.exports = new AudioController();
