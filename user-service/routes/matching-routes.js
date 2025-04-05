import express from "express";
import {matchingController} from "../controller/matching-controller.js";

const router = express.Router();

router.post("/findMatchs",(req,res) => {
    console.log(req.body)
    res.status(201).json({message : "match recieved backend"})
})

router.post("/findMatch",matchingController)

export default router;

