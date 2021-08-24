#!/usr/bin/env node
const yargs = require("yargs");
const path = require("path");
const https = require('https');
var fs = require('fs'); 
var parse = require('csv-parse');
var print = require('print');
const { MongoClient } = require('mongodb');
const { strict } = require("yargs");
const api_key = 'e2c81e93a1eb68a1226123aadaddb9e700192f3c1051a3364a361a1c3b8253e4';

const url = 'mongodb://localhost:27017'
const client = new MongoClient(url);
const dbName = 'cryptoDB';
client.connect();
console.log('Connected successfully to server');
const db = client.db(dbName);
const collection = db.collection('documents')


async function aggregateDB(){
   const docs = await collection.aggregate([
   { "$match": { "token": "ETH" } },
   { "$group": {"_id":{"$first" : "$_id.number_of_transactions"}, "transaction": {"$first" : "$transaction_type"}, "total": { "$sum": "$amount" } } },
   { "$sort": { "timestamp": 1}}
]).toArray();
console.log(docs.map(it => it._id));
}
aggregateDB();

const BTC_USD = exchangeWithUSD('BTC');
const ETH_USD = exchangeWithUSD('ETH');
const XRP_USD = exchangeWithUSD('XRP');

const options = yargs.option("total", {alias: "Total", describe: "Total Portfolio Value", type: "String", demandOption: false})
.option("token", {alias: "Token", describe: "Token based value", type: "String", demandOption: false})
.option("date", {alias: "Date", describe: "Date based value", type: "String", demandOption: false})
.argv;
if(options.total){
    console.log(' total '+options.Total);
    getTotalPortfolioValue();
}
if(options.token && options.date){
    console.log(' token '+options.token + ' date : '+options.date);
    getTokenNDateBasedValue(options.token, options.date);
}else{
    if(options.token){
        console.log(' token '+options.token);
        getTokenBasedValue(options.token);
    }
    if(options.date){
        console.log(' date '+options.date);
        getDateBasedValue(options.date);
    }
}

function getTotalPortfolioValue(){
    return " total value";
    
}

function getTokenBasedValue(token){
    console.log(' inside function token '+token);
    let withdrawal = 0, deposits = 0;
    const cursor = collection.find({"token" : token, "transaction_type": "WITHDRAWAL"});
    cursor.forEach(doc => {
        switch(doc.transaction_type){
            case 'WITHDRAWAL':
                withdrawal = withdrawal + doc.amount;
                break;
            case 'DEPOSIT':
                deposits = deposits + doc.amount;
                break;
        }
        // console.log(doc)
    });
        console.log(' Withdrawal : '+withdrawal+ ' deposits : '+deposits);
        let total_val = deposits - withdrawal;
        console.log(' total value '+total_val+' token : '+token);
        let exchanged_val  = exchangeWithUSD(total_val);
        console.log(' exchnaged value '+exchanged_val);
    
    

}

function getDateBasedValue(date){

}

function getTokenNDateBasedValue(token, date){

}

function exchangeWithUSD(token){
    let url = 'https://min-api.cryptocompare.com/data/price?fsym='+token+'&tsyms=USD&api_key='+api_key;
    const req = https.request(url, res => {
        res.on('data', d => {
          process.stdout.write(token+' : ' + JSON.parse(d).USD);
          return JSON.parse(d).USD;
        })
      })
      req.on('error', error => {
        console.error(error)
      })
      
      req.end()
      
}
// console.log(" total : "+getTotalPortfolioValue());