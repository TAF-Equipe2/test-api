import type { NextApiRequest, NextApiResponse } from "next";

export type TestResults = {
  firstTest: boolean;
  secondTest: boolean;
};

const titleTags = ["h1", "h2", "h3", "h4", "h5", "h6"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestResults>
) {
  const { Builder, By } = require("selenium-webdriver");
  const body = JSON.parse(req.body);
  const {
    url,
    h1Text,
    firstTestButtonText,
    firstTestTextShown,
    doFirstTest,
    doSecondTest,
  } = body;

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
      if (doFirstTest) {
        // First test (click on button and text is displayed)
        let firstTestElements = await driver.findElement(
          By.xpath(`//*[text()[contains(.,'${firstTestButtonText}')]]`)
        );
        const actions = driver.actions({ async: true });
        await actions.move({ origin: firstTestElements }).click().perform();
        let firstTestTextShownElements = await driver.findElements(
          By.xpath(`//*[text()[contains(.,'${firstTestTextShown}')]]`)
        );
        testResults.firstTest = firstTestTextShownElements.length > 0;
      }

      if (doSecondTest) {
        //  Second test (h1 containing text)
        await driver.get(url);
        for (const title of titleTags) {
          let secondElements = await driver.findElements(By.tagName(title));
          for (let e of secondElements) {
            const textElement: string = await e.getText();
            if (textElement.includes(h1Text)) {
              testResults.secondTest = true;
              break;
            }
          }
        }
        
      }
    } finally {
      res.status(200).json(testResults);
      await driver.quit();
    }
  })();
}
