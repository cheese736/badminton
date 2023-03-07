# 我的 Express 練習：搭建論壇

使用 Node.js & Express 打造一個簡易的羽毛球論壇

## 功能

- 使用者可以註冊帳號，註冊的資料包括：名字(選填)、email、密碼、確認密碼。
- 使用者也可以透過 Facebook 或 Google 帳號直接登入
- 首頁為羽球新聞(目前僅排版，未上傳資料)

## 使用方式

1. 確認安裝 node.js & npm。
2. 將專案 clone 至本地位置：
3. 開啟 Terminal 並移至專案資料夾安裝使用套件： `npm install`
4. 設定環境變數請參考.env.example
5. 寫入種子資料: `rpm run seed`
6. 執行專案： `npm run dev`
7. 開啟瀏覽器輸入網址 http://localhost:3000 進入首頁。

## 開發工具

- [Visual Studio Code](https://visualstudio.microsoft.com/zh-hant/)
- [Node.js@14.16.0](https://nodejs.org/en/)
- [Express@4.16.4](https://www.npmjs.com/package/express)
- [Express-Handlebars@3.0.0](https://www.npmjs.com/package/express-handlebars)
- [Express-session@1.17.1](https://www.npmjs.com/package/express-session)
- [Bootstrap@v5.2](https://getbootstrap.com/)
- [Font-awesome@6.2.0](https://fontawesome.com/)
- [mongoose@5.9.7](https://mongoosejs.com)
- [connect-flash@0.1.1](https://www.npmjs.com/package/connect-flash)
- [dotenv@16.0.3](https://www.npmjs.com/package/dotenv)
- [passport.js@0.4.1](https://www.passportjs.org)
