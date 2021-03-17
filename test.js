const got = require("got")
const cheerio = require("cheerio")

runQuery = async function () {
  console.log("getting article")
  try {
    const response = await got("https://en.wikipedia.org/wiki/Main_Page")
    console.log("Got article")
    var $ = cheerio.load(response.body)

    const articleFull = $("#mp-tfa").first().find("p").first()

    const articleTitleStr = articleFull
      .find("b")
      .first()
      .find("a")
      .first()
      .text()

    const articleFullStr = articleFull.text()
    const cutoff = "("
    const cutoffIndex = articleFullStr.lastIndexOf(cutoff)
    const readFullStr = articleFullStr.slice(0, cutoffIndex)

    console.log("Got article title:", articleTitleStr)
    console.log("Full Article:", readFullStr)
  } catch (err) {
    console.log("Error", err)
  }
}

runQuery((articleTitleStr) => {
  console.log("Got", articleTitleStr)
})
