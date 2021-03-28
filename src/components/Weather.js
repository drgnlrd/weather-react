import React from 'react';
import Chart from 'chart.js';

import { 
    // Heading,
    Text,
    Input, 
    InputGroup, 
    Button,
    Icon,
    Box,
    Grid,
    GridItem,
    Center
} from '@chakra-ui/react';

import { BiCurrentLocation } from 'react-icons/bi';
import { 
    WiDaySunny, 
    WiNightClear, 
    WiDayCloudy, 
    WiNightCloudy, 
    WiCloudy, 
    WiCloud,
    WiRainMix,
    WiDayRain,
    WiNightRain,
    WiNightThunderstorm,
    WiDaySnow,
    WiNightSnow,
    WiDayFog,
    WiNightFog,
    WiDayThunderstorm
} from 'react-icons/wi'

import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

class Weather extends React.Component{
    constructor(props) {
        super(props);

        this.state={
            city: 'London',
            lat: "51.5073219",
            lng: "-0.1276474",
            data:{
                main: {},
                weather: [],
                wind: {},
                sys: {
                    country: '',
                }
            },
            daily:[],
            unit: "celsius"
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.getWeather = this.getWeather.bind(this);
        this.changeUnit = this.changeUnit.bind(this);
    }

    chartRef = React.createRef();

    componentDidMount(){
       this.getWeather();
       const myChartRef = this.chartRef.current.getContext("2d");

       new Chart(myChartRef, {
           type: "line",
           data:{
               labels: ["Jan", "Feb", "March"],
               datasets:[
                   {
                        label: "Sales",
                        data: [86,67,91],
                    }
                ]
           },
           options:{
                maintainAspectRatio: false,
                responsive: true,
                scales:{
                    yAxes:[{
                        ticks:{
                            display: false
                        }
                    }],
                    xAxes:[{
                        ticks:{
                            display: false
                        }
                    }]
                }
           }
       });

    }
    changeUnit = () =>{

        if(this.state.unit === "celsius"){
            this.setState({
                unit: "fahrenheit"
            })
        }
        else{
            this.setState({
                unit: "celsius"
            })
        }
    }

    getWeather = async() =>{
        const apiKey = '57fcbed41cdcea0371895970b777fb88';
        const geoApiKey = '0061409fee2f4e3dade5ae94c41be4e8';

        await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${this.state.city}&key=${geoApiKey}&limit=1`)
        .then((res)=>{
            console.log('City coords:' ,res.data);

            this.setState({
                lat: res.data.results[0].geometry.lat,
                lng: res.data.results[0].geometry.lng
            })  
        })
        await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.lat}&lon=${this.state.lng}&exclude=minutely,hourly,alerts&appid=${apiKey}`)
        .then((res)=>{
            console.log(res.data);
            console.log(res.data.daily.slice(1, 4));
            this.setState({
                daily: res.data.daily,
            })
        })
        await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&appid=${apiKey}`)
        .then((res)=>{
            const data = res.data;
            console.log('weather data: ', data);
            console.log('weather', data.weather);
            this.setState({
                data
            })
        })
    }

    handleLocation = () =>{
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition((position)=>{
                console.log('position:', position);
                console.log('latitude:', position.coords.latitude);
                console.log('longitude:', position.coords.longitude);
                let long = position.coords.longitude;
                let lat = position.coords.latitude;

                axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
                .then(res=>{
                    console.log('data',res.data);
                    this.setState({
                        city: res.data.city,
                    })
                })
                .then(()=>{
                    this.handleSubmit();
                })
                
            })
        }else{
            alert('GeoLocation Not Available In The Browser')
        }
    }

    handleSubmit = (event) =>{
        this.getWeather();
    }

    handleChange = (event) =>{
        this.setState({
            city: event.target.value,
        })
    }


    render(){
        let data = this.state.data
        let daily = this.state.daily
        return(
            <div>
                  
                <InputGroup mb="5" size="sm" w={{base: "100%", md: "45%", lg: "25%"}} borderColor="black" onChange={this.handleChange} onBlur={this.handleSubmit} >
                    <Input
                        pr="4.5rem"
                        type="text"
                        placeholder="Enter Your City"
                        id="city"
                        borderRadius="5px"
                    />
                    
                        <Button type="submit" colorScheme="teal" h="2rem" ml="3" size="md" onClick={this.handleLocation}>
                            <Icon as={BiCurrentLocation} w={6} h={6} color="blue.100" />
                        </Button>
                        <Button type="submit" colorScheme="teal" h="2rem" ml="3" size="md" onClick={this.changeUnit}>
                            <Text fontSize="14px">&#8457; / &#8451;</Text>
                        </Button>
                    
                </InputGroup>
                <Grid 
                    minH="65vh"
                    templateColumns={["repeat(1, 1fr)","repeat(1, 1fr)","repeat(7, 1fr)"]}
                    templateRows={["repeat(4, auto)","repeat(4, auto)","repeat(2, auto)"]}
                    gap={4}
                    
                >
                    <GridItem rowSpan={[1,2,2]} colSpan={[1,3,3]} >
                        <Box p={[3,4,5]} bg="rgba(255,255,255,1)" opacity="0.8" borderRadius="5px" h="100%" boxShadow="lg" border="1px solid rgba(255,255,255,1)" textAlign="center" >

                            
                            <Text fontSize="20px"><b>{this.state.city +', '+ (data.sys.country?data.sys.country:"") }</b> </Text>
                            <Text fontWeight="600">{ moment().format('h:mm A, MMMM Do YYYY') }</Text>
                            <Text fontWeight="600">{ moment().format('dddd') }</Text>
                            <br/>
                            { data && data.weather.length > 0 && data.weather.map(elm=>{
                                return(
                                    <div key={elm.id}>
                                        
                                        <Text fontWeight="900" fontSize="45px">
                                            {
                                                {
                                                    '01d': <Icon as={WiDaySunny} boxSize="2em" />,
                                                    '01n': <Icon as={WiNightClear} boxSize="2em"/>,
                                                    '02d': <Icon as={WiDayCloudy} boxSize="2em" />,
                                                    '02n': <Icon as={WiNightCloudy} boxSize="2em" />,
                                                    '03d': <Icon as={WiCloud} boxSize="2em" />,
                                                    '03n': <Icon as={WiCloud} boxSize="2em" />,
                                                    '04d': <Icon as={WiCloudy} boxSize="2em" />,
                                                    '04n': <Icon as={WiCloudy} boxSize="2em" />,
                                                    '09d': <Icon as={WiRainMix} boxSize="2em" />,
                                                    '09n': <Icon as={WiRainMix} boxSize="2em" />,
                                                    '10d': <Icon as={WiDayRain} boxSize="2em" />,
                                                    '10n': <Icon as={WiNightRain} boxSize="2em" />,
                                                    '11d': <Icon as={WiDayThunderstorm} boxSize="2em" />,
                                                    '11n': <Icon as={WiNightThunderstorm} boxSize="2em" />,
                                                    '13d': <Icon as={WiDaySnow} boxSize="2em" />,
                                                    '13n': <Icon as={WiNightSnow} boxSize="2em" />,
                                                    '50d': <Icon as={WiDayFog} boxSize="2em" />,
                                                    '50n': <Icon as={WiNightFog} boxSize="2em" />,
                                                }[elm.icon]
                                            }
                                            {this.state.unit === "celsius" ? Math.round((data.main.temp-273.15 + Number.EPSILON) * 100) / 100:Math.round((((data.main.temp-273.15)*(9/5)+32) + Number.EPSILON) * 100) / 100 }{this.state.unit==="celsius"?<sup>&#8451;</sup>:<sup>&#8457;</sup>}
                                        </Text>
                                        <Text fontSize="40px">
                                            <b>{_.capitalize(elm.main)}</b>
                                        </Text>
                                        
                                    </div>
                                    
                                )
                            })}
                            {/* <h5>Min-Temperature: {data.main.temp_min}&#8451;</h5>
                            <h5>Max-Temperature: {data.main.temp_max}&#8451;</h5> */}
                            {/* <Text>Pressure:<b> {data.main.pressure}</b> Pa</Text> */}
                            <br/>
                            <Text fontSize="17px" >Humidity:<b> {data.main.humidity}</b> %</Text>
                            <Text fontSize="17px">Wind-Speed:<b> {data.wind.speed}</b> km/j</Text>
                            
                            

                        </Box> 
                    </GridItem>
                    
                    <GridItem rowSpan={[1,1,1]} colSpan={[1,4,4]} h="100%" maxH="210px" maxW="88vw" >
                        <Box p={[3,4,5]} bg="rgba(255,255,255,1)" opacity="0.8" borderRadius="5px" h="100%" boxShadow="lg" display="block" position="relative" >
                            <canvas
                                id="myChart"
                                ref={this.chartRef}
                                style={{display: "block", height: "100px", width:"20px"}}
                             />
                        </Box> 
                    </GridItem>
                    
                    <GridItem rowSpan={[2,1,1]} colSpan={[1,4,4]} >
                        <Grid
                        h="100%"
                        templateColumns={["repeat(2, 1fr)","repeat(2, 1fr)","repeat(4, 1fr)"]}
                        templateRows={["repeat(2, auto)","repeat(2, auto)","repeat(1, 1fr)"]}
                        gridTemplateRows="auto"
                        gap={4}
                        >
                        {daily.slice(1,5).map((day) => {
                            return(
                                <GridItem key={day.id} rowSpan={[1,1,1]} colSpan={[1,1,1]} >
                                    <Box p={[3,4,5]} bg="rgba(255,255,255,1)" opacity="0.8" borderRadius="5px" h="100%" boxShadow="lg" >
                                        <Center>
                                            <Text> { moment.unix(day.dt).format('MMMM D') } </Text>
                                        </Center>
                                        <Center mb={2} >
                                            <Text> <b>{ moment.unix(day.dt).format('dddd') }</b> </Text>
                                        </Center>
                                        
                                        
                                            {day.weather.map(elm => {
                                                return(
                                                    <Box textAlign="center" key={elm.id} >
                                                        {
                                                            {
                                                                '01d': <Icon as={WiDaySunny} w={12} h={12} />,
                                                                '01n': <Icon as={WiNightClear} w={12} h={12} />,
                                                                '02d': <Icon as={WiDayCloudy} w={12} h={12} />,
                                                                '02n': <Icon as={WiNightCloudy} w={12} h={12} />,
                                                                '03d': <Icon as={WiCloud} w={12} h={12} />,
                                                                '03n': <Icon as={WiCloud} w={12} h={12} />,
                                                                '04d': <Icon as={WiCloudy} w={12} h={12} />,
                                                                '04n': <Icon as={WiCloudy} w={12} h={12} />,
                                                                '09d': <Icon as={WiRainMix} w={12} h={12} />,
                                                                '09n': <Icon as={WiRainMix} w={12} h={12} />,
                                                                '10d': <Icon as={WiDayRain} w={12} h={12} />,
                                                                '10n': <Icon as={WiNightRain} w={12} h={12} />,
                                                                '11d': <Icon as={WiDayThunderstorm} w={12} h={12} />,
                                                                '11n': <Icon as={WiNightThunderstorm} w={12} h={12} />,
                                                                '13d': <Icon as={WiDaySnow} w={12} h={12} />,
                                                                '13n': <Icon as={WiNightSnow} w={12} h={12} />,
                                                                '50d': <Icon as={WiDayFog} w={12} h={12} />,
                                                                '50n': <Icon as={WiNightFog} w={12} h={12} />,
                                                            }[elm.icon]
                                                        }
                                                        <Text fontSize="18px" fontWeight="600" >{this.state.unit === "celsius" ? Math.round((day.temp.max-273.15 + Number.EPSILON) * 100) / 100:Math.round((((day.temp.max-273.15)*(9/5)+32) + Number.EPSILON) * 100) / 100  }{this.state.unit==="celsius"?<sup>&#8451;</sup>:<sup>&#8457;</sup>}</Text>
                                                        <Text fontSize="16px" fontWeight="900" >{elm.main}</Text>
                                                    </Box>
                                                )
                                            })}
                                        
                                        
                                    </Box> 
                                </GridItem>
                            )
                            
                        })}
                        </Grid>
                        
                    </GridItem>
                </Grid>
                 
                
                
                
            </div>
        )
    }
    
}

export default Weather;