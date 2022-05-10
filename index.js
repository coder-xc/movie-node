const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");

const app = express();
const domain = "https://www.kgvod.com";
app.get("/list", async (req, res) => {
  const searchValue = req.query.wd;
  const url = `${domain}/vod-search.html`;
  const result = await axios({
    url,
    method: "get",
    params: {
      wd: searchValue
    }
  });
  const list = [];
  const $ = cheerio.load(result.data);
  $(".stui-pannel-box .stui-pannel_bd .stui-vodlist__media .active").each(async function () {
    const title = $(".detail .title a", this).text();
    const src = $(".detail .title a", this).attr();
    const pageUrl = (domain + src.href.replace(".html", "") + "-1-1.html").replace(
      "detail",
      "play"
    );
    // console.log(pageUrl);
    // const pageContent = $.html(pageUrl);
    list.push({ title, url: pageUrl });
  });
  // for (let i = 0; i < list.length; i++) {
  //   const url = list[i];
  //   const user_agent =
  //     "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36";
  //   const options = {
  //     //当为true时，客户端不会打开，使用无头模式；为false时，可打开浏览器界面
  //     headless: true,
  //     args: ["--no-sandbox", user_agent]
  //   };
  //   try {
  //     const browser = await puppeteer.launch(options);
  //     const page = await browser.newPage();
  //     await page.goto(url);
  //     const content = await page.content();
  //     const $$ = cheerio.load(content);
  //     console.log($$("#playleft iframe").attr().src.split("?m3u8=")[1]);
  //     page.close();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // const pageRes = await axios({
  //   url: "https://www.kgvod.com/vod-play-56554-1-1.html",
  //   method: "get"
  // });
  res.send({ data: list });
});

app.get("/movie", async (req, res) => {
  const key = req.query.key;
  // for (let i = 0; i < list.length; i++) {
  const url = key;
  const user_agent =
    "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36";
  const options = {
    //当为true时，客户端不会打开，使用无头模式；为false时，可打开浏览器界面
    headless: true,
    args: ["--no-sandbox", user_agent]
  };
  // try {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(url);
    const content = await page.content();
    const $$ = cheerio.load(content);
    console.log($$("#playleft iframe").attr().src.split("?m3u8=")[1]);
    page.close();
  // } catch (error) {
    // console.log(error);
  // }
  res.send({data: $$("#playleft iframe").attr().src.split("?m3u8=")[1]})
  // }
});

app.listen(4000, () => {
  console.log("服务器启动成功");
});
