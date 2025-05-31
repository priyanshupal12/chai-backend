import mongoose, {Schema} from "mongoose";    

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: Schema.Types.ObjectId, //who subscribing
        ref: "User",
        required: true
    },
    channel: {
        type: Schema.Types.ObjectId, //whom subscriber is subscribing to.
        ref: "User",
        required: true
    },
}, {timestamps: true});

export const Subscription = mongoose.model("Subscription", subscriptionSchema)