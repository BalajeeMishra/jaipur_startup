const t = require("tesseract.js");

module.exports.imageverification = (req, res, roomcode) => {
  //this will not happen in general
  // there is no roomcode then.
  if (!roomcode) {
    return res.status(200).json({
      message: "Roomcode not found in database for this game,",
    });
  }

  t.recognize(`./public/images/${req.file.filename}`, "eng", {
    logger: (m) => console.log(m),
  }).then(({ data: { text } }) => {
    // if both matched.
    // text.includes(`Room Code : ${roomcode}`
    if (
      text.includes("Congratulations!") &&
      text.includes(`Room Code : ${roomcode}`)
    ) {
      return res.status(202).json({ message: "yeah got it" });
    } else if (
      text.includes("Congratulations!") &&
      !text.includes(`Room Code : ${roomcode}`)
    ) {
      return res.status(200).json({
        message:
          "Please don't enter old images or wrong one,Enter the recent one or correct one",
      });
    } else {
      return res.status(200).json({ message: "no data found" });
    }
  });
};
module.exports.codeVerification = async (req) => {
  const response = await t.recognize(
    `./public/images/${req.file.filename}`,
    "eng"
  );
  const text = response.data.text;
  if (text.includes("Congratulations!")) {
    console.log(text.slice(text.indexOf("Code") + 7, 236));
    return text.slice(text.indexOf("Code") + 7, 236);
  }
};
