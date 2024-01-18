const jwt = require("jsonwebtoken");
const Student = require("../Models/StudentModel");
const bcrypt = require("bcrypt");


const login = async (req, res) => {
  try {
  
    const { email, password } = req.body;

    const student = await Student.findOne({ email });


    if (!student) {
      return res
        .status(401)
        .json({ message: "Invalid username/Please Sign-up" });
    }


    if (!student.verified) {
      return res
        .status(401)
        .json({ message: "Account not verfied, kindly check your Email" });
    }

    const passwordCheck = await bcrypt.compare(password, student.password);

    if (!passwordCheck) {
      return res.status(401).json({ message: "Password incorrect" });
    }


    const studentToken = {
      name: student.firstname,
      id: student._id,
    };

    const token = jwt.sign(studentToken, process.env.SECRET, { expiresIn: 60 * 60 });

    res.status(200).send({ message:"successfully logged in ",token, student  });

    
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error signing up please try again" });
  }
};




module.exports = {login};
