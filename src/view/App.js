import React from 'react'
import { Route } from 'react-router-dom'
import Home from './Home/index'
import PlayGround from './Game/index'
import End from './End/index'
import JoinMembership from './JoinMembership/index'


const App = () => {
    return (
        <div className={'fill-height'}>
            <Route exact path="/" component={Home} />
            <Route path="/play-ground" component={PlayGround} />
            <Route path="/End" component={End} />
            <Route path="/JoinMembership" component={JoinMembership} />
        </div>
    )
}

export default App