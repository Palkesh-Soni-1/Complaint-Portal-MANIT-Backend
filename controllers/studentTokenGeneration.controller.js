import https from "https";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";

export async function studentTokenGenerationController(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Authentication required" });

    const { studentId } = req.body;
    // Verify token with college API

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    const response = await fetch(
      "https://erpapi.manit.ac.in/api/student_profile_check",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
        agent: httpsAgent,
      }
    );

    const data = await response.json();

    if (!response.ok) return res.status(401).json({ message: "Invalid token" });

    if(data.roll_no!==studentId){
      return res.status(401).json({ message: "Invalid token" });
    }
    
    const site_token = jwt.sign(
      { id: studentId },
      process.env.SECRET || "secrett",
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({ site_token: site_token });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
}
