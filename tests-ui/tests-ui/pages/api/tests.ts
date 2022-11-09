// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type TestResults = {
  firstTest: boolean;
  secondTest: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResults>
) {
  const { Builder, By } = require("selenium-webdriver");
  const body = JSON.parse(req.body);
  const { url, h1Text } = body;
  console.log("URL", url);
  console.log('h1Text', h1Text);

  const testResults: TestResults = {
    firstTest: false,
    secondTest: false,
  };

  (async function executeTests() {
    const driver = await new Builder()
      .forBrowser("chrome")
      .usingServer("http://localhost:4444/wd/hub")
      .build();

    try {
      await driver.get(url);
      let elements = await driver.findElements(By.tagName("h1"));
      for (let e of elements) {
        const textElement: string = await e.getText();
        if (textElement.includes(h1Text)) {
          testResults.secondTest = true;
        }
      }
    } finally {
      res.status(200).json(testResults);
      await driver.quit();
    }
  })();
  
}
