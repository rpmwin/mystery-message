import { dbconnect } from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import bcrypt from "bcrypt";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbconnect();

    try {
        const { username, email, password } = await request.json();

        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email",
                    },
                    { status: 400 }
                );
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const user = new UserModel({
                verifyCode: Math.floor(
                    100000 + Math.random() * 900000
                ).toString(),
                email,
                password: hashedPassword,
                username,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

            await user.save();
            const emailResponse = await sendVerificationEmail(
                email,
                username,
                user.verifyCode
            );

            if (!emailResponse.success) {
                return Response.json(
                    {
                        success: false,
                        message: "Something went wrong",
                    },
                    { status: 500 }
                );
            }

            return Response.json(
                {
                    success: true,
                    message: "User created successfully",
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.log("error in signup", error);
        return Response.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}
