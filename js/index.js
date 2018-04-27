



function get() {
    let result = new Promise((resolve, reject) => {
        request = new XMLHttpRequest();
        request.open('GET', 'https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json', true);
        request.onreadystatechange = function(){ 
            if (request.readyState != 4){
                return;
            }
            if (request.status == 200){
                resolve(request);
            }
            else {
                reject(request);
            }
        }
        request.send();
    })
    return result;
}
get()
    .then(
        response => {
            var data = JSON.parse(response.responseText);
            for(key in data) {
                let option = document.createElement("option");
                option.innerText = key;
                country.appendChild(option);
            }
            country.onchange = function() {
                let currentKey = country.value;
                city.innerHTML = "";
                for(let i = 0; i < data[currentKey].length; i++) {
                    let option = document.createElement("option");
                    option.innerText = data[currentKey][i];
                    city.appendChild(option);
                }
                city.onchange();
            }  
        }, 
        error => {
            console.log("Rejected 1");
        }
    )
city.onchange = function() {
    new Promise((resolve, reject) => {
        let currentCity = city.value;
        request = new XMLHttpRequest();
        request.open('GET', "https://query.yahooapis.com/v1/public/yql?" + 'q=' + encodeURIComponent("select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + currentCity + "') and u='c'") + '&format=json', true);
        request.onreadystatechange = function() {
            if(request.readyState != 4) {
                return;
            }
            if(request.status == 200) {
                resolve(request);
            }
            else {
                reject(request);
            }
        }
       
        request.send();
    }).then(
        response => {

            let city = (this.value); 
            let base_URL = 'https://query.yahooapis.com/v1/public/yql?q='; 
            let yql_query = 'select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.' +
                'places(1)%20where%20text%3D%22'; 
            let yql_query_final = base_URL + yql_query + city + "%22)&format=json&env=store%3A%2F%2Fdatatables." +
                "org%2Falltableswithkeys"; 
            $.get(yql_query_final, function (data) {
                let loc = data.query.results.channel.location.city;
                let country = data.query.results.channel.location.country;
                let temp = Math.round((data.query.results.channel.item.condition.temp - 32) / 1.8).toFixed(1);
                let wind = (data.query.results.channel.wind.speed*0.44704).toFixed (2);
                let presure = (data.query.results.channel.atmosphere.pressure/1.3378).toFixed(2);
                let humidity = data.query.results.channel.atmosphere.humidity;
                document.getElementById("location").innerHTML = loc + ', ' + country;
                document.getElementById("temp").innerHTML = temp + ' °C';
                document.getElementById("wind").innerHTML = wind + ' м/с';
                document.getElementById("bar").innerHTML = presure + ' мм';
                document.getElementById("humidity").innerHTML = humidity + ' %';
	    })
        },
        error => {
            console.log("Rejected 2");
        } 
    )  
};
