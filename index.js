require("dotenv").config()

const express = require("express");
const joi = require("joi");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors")

const app = express();
const port = 9000;

const postgreSql = process.env.DATABASE_CONNECTION;
const sequelize = new Sequelize(postgreSql);

sequelize.sync();

const Comments = sequelize.define(
  "comments",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
  }
);

app.use(express.json());
app.use(cors("*"))

const commentsBobyValidations = (payload) => {
  const scheme = joi.object({
    name: joi.string().required(),
    to: joi.string(),
    comment: joi.string().required(),
  });

  return scheme.validate(payload);
};

app.post("/comments", async (req, res) => {
  const { body } = req;
  console.log(req.body)
  console.log(body)

  const { error } = commentsBobyValidations(body);
  if (error)
    return res.status(400).send({
      message: "Nama dan pesan harus diisi",
    });

  try {
    await Comments.create(body);

    res.send({
      message: "Success"
    })
  } catch (error) {
    res.status(500).send({
      message: "Maaf terjadi kesalahan",
    });
  }
});

app.get("/comments", async (req, res) => {
  try {
    const results = await Comments.findAll();

    res.send({
      data: results.reverse(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Maaf terjadi kesalahan",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
