import { sendToQueue } from "../middleware/rabbitMq-matching.js";

export async function matchingController(req, res){
    try {

    const { userId, topic, complexity } = req.body;

    // Send message to RabbitMQ
    await sendToQueue({ userId, topic, complexity })

    return res.status(200).json({message:"Matching request sent to rabbitMQ"})
    } catch (error) {
        console.log(error)
        return res.status(401).json({message:"error sent to rabbitMQ"})
    }
};