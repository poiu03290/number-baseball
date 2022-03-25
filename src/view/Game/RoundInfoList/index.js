import React from 'react'
import RoundInfo from '../RoundInfo'

const RoundInfoList = (props) => {

    const roundInfoMapping = props.rounds.map((round, index) =>
        (<RoundInfo key={index} strike={round.strike} ball={round.ball} out={round.out} value={round.value} trial={index + 1}/>))

    return (
        <div>
            {roundInfoMapping}
        </div>
    )
}

export default RoundInfoList