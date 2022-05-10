const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer");

const app = express();
const domain = "https://www.kgvod.com";
const options = {
  //当为true时，客户端不会打开，使用无头模式；为false时，可打开浏览器界面
  headless: true,
  args: [
    "--no-sandbox", // 沙盒模式
    "--disable-setuid-sandbox", // uid沙盒
    "--disable-dev-shm-usage", // 创建临时文件共享内存
    "--disable-accelerated-2d-canvas", // canvas渲染
    "--disable-gpu" // GPU硬件加速
  ]
};
app.get("/list", async (req, res) => {
  const searchValue = req.query.wd;
  const url = `${domain}/vod-search.html`;
  try {
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
      list.push({ title, url: pageUrl });
    });
    res.send({ data: list });
  } catch (error) {
    console.log(error);
  }
});

app.get("/movie", async (req, res) => {
  const url = req.query.key;
  const result = await axios({
    url: "https://www.kgvod.com/vod-play-30286-1-1.html",
    method: "get"
  });
  // console.log(result.data);
  try {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto("https://www.kgvod.com/vod-play-30286-1-1.html");
    const content = await page.content();
    const $ = cheerio.load(content);
    console.log($("#playleft iframe").attr().src.split("?m3u8=")[1]);
    res.send({ data: $("#playleft iframe").attr().src.split("?m3u8=")[1] });
  } catch (err) {
    console.log(err);
  }
  // page.close();
});

app.listen(4000, () => {
  console.log("服务器启动成功");
});
