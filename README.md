# 待辦清單 To-do List
一個用 Express 和 MySQL 所建立簡單的待辦事項網路應用程式。

## 特色 Features
- 使用者可以註冊帳號或是用 Facebook Login 直接登入，建立並管理專屬他的一個待辦事項清單
- 在首頁瀏覽所有待辦事項
- 可以新增、修改、刪除待辦事項

## 環境建置 Environment Setup

1. nvm & Node.js
2. nodemon
3. MySQL

## 安裝 Installing

1. 在終端機輸入指令 Clone 此專案至本機電腦，並安裝相關套件
```
git clone https://github.com/Whaleep/todo-sequelize
cd todo-sequelize
npm install
```
2. 設定環境變數檔案，將檔案 .env.example 檔名改為 .env。  
若要使用 facebook login ，則需要先在 [Facebook for Developers](https://developers.facebook.com/) 中建立應用程式，將應用程式編號和密鑰填入 .env，即可使用 facebook login 功能。

3. 在 MySQL 伺服器上建立 todo_sequelize 資料庫
```
drop database if exists todo_sequelize;
create database todo_sequelize;
use todo_sequelize;
```
4. 新增資料表、種子資料
```
npx sequelize db:migrate
npx sequelize db:seed:all
```
5. 啟動專案
```
npm run dev
```
6. 出現以下訊息後，即可在 http://localhost:3000 開始使用
```
Express is listening on localhost:3000
```

## 預設使用者 Seed User

>* email: root@example.com
>* password: 12345678
