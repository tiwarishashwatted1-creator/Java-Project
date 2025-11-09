import express from "express";
import { auth } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import Student from "../models/Student.js";
import { stringify } from "csv-stringify/sync";
import { create } from "xmlbuilder2";

const router = express.Router();

router.get("/export.csv", auth, permit("admin"), async (req, res) => {
  const filter = buildFilter(req.query);
  const rows = await Student.find(filter).lean();
  const csv = stringify(rows.map(r => ({
    firstName: r.firstName, lastName: r.lastName, email: r.email,
    course: r.course, year: r.year, status: r.status
  })), { header: true });
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=students.csv");
  res.send(csv);
});

router.get("/export.xml", auth, permit("admin"), async (req, res) => {
  const filter = buildFilter(req.query);
  const rows = await Student.find(filter).lean();
  const root = create({ version: "1.0" }).ele("students");
  rows.forEach(r => {
    root.ele("student")
        .ele("firstName").txt(r.firstName).up()
        .ele("lastName").txt(r.lastName).up()
        .ele("email").txt(r.email).up()
        .ele("course").txt(r.course).up()
        .ele("year").txt(String(r.year)).up()
        .ele("status").txt(r.status).up()
      .up();
  });
  const xml = root.end({ prettyPrint: true });
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Content-Disposition", "attachment; filename=students.xml");
  res.send(xml);
});

function buildFilter(q) {
  const filter = {};
  if (q.course) filter.course = q.course;
  if (q.status) filter.status = q.status;
  if (q.year) filter.year = Number(q.year);
  return filter;
}

export default router;
