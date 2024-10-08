const { createServer } = require("node:http");
const { readFile } = require("node:fs").promises;
const path = require("node:path");

async function fetchRandomQuote() {
  try {
    const response = await fetch("http://api.quotable.io/random");
    if (!response.ok) {
      throw new Error(`Error fetching quote: ${response.statusText}`);
    }
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error(error.message);
    return "Unable to fetch quote";
  }
}

const server = createServer(async (req, res) => {
  if (req.url === "/quote") {
    try {
      const quote = await fetchRandomQuote();
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(quote);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
      res.end("Internal Server Error");
    }
  } else if (req.url === "/quotes") {
    try {
      const filePath = path.join(__dirname, "quotes.html");
      const fileContents = await readFile(filePath, "utf-8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(fileContents);
    } catch (error) {
      res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
      res.end("Internal Server Error");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(3000, () => {
  console.log(`Server listening on http://localhost:3000/quotes`);
});
