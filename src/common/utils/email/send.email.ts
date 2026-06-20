import nodemailer from "nodemailer";
import { EMAIL, PASSWORD } from "../../../config/config.service";
import Mail from "nodemailer/lib/mailer/index";

export const sendEmail = async (
    mailOptions: Mail.Options
) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        // tls: {
        //     rejectUnauthorized: false
        // },
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `"3b8ny" <${process.env.EMAIL}>`,
        ...mailOptions
    });

    console.log("Message sent:", info.messageId);
    return info.accepted.length ? true : false
};

export const generateOtp = async () => {
    return Math.floor(Math.random() * 900000 + 100000)
};