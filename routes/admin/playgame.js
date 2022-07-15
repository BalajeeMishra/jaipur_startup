const express = require("express");
const router = express.Router();
const User = require("../../model/user");
const GameHistory = require("../../model/gamehistory");
const CategoryofBattle = require("../../model/admin/categoryofgame");

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
    const { name, pricetoenter, numberofPlayers, waitingPlayer } = req.body;
    const waitingPlayers = await CategoryofBattle.findOne({ name });
    const id = waitingPlayers?.waitinguser[0];
    if (waitingPlayers?.waitinguser.length > 0 && id != req.session.user_Id) {
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
      // in case of no user is there.
      const updateBattles = await CategoryofBattle.findOne({ name });
      const waitingusers = updateBattles?.waitinguser;
      if (!waitingusers?.includes(req.session.user_Id)) {
        const updateBattle = await CategoryofBattle.findOneAndUpdate(
          { name },
          {
            waitingPlayer: waitingPlayer + 1,
            numberofPlayers: numberofPlayers + 1,
          }
        );
        if (waitingusers) {
          updateBattles.waitinguser = [...waitingusers, req.session.user_Id];
        }
        await updateBattles.save();
      }
    }
    // for matching purposeee
    const findingthematch = await GameHistory.findOne({
      user: req.session.user_Id,
    }).populate(["opponentuser", "user"]);
    if (findingthematch) {
      // removing from waiting user as welll as we willl decrease waiting player by  1.
      findingthematch.sentthedetail = true;
      await findingthematch.save();
      return res.status(202).json({ findingthematch, user: "user" });
    }

    // for opponent purposeeee.
    const matchesforother = await GameHistory.findOne({
      opponentuser: req.session.user_Id,
    }).populate(["opponentuser", "user"]);
    if (!findingthematch && matchesforother?.sentthedetail) {
      const updateBattles = await CategoryofBattle.findOne({ name });
      // updateBattles.waitinguser = updateBattles.waitinguser.map((e) => {
      //   return e != req.session.user_Id;
      // });
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
module.exports = router;
