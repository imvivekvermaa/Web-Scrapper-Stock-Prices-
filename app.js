const express = require("express");
const fs= require('fs');
const axios = require('axios')
const cheerio = require('cheerio')
const pdf = require('html-pdf')
const html= fs.readFileSync('index.html', 'utf8')
let page= cheerio.load(html)

const app= express();

app.get("/arbitrage", async (req, res) =>{
    let stock = ['Infosys', 'TataSteel'];
    let url= ['https://www.business-standard.com/company/infosys-2806.html','https://www.business-standard.com/company/tata-steel-566.html']

    // todo html file creation

    page=cheerio.load(html)


    for(let i=0; i< url.length; i++){
        try {
            let response= await axios(url[i]);
            // console.log(response)
            let html = response.data;
            // console.log(html)
            let $ = cheerio.load(html)
            let values =[];
            $('.tdC',html).filter(function (){
                let data= $(this);
                // console.log(data)
                values.push(parseFloat(data.text()))
            });

            page('.my_table').append(
                `<tr> 
                    <td>${stock[i]} </td>
                    <td>${values[2]} </td>
                    <td>${values[0]} </td>
                    <td>${Math.abs(values[2]= values[0])} </td>
                
                </tr>`
            )
            console.log(`${stock[i]} value =`, values)
        }
        catch (error) {
            console.log(error)
        }
    }
    res.send('Data fetched')
})

app.get('/download', (req, res) => {
    try {
        let options = {format: 'A4', orientation: 'Portrait', border: '10mm'};
        pdf.create(page.html(), options).toFile('./output.pdf', (req, resp) => {
            res.download(resp.filename)
        })
    } catch (error) {
        
    }
})


app.listen(5000, () => {
    console.log(`Server started scuccessfully`)

})