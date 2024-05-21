const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const cheerio = require("cheerio");
const Transfer = require('./models/Transfer'); // Import Transfer model

// Add stealth plugin
puppeteer.use(StealthPlugin());

// Define your scraper function with the URL parameter
const scrapeTransfers = async (url, leagueID) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector(".items");

  const tableHtml = await page.$eval(".items", (table) => table.outerHTML);
  await browser.close();

  const $ = cheerio.load(tableHtml);
  const rows = $("tbody").find("tr");
  const transfers = [];

  rows.each((index, row) => {
    const rowData = [];
    $(row).find("td").each((index, cell) => {
      const cellText = $(cell).text().trim();
      rowData.push(cellText);
    });

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
  // console.log(`scraped ${leagueID} transfers ${transfers}`);
  return transfers;
};

const saveTransfersToDB = async (transfers, leagueID) => {
  try {
    for (const transfer of transfers) {
      await Transfer.findOneAndUpdate(
        { name: transfer.name, date: transfer.date },
        transfer,
        { new: true, upsert: true }
      );
    }
    console.log(`Transfers for league ${leagueID} saved to MongoDB`);
  } catch (error) {
    console.error('Error saving transfers to MongoDB:', error);
  }
};

module.exports = {
  scrapeTransfers,
  saveTransfersToDB,
};
