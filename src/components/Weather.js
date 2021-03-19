import React from 'react';

import { 
    Heading,
    Text,
    Input, 
    InputGroup, 
    Button,
    Icon,
    Center
} from '@chakra-ui/react';

import { BsArrowRight } from 'react-icons/bs';
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
                    
                <InputGroup mb="5" size="sm" w={{base: "100%", md: "45%", lg: "25%"}} borderColor="black" onChange={this.handleChange}>
                    <Input
                        pr="4.5rem"
                        type="text"
                        placeholder="Enter City"
                        id="city"
                    />
                    
                        <Button type="submit" colorScheme="teal" h="2rem" ml="3" size="md" onClick={this.handleSubmit}>
                            <Icon as={BsArrowRight} w={8} h={8} color="blue.100" />
                        </Button>
                    
                </InputGroup>
                
                <Text fontSize="20px">Weather Forecast For <b>{this.state.city}</b> </Text>
                <Text fontWeight="600">{ moment().format('h:mm a ,MMMM Do YYYY') }</Text>
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
                        <div key={elm.id} className>
                            <Text fontSize="17px">
                                Weather: <b>{_.capitalize(elm.description)}</b>
                            </Text>
                            <Center>
                                <img src={`http://openweathermap.org/img/wn/${elm.icon}@2x.png`} alt="" height="120px" width="120px" />
                            </Center>
                            
                        </div>
                        
                    )
                })}
                
            </div>
        )
    }
    
}

export default Weather;