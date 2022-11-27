const { PrismaClient } = require('@prisma/client')
const express = require("express")
const cors = require("cors")
const multer = require("multer");
const path = require("path");
const fs = require("fs")
const Handlebars = require("handlebars");

const prisma = new PrismaClient()

const app = express()

app.use(cors({
    origin: "*"
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/upload-file", (req, res) => {
    const storage = multer.diskStorage({
        destination: "./uploads",
        filename: async (req, file, cb) => {
            let [filename, ext] = file.originalname.split(".")
            filename += `-${res.locals.userId}`

            const _file = await prisma.sonido.create({
                data: {
                    file: `/uploads/${filename}.${ext}`,
                    userId: 1,
                    name: filename,
                }
            })
    
            cb(null, `${filename}.${ext}`)
        }
    })
    const upload = multer({ storage }).any();

    upload(req, res, (err) => console.log(err))
    // OBTENER USUARIO

    // SI NO HAY USUARIO -> MANDARLO A LA MIERDA

})

app.get("/audio/:filename", (req, res) => {
    const { filename } = req.params
    const file = path.join(__dirname, `/uploads/${filename}`)

    if(!fs.existsSync(file)) res.send({ message: "File not found"})

    res.sendFile(file)
})

app.get("/audios", async (req,res) => {
    const userAudios = await prisma.sonido.findMany({
        where: {
            userId: 1
        }
    })

    const audios = []

    userAudios.forEach(audio => {
        const file = path.join(__dirname, audio.file)
        if(!fs.existsSync(file)) return;
        
        audios.push(
            {
                filename: audio.file.split("/")[2],
                name: audio.name

            });
    })

    res.send(audios)
})

app.listen(4000, () => {
    console.log("Listening...")
})

