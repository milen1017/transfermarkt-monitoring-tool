const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const cheerio = require("cheerio");
const fs = require("fs");

// Add stealth plugin
puppeteer.use(StealthPlugin());

// Define your scraper function with the URL parameter
const scrapeTransfers = async (url, leagueID) => {
  // Launch a headless browser
  const browser = await puppeteer.launch();

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the URL you want to scrape (passed as a parameter)
  await page.goto(url);

  // Wait for the table with class "items" to appear
  await page.waitForSelector(".items");

  // Get the HTML content of the table
  const tableHtml = await page.$eval(".items", (table) => table.outerHTML);

  await browser.close();

  // Load the HTML content into Cheerio
  const $ = cheerio.load(tableHtml);

  // Select the table rows within the tbody
  const rows = $("tbody").find("tr");

  // Create an array to store transfers
  const transfers = [];

  // Iterate over each row and extract the text content of each entry
  rows.each((index, row) => {
    const rowData = [];
    $(row)
      .find("td")
      .each((index, cell) => {
        const cellText = $(cell).text().trim();
        rowData.push(cellText);
      });

    // Check if rowData has sufficient length (to avoid scraping headers)
    if (rowData.length > 15) {
      const transfer = {
        name: rowData[2],
        position: rowData[3],
        fromTeam: rowData[8],
        toTeam: rowData[12],
        date: rowData[14],
        leagueID: leagueID,
      };
      transfers.push(transfer);
    }
  });

  // Convert transfers array to JSON
  const transfersJSON = JSON.stringify(transfers, null, 2);

  // Write transfers JSON to a file
  fs.writeFileSync(`${leagueID}_transfers.json`, transfersJSON);

  console.log(`Transfers saved to ${leagueID}_transfers.json`);
};

// Call the scraper function with the URL and league ID as parameters

// const url = "https://www.transfermarkt.com/a-league/letztetransfers/wettbewerb/AUS1/plus/1";
// const leagueID = "AUS1";

// const url =
//   "https://www.transfermarkt.co.uk/primera-division/letztetransfers/wettbewerb/AR1N/plus/1";
// const leagueID = "AR1N";

// const url =
//   "https://www.transfermarkt.com/girabola/letztetransfers/wettbewerb/AN1L/plus/1";
// const leagueID = "AN1L";
// scrapeTransfers(url, leagueID);

module.exports = scrapeTransfers;

