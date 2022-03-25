import React from 'react'

const CircularSignal = (props) => {

    const { isStrikeLightOn, isBallLightOn, isOutLightOn } = props

    return (
        <div>
            <div className="CircularContainer">
            {
                isStrikeLightOn ? (
                    <div className="StrikeCircularBackground"></div>
                )   :   (
                    <div className="StrikeCircularLine"></div>
                )
            }
            </div>
            <div className="CircularContainer">
            {
                isBallLightOn ? (
                    <div className="BallCircularBackground"></div>
                )   :   (
                    <div className="BallCircularLine"></div>
                )
            }
            </div>
            <div className="CircularContainer">
            {
                isOutLightOn ? (
                    <div className="OutCircularBackground"></div>
                )   :   (
                    <div className="OutCircularLine"></div>
                )
            }
            </div>
        </div>
    )
}

export default CircularSignal