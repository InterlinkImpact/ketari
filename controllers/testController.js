const express = require('express');

const router = express.Router();

router.route("/testall")

.get(function(req, res){
    res.send("Gets all data");
});


router.route("/testone/:id")

.get(function(req, res){
    res.send(req.params.id);
});

module.exports = router;