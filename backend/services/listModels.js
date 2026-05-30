// const https = require("https");
// require("dotenv").config();

// const apiKey = process.env.GEMINI_API_KEY;

// const options = {
//   hostname: "generativelanguage.googleapis.com",
//   path: `/v1beta/models?key=${apiKey}`,
//   method: "GET",
// };

// const req = https.request(options, (res) => {
//   let raw = "";
//   res.on("data", chunk => raw += chunk);
//   res.on("end", () => {
//     const data = JSON.parse(raw);
//     if (data.error) {
//       console.log("Error:", data.error.message);
//       return;
//     }
//     console.log("Available models that support generateContent:\n");
//     data.models
//       .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
//       .forEach(m => console.log(" -", m.name));
//   });
// });

// req.on("error", console.error);
// req.end();