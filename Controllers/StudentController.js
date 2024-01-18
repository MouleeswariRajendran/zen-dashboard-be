const Student = require("../Models/StudentModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const signupStudent = async (req, res) => {
  try {
    const {
      email,
      firstname,
      lastname,
      contact,
      experience,
      qualification,
      password,
    } = req.body;

    if (!firstname || !email || !password) {
      res.status(400).json({ message: "all fields are mandotary" });
      return;
    }

    const matchedStudent = await Student.findOne({ email });
    if (matchedStudent) {
      res.status(400).json({ message: "Student already exists" });
      return;
    }

    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const link = `${process.env.FE_URL}/confirm/${randomString}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      email,
      firstname,
      lastname,
      contact,
      experience,
      qualification,
      password: hashedPassword,
      resetToken: randomString,
    });

    await student.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const sendMail = async () => {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: student.email,
        subject: "Confirm account",
        text: link,
      });
    };
    sendMail();
    res.status(201).json({
      message: "User registered successfully",
      data: student,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error signing up please try again" });
  }
};

const updateStudent = async (req, res) => {
  try {
    const {
      email,
      firstname,
      lastname,
      contact,
      qualification,
      experience,
      password,
    } = req.body;

    const matchedStudent = await Student.findOne({ email });

    if (!matchedStudent) {
      res.status(400).json({
        message: "Please enter valid email / Entered email is not registered",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    matchedStudent.firstname = firstname;
    matchedStudent.lastname = lastname;
    matchedStudent.contact = contact;
    matchedStudent.qualification = qualification;
    matchedStudent.experience = experience;
    matchedStudent.password = hashedPassword;

    await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);

    res
      .status(201)
      .json({ message: `Account updated successfully`, matchedStudent });

    //
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while updating please try again later" });
  }
};

const confirmStudent = async (req, res) => {
  try {
    const resetToken = req.params.id;
    const matchedStudent = await Student.findOne({ resetToken });

    if (matchedStudent === null || matchedStudent.resetToken === "") {
      return res
        .status(400)
        .json({ message: "student does not exist or link expired" });
    }

    matchedStudent.verified = true;

    matchedStudent.resetToken = "";

    await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);

    res.status(201).json({
      message: `${matchedStudent.firstname} Account has been verified successfully`,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "student does not exist or link expired" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const matchedStudent = await Student.findOne({ email });

    if (!matchedStudent) {
      res.status(400).json({
        message: "Please enter valid email / Entered email is not registered",
      });
      return;
    }

    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const link = `${process.env.FE_URL}/reset/${randomString}`;

    matchedStudent.resetToken = randomString;

    await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const sendMail = async () => {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: matchedStudent.email,
        subject: "Reset Password",
        text: link,
      });
    };

    sendMail()
      .then(() => {
        return res
          .status(201)
          .json({ message: `Mail has been send to ${matchedStudent.email}` });
      })
      .catch((err) => res.status(500).json(err));

    
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error while updating please try again later" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const resetToken = req.params.id;

    const matchedStudent = await Student.findOne({ resetToken });

    if (matchedStudent === "null" || matchedStudent.resetToken === "") {
      return res
        .status(400)
        .json({ message: "student does not exist or link expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    matchedStudent.password = hashedPassword;
    matchedStudent.resetToken = "";

    await Student.findByIdAndUpdate(matchedStudent.id, matchedStudent);

    res.status(201).json({
      message: `${matchedStudent.firstname} password has been updated successfully`,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Student does not exist or link expired" });
  }
};
module.exports = {
  signupStudent,
  updateStudent,
  confirmStudent,
  forgotPassword,
  resetPassword,
};
