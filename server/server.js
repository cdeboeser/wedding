const express = require("express");
const cors = require("cors");
const path = require("path");
const Airtable = require("airtable");
require("dotenv").config();

const app = express();

const BASE_ID = process.env.BASE_ID;
const API_KEY = process.env.API_KEY;
const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);

const isUndefined = (variable) => typeof variable === "undefined";

const getSingleRecord = async (inviteId) => {
  const results = await base("Invitations").select({ maxRecords: 100 });
  const records = await results.all();

  const filteredRecord = records.filter(
    (e) => e.fields["Invite Id"] === inviteId
  );

  if (filteredRecord.length === 0) return null;

  return filteredRecord[0];
};

const wrap = (fn) => async (req, res) => {
  try {
    return await fn(req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something went wrong." });
  }
};

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
  return res.status(200).json({ status: "ok", userId: req.userId });
});

app.get(
  "/api/invites/:inviteId",
  wrap(async (req, res) => {
    const { inviteId } = req.params;
    const record = await getSingleRecord(inviteId);

    if (!record) {
      return res.status(404).json({ msg: "No invite with that id." });
    }

    const response = {
      id: record.id,
      name: record.fields["Name"],
      attending: record.fields["Attending"],
      dietary: record.fields["Dietary"],
    };

    if (record.fields["Guest 1"]) {
      response["guest1"] = {
        attending: record.fields["G1 Attending"],
        name: record.fields["Guest 1"],
        choice: record.fields["G1 Food"],
      };
    }

    if (record.fields["Guest 2"]) {
      response["guest2"] = {
        attending: record.fields["G2 Attending"],
        name: record.fields["Guest 2"],
        choice: record.fields["G2 Food"],
      };
    }

    return res.status(200).json(response);
  })
);

app.put(
  "/api/invites/:inviteId",
  wrap(async (req, res) => {
    const { inviteId } = req.params;
    const { attending, guest1, guest2 } = req.body;
    const record = await getSingleRecord(inviteId);

    if (!record) {
      return res.status(404).json({ msg: "No invite with that id." });
    }

    const updateFields = {};

    updateFields["Attending"] = attending ? "Yes" : "No";

    if (!isUndefined(guest1)) {
      updateFields["G1 Attending"] = guest1.attending;
      updateFields["G1 Food"] = guest1.choice;
    }

    if (!isUndefined(guest2)) {
      updateFields["G2 Attending"] = guest2.attending;
      updateFields["G2 Food"] = guest2.choice;
    }

    await base("Invitations").update([
      {
        id: record.id,
        fields: updateFields,
      },
    ]);

    return res.status(200).send("ok");
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./build/index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
