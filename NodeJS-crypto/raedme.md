Thoughtprocess : 
1.Import huge csv file into database
 - I have used mongoimport tool to import csv file content into mongodb using following command : 
   < mongoimport --type csv -d cryptoDB -c documents --headerline --drop D:\Work\project\Crypto_NodeJS\transactions.csv >
 
2.Segregate data
 - I planned to segregate data based on key <token_type> and group them further by <transaction_type>.
 - I have used mongodb aggregate functionality for this purpose

3.Set line params to get requested parameter
 - Line params are built on taking 3 values, 
   1.total : gives the total portfolio value
   2.token : gives portfolio value based on token
   3.date : gives portfolio value for each token based on date
 - This functionality has been built up using 'yargs'
 - line params are optional so that any combination can be given.

4.Build functions
 - Different functions have been developed based on type of params asked as per challenge
   1.get total portfolio value 
   2.get token based value
   3.get date based value
   4.get token and date based value

5.Get current exchange rate of token in USD
 - external api has been integrated in order to fetch exchange rate of token(ETH, XRP, BTC) in USD
 - this function runs at the start of the code so in the end after getting portfolio value only local calculation is left.


Command to run this program : 
1. get total portfolio value : crypto --total all 
2. get token based value : crypto --token <token>
3. get date based value : crypto --date <timestamp>
4. get token and date based value : crypto --token <token> --date <timestamp>