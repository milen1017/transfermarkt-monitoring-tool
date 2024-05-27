const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const cheerio = require("cheerio");
const Transfer = require("./models/Transfer"); // Import Transfer model

const Url = require("./models/Url");

// Add stealth plugin
puppeteer.use(StealthPlugin());

// Define your scraper function with the URL parameter

const scrapeTransfers = async (url, leagueID) => {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { timeout: 30000, waitUntil: "domcontentloaded" });
    await page.waitForSelector(".items", { timeout: 30000 });

    const tableHtml = await page.$eval(".items", (table) => table.outerHTML);
    const $ = cheerio.load(tableHtml);
    const rows = $("tbody").find("tr");
    const transfers = [];

    rows.each((index, row) => {
      const rowData = $(row)
        .find("td")
        .map((i, cell) => $(cell).text().trim())
        .get();

      if (rowData.length > 15) {
        const transfer = {
          name: rowData[2],
          position: rowData[3],
          fromTeam: rowData[8],
          toTeam: rowData[12],
          date: new Date(rowData[14]),
          leagueID: leagueID,
        };
        transfers.push(transfer);
      }
    });

    return transfers;
  } catch (error) {
    console.error(
      `Error scraping transfers for league ${leagueID} from ${url}:`,
      error
    );
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

const saveTransfersToDB = async (transfers, leagueID) => {
  try {
    for (const transfer of transfers) {
      await Transfer.findOneAndUpdate(
        {
          name: transfer.name,
          position: transfer.position,
          fromTeam: transfer.fromTeam,
          toTeam: transfer.toTeam,
          date: transfer.date,
          leagueID: transfer.leagueID,
        },
        transfer,
        { new: true, upsert: true }
      );
    }
    console.log(`Transfers for league ${leagueID} saved to MongoDB`);
  } catch (error) {
    console.error("Error saving transfers to MongoDB:", error);
  }
};

const scrapeAndSaveAllLeagues = async () => {
  try {
    const leagues = await Url.find();
    for (const league of leagues) {
      const { url, id: leagueID } = league;
      console.log(`Scraping transfers for league ${leagueID}...`);
      const transfers = await scrapeTransfers(url, leagueID);
      await saveTransfersToDB(transfers, leagueID);
    }
    console.log("Scraping and saving transfers for all leagues completed.");
  } catch (error) {
    console.error(
      "Error during scraping and saving transfers for all leagues:",
      error
    );
  }
};

module.exports = {
  scrapeTransfers,
  saveTransfersToDB,
  scrapeAndSaveAllLeagues,
};
