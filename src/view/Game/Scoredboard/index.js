import React from 'react'
import CircularSignal from './CircularSignal'
import ScoreText from './ScoreText'
import './index.css'

const ScoredBoard = (props) => {

    const { strike, ball, out, level } = props

    const scoreComponentMapping = [...Array(level).keys()].map((circularSignalIndex) => 
        <CircularSignal
            key={circularSignalIndex}
            isStrikeLightOn={strike > circularSignalIndex}
            isBallLightOn={ball > circularSignalIndex}
            isOutLightOn={out > circularSignalIndex}
        />)

    return (
        <div className="scored-board">
            <div className='score-text'>
                <ScoreText />
            </div>
            <div className="scroe-mapping-box">
                {scoreComponentMapping}
            </div>
        </div>
    )
}

export default ScoredBoard