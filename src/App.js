import './App.css';
import { Box } from '@chakra-ui/react';
import Weather from './components/Weather';

function App() {
  return (
    // bgGradient="linear(to-r, #43cea2, #185a9d)"
    <Box w="100%" h="100%" minHeight="100vh" p={[3, 10, 10]} className="App" >
      <Box className="main-card" w="100%"minHeight="85vh" p={[2, 4, 8]} bg="rgba(255,255,255,0.55)" borderRadius="10px" opacity="0.75" border="1px solid rgba(255,255,255,0.5)" >
        <Weather />
      </Box>
    </Box>
  );
}

export default App;
