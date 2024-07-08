const { Router } = require("express");
const Student = require("../../models/student");
const puppeteer = require("puppeteer");
const fs = require("fs");

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

router.get("/pdf", async (req, res) => {
  const { userId } = req.decodedToken;

  try {
    const html = `<h1>Hello world</h1>`;

    if (!html) {
      return res.status(400).send("HTML content is required");
    }

    // Launch a headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the content of the page to the provided HTML
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF from the HTML content
    const pdfBuffer = await page.pdf({
      printBackground: true, // Print background graphics
    });

    // Close the browser
    await browser.close();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${userId}.pdf`);
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send the PDF file as response
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

module.exports = router;
