import React from 'react'
import reactDom from 'react-dom'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeScript } from '@chakra-ui/react'
import theme from './theme'
import { BrowserRouter, BrowserRouter as router, Route, Router } from 'react-router-dom'
import './index.css'
reactDom.render(
    <ChakraProvider>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ChakraProvider>,
    document.getElementById('root')
)

