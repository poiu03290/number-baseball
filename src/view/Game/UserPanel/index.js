import axios from 'axios'
import React, { useCallback } from 'react'
import { useCookies } from 'react-cookie';
import './index.css'

const UserPanel = (props) => {

    const { answer, getScore, decreaseLife, resetLifeTime, addRoundHistory, setScore, level } = props
    const [cookies] = useCookies(['data']);

    const handleKeyDown = useCallback((event) => {
        const guess = event.target.value

        const checkIfDuplicateValue = (value) => {
            for (let valueIndex = 0; valueIndex < value.length; valueIndex++) {
                let focus = value[valueIndex]

                for (let randIndex = (valueIndex + 1); randIndex < value.length; randIndex++) {
                    if (value[randIndex].includes(focus)) {
                        return false
                    }
                }
            }

            return true
        }

        const checkIsProperLengthValue = (value) => value.length === answer.length

        if (event.key === 'Enter') {
            try {
                if (!checkIfDuplicateValue(guess)) {
                    throw Error('중복된 값을 제출할 수 없습니다.')
                }

                if (!checkIsProperLengthValue(guess)) {
                    throw Error(`${answer.length}자리의 숫자를 제출해야 합니다.`)
                }
            } catch (error) {
                alert(error)
                event.target.value = ''
                return
            }

            if (checkIfDuplicateValue && checkIsProperLengthValue) {
                axios.post('http://localhost:65100/game', {
                    id: cookies.data?.id,
                    guess: guess,
                    answer: answer,
                })
            }
            const { strike, ball, out } = getScore(guess, answer)
            
            setScore(strike, ball, out)
            decreaseLife()
            resetLifeTime()
            addRoundHistory({
                strike, ball, out, value: guess
            })
            event.target.value = ""
        }
    }, [answer, decreaseLife])

    const onUserGuessInput = useCallback((event) => {
        const maxLengthCheck = (event) => {
            if (event.target.value.length > event.target.maxLength) {
                event.target.value = event.target.value.slice(0, event.target.maxLength)
            }
        }
        
        return maxLengthCheck(event)
    }, [])

    return (
        <div className='userpanel-container'>
            <input
                className='user-input-box'
                type="number"
                maxLength={level}
                onKeyDown={handleKeyDown}
                onInput={onUserGuessInput} />
        </div>
    )
}

export default UserPanel