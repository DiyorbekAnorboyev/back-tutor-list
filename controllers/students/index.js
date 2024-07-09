const { Router } = require("express");
const Student = require("../../models/student");
const Users = require("../../models/User");
const puppeteer = require("puppeteer");
const { MongoClient, GridFSBucket } = require("mongodb");
const multer = require("multer");
const {
  nameToString,
  generateQR,
  sumToFormat,
  nowDate,
} = require("../../utils/essentialFunctions");

const router = Router();

router.get("/Student", async (req, res) => {
  const { userId } = req.decodedToken;
  const ownerId = userId;
  try {
    const data = await Student.find({ ownerId });
    if (data) {
      res.send(data);
    }
  } catch (error) {
    res.send(error);
  }
});

router.post("/Student", async (req, res) => {
  const { userId } = req.decodedToken;
  const { firstName, lastName, groupId, groupName, paidDate, sum } = req.body;
  const ownerId = userId;

  const newUser = await Student.create({
    ownerId,
    firstName,
    lastName,
    existGroup: {
      groupId,
      groupName,
    },
    paid: {
      paidDate,
      sum,
    },
  });

  await newUser.save();

  res.send("Create");
});

router.delete("/oneStudentDelete/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const data = await Student.findByIdAndDelete({ _id });
    if (data) {
      res.send("Sucess deleted");
    }
  } catch (error) {
    res.send(error);
  }
});

const mongoURI = process.env.MONGOURL;

const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let gfs;

async function initializeMongoDB() {
  try {
    await client.connect();
    const db = client.db("myDatabase");
    gfs = new GridFSBucket(db, { bucketName: "uploads" });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

initializeMongoDB();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/pdf", upload.single("file"), async (req, res) => {
  const { userId } = req.decodedToken;
  const { sum, studentName } = req.body;

  try {
    const data = await Users.findOne({ _id: userId });
    const fileName = `${nameToString(studentName)}.pdf`;
    const uploadStream = gfs.openUploadStream(fileName);
    const qrCode = await generateQR(
      `https://checks-list.onrender.com/file/${uploadStream.id}`
    );

    const html = `
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossorigin="anonymous"></script>

     <div class="w-75 d-flex justify-content-center border border-dark border-2 rounded-3 p-3 m-3">
        <div class=" ">
            <div class="d-flex justify-content-center text-bold text-uppercase font-monospace"><h3>${
              data.tutorName
            }</h3></div>
            <div class="d-flex justify-content-center text-bold text-capitalize "><h5>${studentName}</h5></div>
            <div class="d-flex justify-content-center "><h1>${sumToFormat(
              sum
            )} UZS</h1></div>
            <div class="d-flex justify-content-between align-items-center px-3">
                <div><h5 class="text-capitalize">${nowDate()}</h5></div>
                <div class="w-50 d-flex justify-content-end">
                <img class="w-50" src="${qrCode}"/></div>
            </div>
        </div>
    </div>`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ printBackground: true });

    await browser.close();

    uploadStream.end(pdfBuffer);

    uploadStream.on("finish", () => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${nameToString(studentName)}.pdf`
      );
      res.setHeader("Content-Length", pdfBuffer.length);

      res.send(pdfBuffer);
    });

    uploadStream.on("error", (err) => {
      res.status(500).json({ error: "Error uploading file" });
    });
  } catch (error) {
    res.status(500).send("Error generating PDF");
  }
});

module.exports = router;
