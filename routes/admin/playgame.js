const express = require("express");
const router = express.Router();
const User = require("../../model/user");
const GameHistory = require("../../model/gamehistory");
const CategoryofBattle = require("../../model/admin/categoryofgame");

router.post("/addroomcode", async (req, res) => {
  const { roomCode, name, pricetoenter, numberofPlayers, waitingPlayer } =
    req.body;
  //  creating new GameHistory once the new user will try to enter the coupon code.
  const newGameEntry = new GameHistory({
    user: req.session.user_Id,
  });
  newGameEntry.gamedetail.nameofbattle = name;
  newGameEntry.gamedetail.coinonhold = pricetoenter;
  newGameEntry.gamedetail.roomcode = roomCode;
  await newGameEntry.save();

  // updating the categorybattle once the new user will try to enter the coupon code.
  const updateBattle = await CategoryofBattle.findOneAndUpdate(
    { name },
    {
      waitingPlayer: waitingPlayer + 1,
      numberofPlayers: numberofPlayers + 1,
    }
  );
  const waitingusers = updateBattle.waitinguser;
  updateBattle.waitinguser = [...waitingusers, req.session.user_Id];
  await updateBattle.save();
  return res.status(200).json({
    message: "please wait for 45 second,we are giving you another users",
  });
});

router.post("/waitingplayer", async (req, res) => {
  // console.log("balajee mishraaa server sideee okkaay");
  const { name, pricetoenter, numberofPlayers, waitingPlayer } = req.body;

  const waitingPlayers = await CategoryofBattle.findOne({ name });
  // if waiting players are there...
  const id = waitingPlayers.waitinguser[0];
  if (waitingPlayers.waitinguser.length > 0 && id != req.session.user_Id) {
    const newGameEntry = new GameHistory({
      user: req.session.user_Id,
    });
    newGameEntry.gamebetween.user = req.session.user_Id;
    newGameEntry.gamebetween.opponentuser = id;
    newGameEntry.opponentuser = id;
    newGameEntry.gamedetail.nameofbattle = name;
    newGameEntry.gamedetail.coinonhold = pricetoenter;
    await newGameEntry.save();
    // here we have to send notification to two different userss...
    // we are sending the detail to one user only right now...
    // i have to learnnn it right now.
    // return res.status(200).json(newGameEntry);
  } else {
    // in case of no user is there.
    const updateBattles = await CategoryofBattle.findOne({ name });
    const waitingusers = updateBattles.waitinguser;
    // console.log(waitingusers);
    console.log(waitingusers.includes(req.session.user_Id));
    if (!waitingusers.includes(req.session.user_Id)) {
      const updateBattle = await CategoryofBattle.findOneAndUpdate(
        { name },
        {
          waitingPlayer: waitingPlayer + 1,
          numberofPlayers: numberofPlayers + 1,
        }
      );

      updateBattles.waitinguser = [...waitingusers, req.session.user_Id];
      await updateBattles.save();
    }
  }
  const findingthematch = await GameHistory.findOne({
    user: req.session.user_Id,
  }).populate("user");
  if (findingthematch) return res.status(202).json(findingthematch);
  if (!findingthematch) {
    const findingthematch = await GameHistory.findOne({
      opponentuser: req.session.user_Id,
    }).populate("opponentuser");
    return res.status(202).json(findingthematch);
  }
});

// const roomcodeDetailwithUser = await GameHistory.findOne({

//   statusofgame: false,
//   user: id,
// }).populate("user");
// return res.status(200).json(roomcodeDetailwithUser);
module.exports = router;
