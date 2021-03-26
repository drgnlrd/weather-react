import React from 'react';

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
    // Center
} from '@chakra-ui/react';

import { BiCurrentLocation } from 'react-icons/bi';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

class Weather extends React.Component{
    constructor(props) {
        super(props);

        this.state={
            city: 'London',
            data:{
                main: {},
                weather: [],
                wind: {},
            },
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        const apiKey = '57fcbed41cdcea0371895970b777fb88';
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&appid=${apiKey}&units=metric`)
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
        const apiKey = '57fcbed41cdcea0371895970b777fb88';
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&appid=${apiKey}&units=metric`)
        .then((res)=>{
            const data = res.data;
            console.log('weather data: ', data);
            console.log('weather', data.weather);
            this.setState({
                data
            })
        })
    }

    handleChange = (event) =>{
        this.setState({
            city: event.target.value,
        })
    }


    render(){
        let data = this.state.data
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
                    
                </InputGroup>
                <Grid 
                    minH="65vh"
                    templateColumns={["repeat(1, 1fr)","repeat(7, 1fr)","repeat(7, 1fr)"]}
                    templateRows={["repeat(4, 0.2fr)","repeat(2, 1fr)","repeat(2, 1fr)"]}
                    gap={4}
                    
                >
                    <GridItem rowSpan={[1,2,2]} colSpan={[1,3,3]} >
                        <Box p={[3,4,5]} bg="rgba(255,255,255,1)" opacity="0.8" borderRadius="5px" h="100%" boxShadow="lg" border="1px solid rgba(255,255,255,1)" >

                            <Text fontWeight="600">{ moment().format('h:mm a ,MMMM Do YYYY') }</Text>
                            <Text fontSize="20px">Weather Forecast For <b>{this.state.city}</b> </Text>
                
                            <br/>
                            <Text>Temperature:<b> {data.main.temp}</b> &#8451;</Text>
                            {/* <h5>Min-Temperature: {data.main.temp_min}&#8451;</h5>
                            <h5>Max-Temperature: {data.main.temp_max}&#8451;</h5> */}
                            <Text>Pressure:<b> {data.main.pressure}</b> Pa</Text>
                            <Text>Humidity:<b> {data.main.humidity}</b> g/m<sup>3</sup></Text>
                            <Text>Wind-Speed:<b> {data.wind.speed}</b> km/j</Text>
                            <br/>
                            { data && data.weather.length > 0 && data.weather.map(elm=>{
                                return(
                                    <div key={elm.id}>
                                        <Text fontSize="17px">
                                            Weather: <b>{_.capitalize(elm.description)}</b>
                                        </Text>
                                        <img src={`http://openweathermap.org/img/wn/${elm.icon}@2x.png`} alt="" height="120px" width="120px" />
                                        
                                    </div>
                                    
                                )
                            })}

                        </Box> 
                    </GridItem>
                    
                    <GridItem rowSpan={[1,1,1]} colSpan={[1,4,4]} >
                        <Box p={[3,4,5]} bg="rgba(255,255,255,1)" opacity="0.8" borderRadius="5px" h="100%" boxShadow="lg" >
                    
                        </Box> 
                    </GridItem>
                    
                    <GridItem rowSpan={[2,1,1]} colSpan={[1,4,4]} >
                        <Grid
                        h="100%"
                        templateColumns={["repeat(2, 1fr)","repeat(4, 1fr)","repeat(4, 1fr)"]}
                        templateRows={["repeat(2, 1fr)","repeat(1, 1fr)","repeat(1, 1fr)"]}
                        gridTemplateRows="auto"
                        gap={4}
                        >
                            <GridItem rowSpan={[1,1,1]} colSpan={[1,1,1]} >
                                <Box p={[3,4,5]} bg="rgba(255,255,255,1)" opacity="0.8" borderRadius="5px" h="100%" boxShadow="lg" >
                        
                                </Box> 
                            </GridItem>
                            <GridItem rowSpan={[1,1,1]} colSpan={[1,1,1]} >
                                <Box p={[3,4,5]} bg="rgba(255,255,255,1)" opacity="0.8" borderRadius="5px" h="100%" boxShadow="lg" >
                        
                                </Box> 
                            </GridItem>
                            <GridItem rowSpan={[1,1,1]} colSpan={[1,1,1]} >
                                <Box p={[3,4,5]} bg="rgba(255,255,255,1)" opacity="0.8" borderRadius="5px" h="100%" boxShadow="lg" >
                        
                                </Box> 
                            </GridItem>
                            <GridItem rowSpan={[1,1,1]} colSpan={[1,1,1]} >
                                <Box p={[3,4,5]} bg="rgba(255,255,255,1)" opacity="0.8" borderRadius="5px" h="100%" boxShadow="lg" >
                        
                                </Box> 
                            </GridItem>
                        </Grid>
                        
                    </GridItem>
                </Grid>
                 
                
                
                
            </div>
        )
    }
    
}

export default Weather;