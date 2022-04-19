const request = require('request')
const cheerio = require('cheerio')
const axios = require('axios')
const express = require('express')


async function getData(){
    try{
        const siteUrl = 'https://coinmarketcap.com/'

        const {data} = await axios({
            method:'GET',
            url:siteUrl,
        })

        const $ = cheerio.load(data)
        // console.log(data)
        const elemSelector = "#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr"
       
        const keys =[
            'Rank','Name', 'Price', '24h', '7day', 'Market Cap', 'Volume', 'Supply'
        ]

        const coinArray =[]
       
        $(elemSelector).each((parentIdx, parentElem)=>{
            let keyIdx = 0
            const coin = {}
            if(parentIdx <= 9){
                $(parentElem).children().each((childIdx,childElem)=>{
                    let tdValue = $(childElem).text()

                    if(keyIdx === 1 || keyIdx === 6){
                        
                        $tdValue = $('p:first-child',$(childElem).html()).text()
                        
                    }

                    if(tdValue){
                        coin[keys[keyIdx]] = tdValue

                        keyIdx++
                    }
                })
                coinArray.push(coin)

            }
        })

        // console.log(coinArray)
        return coinArray


    }catch(err){
        console.log(err)
    }
}

const app = express()

app.get('/api/feed', async(req, res)=>{
    try{
        const data = await getData()
        return res.status(200).json({
            data
        })
    }catch(err){
        return res.status(500).json({
            err: err.toString(),
        })
    }
})

app.listen(3000, ()=>{
    console.log('Fetching...')
})