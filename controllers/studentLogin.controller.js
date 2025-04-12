import puppeteer from "puppeteer";

const studentLoginController = async (req, res) => {
    
    const url = "https://students.manit.ac.in/login";
    const {username,password}=req.body;

    console.log("Starting browser...");
    const browser = await puppeteer.launch({
      headless: true, // Production me TRUE
      slowMo: 0, // Dheere dheere chalane ke liye -> taaki dikhe kya ho rha
    });

    try {
      const page = await browser.newPage();

      await page.setViewport({ width: 1280, height: 800 });

      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: "networkidle2" });

      // ------------------------- LOGIN ---------------------------

      console.log("Logging in...");
      await page.waitForSelector('input[name="userId"]');
      await page.type('input[name="userId"]', username);
      await page.type('input[name="password"]', password);
      // click on login button
      // await Promise.all([
      //   page.click('button[type="submit"]'),
      //   page.waitForNavigation({ waitUntil: "networkidle2" }),
      // ]);
      console.log("Pressing login button...");
      await page.click('button[type="submit"]');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Ye h6 tag me please wait / Login failed message dete hai.
      const loginError = await page.evaluate(() => {
        const errorElement = document.querySelector("h6");
        return errorElement &&
          errorElement.innerText.includes(
            "Login failed. Please check your credentials."
          )
          ? errorElement.innerText.trim()
          : null;
      });

      if (loginError) {
        console.error("Login failed:", loginError);
        await browser.close();
        res.status(400).json({error:loginError});
      }

      console.log("Successfully logged in.");

      console.log("Extracting sideprofile information...");

      // Wait for sideprofile element to be available
      await page.waitForSelector(".sideprofile");

      let allProfileData = await page.evaluate(() => {
        const sideprofile = document.querySelector(".sideprofile");
        if (!sideprofile) return {};
        const name = sideprofile.querySelector("h4")?.innerText.trim() || null;
        const department =
          sideprofile.querySelector("h5")?.innerText.trim() || null;
        const studentId =
          sideprofile.querySelector("h3")?.innerText.trim() || null;
        const semester =
          sideprofile.querySelector("h6")?.innerText.trim() || null;
        const imgSrc = sideprofile.querySelector("img")?.src || null;

        return {
          "Name:": name,
          "Department:": department,
          "StudentId:": studentId,
          "Semester:": semester,
          "ProfileImage:": imgSrc,
        };
      });

      // --------------------------- PROFILE -------------------------

      const profileUrl = `https://students.manit.ac.in/profile`;

      console.log(`Navigating to profile page: ${profileUrl}...`);
      await page.goto(profileUrl, { waitUntil: "networkidle2" });
      // await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Starting to extract profile data...");

      // Debugging ke liye screenshot
      // await page.screenshot({ path: "profile.png" });

      // Pahle saare(excluding first) profile-section par click krna expand krne ke liye
      const profileSections = await page.$$(".profile-section");
      console.log(`Found ${profileSections.length} profile sections`);

      for (let i = 1; i < profileSections.length; i++) {
        console.log(`Processing profile section ${i}...`);

        try {
          await profileSections[i].click();
          // await new Promise((resolve) => setTimeout(resolve, 1000));

          // .info-item se data ko uthaya
          const sectionData = await page.evaluate(() => {
            const infoItems = document.querySelectorAll(".info-item");
            let dataMap = {};

            infoItems.forEach((item) => {
              const label = item.querySelector(".info-label");
              const value = item.querySelector(".info-value");

              if (label && value) {
                const labelText = label.innerText.trim();
                const valueText = value.innerText.trim();
                dataMap[labelText] = valueText;
              }
            });

            return dataMap;
          });

          console.log(`Extracted data from section ${i}:`, sectionData);

          // merge data
          allProfileData = { ...allProfileData, ...sectionData };
        } catch (error) {
          console.error(`Error processing section ${i}:`, error);
        }
      }

      console.log("Profile data extraction complete.");
      await browser.close();
      res.status(200).json({userData:allProfileData});
    } catch (error) {
      console.error("An error occurred:", error);
      await browser.close();
      res.status(500).json({err:"Server Error"});
    }
};
export default studentLoginController;
