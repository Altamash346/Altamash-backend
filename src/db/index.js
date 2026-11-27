import dns from "dns";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URI,
            { dbName: DB_NAME }
        );
        console.log(
            `\nMONGODB connected !! DB HOST: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        if (error?.syscall === "querySrv") {
            try {
                dns.setServers(["8.8.8.8", "8.8.4.4"]);
                const connectionInstance = await mongoose.connect(
                    process.env.MONGODB_URI,
                    { dbName: DB_NAME }
                );
                console.log(
                    `\nMONGODB connected !! DB HOST: ${connectionInstance.connection.host}`
                );
                return;
            } catch (retryError) {
                console.log("MONGODB connection error", retryError);
                process.exit(1);
            }
        }
        console.log("MONGODB connection error", error);
        process.exit(1);
    }
};

export default connectDB;
