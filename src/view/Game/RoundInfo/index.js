import React from 'react'
import './index.css'

const RoundInfo = (props) => {

    const { strike, ball, out, value, trial } = props

    return (
        <div className="info">
            <div className='info-box'>
            <div className="info-round">
                <b>{trial}</b>
            </div>
            <div className='info-trial'>
                {value}
            </div>
            <div className='info-score-name'>
                {strike}
                <div className="name-strike">Strike</div>
                {ball}
                <div className="name-ball">Ball</div>
            </div>
        </div>
        </div>
        
    )
}

export default RoundInfo