const express = require("express");
const t = require("tesseract.js");
const { upload } = require("../../helper/multer");
const router = express.Router();
const GameHistory = require("../../model/gamehistory");
const CategoryofBattle = require("../../model/admin/categoryofgame");
const CoinOfUser = require("../../model/purchaseofuser");

router.post("/addroomcode", async (req, res) => {
  const newGameEntry = await GameHistory.findOne({
    opponentuser: req.session.user_Id,
  });
  newGameEntry.gamedetail.roomcode = req.body.roomCode;
  await newGameEntry.save();
  return res.status(200).json({
    message: "start the game nowww",
  });
});

router.post("/waitingplayer", async (req, res) => {
  try {
    // following datas regarding category of battle is coming from client side.
    const { name, pricetoenter, numberofPlayers, waitingPlayer } = req.body;
    // we will check here in the given name of battle number of waiting user.
    const waitingPlayers = await CategoryofBattle.findOne({ name });
    const id = waitingPlayers?.waitinguser[0];
    // with the below condition we will check if coming user is not a waiting user then we will create a
    // gamehistory schema between them.
    if (waitingPlayers?.waitinguser.length > 0 && id != req.session.user_Id) {
      // if already a gamehistory is there and that was with false status and user trying to play
      // new game then delete that one or think about it something like no delete but do archive.
      //otherwise we will have problem because i dont know then how it will be find by themmmm... because
      // many statusofgame: false, might create problem for image precessing.

      // yaha humko payment wala bhi dekhna hoga kisis ko delete karne se pehle.
      const previousData = await GameHistory.findOneAndDelete({
        user: req.session.user_Id,
        statusofgame: false,
        "gamedetail.nameofbattle": name,
      });
      const newGameEntry = new GameHistory({
        user: req.session.user_Id,
      });
      newGameEntry.gamebetween.user = req.session.user_Id;
      newGameEntry.gamebetween.opponentuser = id;
      newGameEntry.opponentuser = id;
      newGameEntry.gamedetail.nameofbattle = name;
      newGameEntry.gamedetail.coinonhold = pricetoenter;
      await newGameEntry.save();
    } else {
      // in case of no waiting user is there inside given cattegory.
      const updateBattles = await CategoryofBattle.findOne({ name });
      const waitingusers = updateBattles?.waitinguser;
      // below if loop will update in case only in which someone is already waiting there
      // then we will increase waiting count with this  user
      if (!waitingusers?.includes(req.session.user_Id)) {
        const updateBattle = await CategoryofBattle.findOneAndUpdate(
          { name },
          {
            waitingPlayer: waitingPlayer + 1,
            numberofPlayers: numberofPlayers + 1,
          }
        );
        // updating the list of waitingusers inside battle schema.
        if (waitingusers) {
          updateBattles.waitinguser = [...waitingusers, req.session.user_Id];
        }
        await updateBattles?.save();
      }
    }
    // for matching purposeee
    // newGameEntry.gamedetail.nameofbattle
    const findingthematch = await GameHistory.findOne({
      user: req.session.user_Id,
      statusofgame: false,
      count: 0,
      "gamedetail.nameofbattle": name,
    });
    if (findingthematch) {
      // removing from waiting user as welll as we willl decrease waiting player by  1.
      findingthematch.sentthedetail = true;
      await findingthematch.save();
      return res.status(202).json({ findingthematch, user: "user" });
    }

    // for opponent purposeeee.
    const matchesforother = await GameHistory.findOne({
      opponentuser: req.session.user_Id,
      statusofgame: false,
      count: 0,
      "gamedetail.nameofbattle": name,
    });
    if (!findingthematch && matchesforother?.sentthedetail) {
      // taking here count so that one game can start once onlyy game start hone se pehle jb pehla user
      // aayega usko detail dene se pehle count ko update kar rahe hai jisse dobara se ye phir se na aayeee.
      matchesforother.count = 1;
      await matchesforother.save();
      const updateBattles = await CategoryofBattle.findOne({ name });
      const index = updateBattles.waitinguser.indexOf(req.session.user_Id);
      if (index > -1) {
        // only splice array when item is found
        updateBattles.waitinguser.splice(index, 1); // 2nd parameter means remove one item only
      }
      updateBattles.waitingPlayer = updateBattles.waitingPlayer
        ? updateBattles.waitingPlayer - 1
        : updateBattles.waitingPlayer;
      await updateBattles.save();
      // { opponentuser: req.session.user_Id }
      return res.status(202).json({ matchesforother, user: "opponentuser" });
    }
    // const count =0;
    return res.status(200).json({ message: "in loop" });
  } catch (e) {
    console.log(e);
  }
});

router.post("/giveittoadmin", async (req, res) => {
  return res.status(200).json({ message: "giving command to admin" });
});

router.get("/getroomcode", async (req, res) => {
  const getRoomcode = await GameHistory.findOne({ user: req.session.user_Id });
  if (getRoomcode?.gamedetail?.roomcode) {
    return res.status(202).json({ roomCode: getRoomcode.gamedetail.roomcode });
  }
  return res.status(200).json({ message: "no data found" });
});

router.post("/imageuploader", upload.single("gameimg"), async (req, res) => {
  // image processing means reading the imagess.
  const imageverification = (roomcode) => {
    t.recognize(`./public/images/${req.file.filename}`, "eng", {
      logger: (m) => console.log(m),
    }).then(({ data: { text } }) => {
      // if both matched.
      // text.includes(`Room Code : ${roomcode}`
      if (
        text.includes("Congratulations!") &&
        text.includes(`Room Code : ${roomcode}`)
      ) {
        return res.status(202).send("yeah got it");
      } else if (
        text.includes("Congratulations!") &&
        !text.includes(`Room Code : ${roomcode}`)
      ) {
        return res
          .status(200)
          .send(
            "Please don't enter old images or wrong one,Enter the recent one or say right"
          );
      } else {
        return res.status(200).json({ message: "no data found" });
      }
    });
  };

  // when someone will upload image then we will first find them they will be either user or opponentuser.
  // we are checking everything for both user because in any case they both can try for it.
  const updatewithimage = await GameHistory.findOne({
    user: req.session.user_Id,
    statusofgame: false,
  });
  if (updatewithimage) {
    updatewithimage.gameImage.filename = req.file.filename;
    await updatewithimage?.save();
    const roomcode = updatewithimage.gamedetail.roomcode;
    imageverification(roomcode);
  }

  if (!updatewithimage) {
    const updateopponennt = await GameHistory.findOne({
      opponentuser: req.session.user_Id,
      statusofgame: false,
    });
    if (updateopponennt) {
      updateopponennt.gameImage.filename = req.file.filename;
      await updateopponennt?.save();
      const roomcode = updateopponennt.gamedetail.roomcode;
      imageverification(roomcode);
    }
  }

  // if status is already true then we will say to user image is already proceed
  const condition =
    (await GameHistory.findOne({
      opponentuser: req.session.user_Id,
      statusofgame: true,
    })) ||
    (await GameHistory.findOne({
      user: req.session.user_Id,
      statusofgame: true,
    }));
  if (condition) {
    return res.status(200).json({ message: "This image is already proceed" });
  }
});

router.get("/afterverify", async (req, res) => {
  // once the user will verify we will redirect them to here
  //and will update the status of that gamehistory
  const updatewithuser = await GameHistory.findOne({
    user: req.session.user_Id,
    statusofgame: false,
  });
  // once the user or opponent is found to doing so then we will update the
  // status of game as well as purchase schema or say coin for that user
  if (updatewithuser) {
    updatewithuser.statusofgame = true;
    await updatewithuser?.save();
    const coininthisgame = updatewithuser.gamedetail.coinonhold;
    const enterthecoin = await CoinOfUser.findOne({
      user: req.session.user_Id,
    });
    if (enterthecoin) {
      enterthecoin.amount = enterthecoin?.amount + coininthisgame;
      await enterthecoin?.save();
    }
    return res
      .status(200)
      .json({ message: "you are all done now go and play other games" });
  }

  if (!updatewithuser) {
    const updateopponennt = await GameHistory.findOne({
      opponentuser: req.session.user_Id,
      statusofgame: false,
    });
    if (updateopponennt) {
      updateopponennt.statusofgame = true;
      await updateopponennt?.save();
      const coininthisgame = updateopponennt.gamedetail.coinonhold;
      const enterthecoin = await CoinOfUser.findOne({
        user: req.session.user_Id,
      });
      if (enterthecoin) {
        enterthecoin.amount = enterthecoin?.amount + coininthisgame;
        await enterthecoin?.save();
      }
      return res
        .status(200)
        .json({ message: "you are all done now go and play other games" });
    }
  }
});
module.exports = router;
