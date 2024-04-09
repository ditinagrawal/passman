import { Schema, model, models } from "mongoose";

const passwordSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Password = models.Password || model("Password", passwordSchema);

export default Password;