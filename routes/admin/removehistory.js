const express = require("express");
const router = express.Router();
const GameHistory = require("../../model/gamehistory");
const CategoryofBattle = require("../../model/admin/categoryofgame");
const CoinOfUser = require("../../model/purchaseofuser");

// here we have to update coin of user as well.
// as well as if game is cancell in admin case tab bhi idhar update karna hai..
// aur agar push notification me o nhi bolta hai tab bhi cancel karna hai
router.post("/", async (req, res) => {
  const { findingthematch, matchesforother } = req.body;
  const userId = findingthematch ? findingthematch.user : matchesforother.user;
  const opponentuserId = findingthematch
    ? findingthematch.opponentuser
    : matchesforother.opponentuser;
  // removed from gamehistoryyyy
  const gameHistory = await GameHistory.findOneAndDelete({
    user: userId,
    opponentuser: opponentuserId,
    statusofgame: false,
  });
  // now we will remove the user from battle category waiting list.
  // for those case in which aayega khelne par khelega nhii waiting list me rahega phir usko dura
  if (gameHistory) {
    const updateBattle = await CategoryofBattle.findOne({
      name: findingthematch
        ? findingthematch.gamedetail.nameofbattle
        : matchesforother.gamedetail.nameofbattle,
    });
    console.log(updateBattle, "bala");
    const index = updateBattle.waitinguser.indexOf(userId);
    const index1 = updateBattle.waitinguser.indexOf(opponentuserId);
    if (index > -1) {
      // only splice array when item is found
      // 2nd parameter means remove one item only
      updateBattle.waitinguser.splice(index, 1);
      updateBattle.waitingPlayer = updateBattle.waitingPlayer
        ? updateBattle.waitingPlayer - 1
        : updateBattle.waitingPlayer;
      await updateBattle.save();
    }
    if (index1 > -1) {
      // only splice array when item is found
      updateBattle.waitinguser.splice(index1, 1);
      updateBattle.waitingPlayer = updateBattle.waitingPlayer
        ? updateBattle.waitingPlayer - 1
        : updateBattle.waitingPlayer;
      await updateBattle.save();
    }
  }
});
module.exports = router;
