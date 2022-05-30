import { Request, Response } from "@vercel/node";
import { getScreenshot } from "./_lib/puppeteer";

module.exports = async (req: Request, res: Response) => {
  const usage =
    "https://s.vercel.app/api?url=https://google.com&width=1280&height=720";
  if (!req.query.url)
    return res.status(400).json({
      success: false,
      error: "No url query specified.",
      usage: usage,
    });
  try {
    const file = await getScreenshot(
      req.query.url,
      req.query.width,
      req.query.height
    );
    res.setHeader("Content-Type", `image/png`);
    res.setHeader(
      "Cache-Control",
      `public, immutable, no-transform, s-maxage=86400, max-age=86400`
    );
    res.status(200).end(file);
  } catch (error) {
    console.error(error);
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({
      success: false,
      error:
        "The server encountered an error. You may have inputted an invalid query.",
      //"dev": error,
      usage: usage,
    });
  }
};
