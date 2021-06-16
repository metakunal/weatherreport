const express=require("express");
//https is a native node module for get request
const https=require("https");

const app= express();
//To make our post requests
app.use(express.urlencoded({extended : true}));

app.get("/",function(req,res){
    //This is how we display our HTML file on the server.
    res.sendFile(__dirname+"/index.html")
    
});

//To make apost request on the website
app.post("/",function(req,res){
    //Have to write these functions above the res.send() statements
    //Make sure the url has a strict hhtps:// formatting
    const query=req.body.cityName;
    const apiKey="3198ddcd3abbde64e71d67d15840ac7d"
    const unit="metric"
    const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units="+unit;
    //Using the hhtps node native module to make get requests
    https.get(url,function(response){
        console.log(response.statusCode);
        //Response to be given when we get some data
        response.on("data",function(data){
            //The data that we are returned is in hexadecimal format, so we need to convert it into JSOn
            var weatherData=JSON.parse(data);
            
            //Now to navigate to specific data we have t use the same way as we used with objects.
            //Sometime the path may become too long too be written manually, so go to the extension json awesome and copy path from there.
            const temp=weatherData.main.temp;
            const descirption=weatherData.weather[0].description;
            const icon=weatherData.weather[0].icon;
            const imageUrl="http://openweathermap.org/img/wn/"+icon+"@2x.png"
            console.log(temp);
            console.log(descirption);

            //We cannot have more than one res.send so we are using multiple res.write
            res.write("<p>The weather is currently "+descirption+".</p>")
            res.write("<h1>The temperature in "+query+" is "+temp+" degree celcius.</h1>")
            //Notice how we used +imageUrl inside the src to display the image.
            res.write("<img src="+imageUrl+">");
            res.send();

        })
    });
    //We cannot have more than one send request on the page.
    // res.send("Server is Up and Running");
})




app.listen(3000, function(){
    console.log("Server is running at port 3000");
})