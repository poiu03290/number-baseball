import React, { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import axios from 'axios'
import Dashboard from './Dashboard'
import ScoredBoard from './Scoredboard'
import UserPanel from './UserPanel'
import RoundInfoList from './RoundInfoList'
import './index.css'

const maxLifeTimeSeconds = 59

const PlayGround = (location) => {
  const history = useHistory()
  const [cookies] = useCookies(['data']);
  const [level] = useState(location.location.level)
  const [answer, setAnswer] = useState('')
  const [answerLength] = useState(level)
  const [lifetimeSeconds, setLifetimeSeconds] = useState(maxLifeTimeSeconds)
  const [life, setLife] = useState(15)
  const [strike, setStrike] = useState(0)
  const [ball, setBall] = useState(0)
  const [out, setOut] = useState(0)
  const [roundHistories, setRoundHistories] = useState([])
  const scoreSum = ((level * life) * 10) + 10

  useEffect(() => {
    const countdown = setInterval(() => {
      setLifetimeSeconds(prevState => prevState - 1)
    }, 1000)

    const generatedAnswer = generateAnswer()
    console.log('generated answer:', generatedAnswer)
    setAnswer(generatedAnswer)
    return () => clearInterval(countdown)
    
  }, [])

  useEffect(() => {
    if (lifetimeSeconds <= 0) {
      decreaseLife()
      resetLifeTime()
    }
  }, [lifetimeSeconds])

  useEffect(() => {
    if (life <= 0) {
      if (window.confirm("정답은" + answer + " 입니다! 게임을 한판 더 하시겠습니까?")) {
        history.push('/')
      }
      else {
        history.push({
          pathname: '/End',
          state: {
            answer: answer,
            scoreSum: scoreSum,
          },
          nickname: cookies.data?.nickname
        })
      }
    }
  }, [life])

  useEffect(() => {
    if (strike === level) {
      axios.post('http://localhost:65100/gameEnd', {
        id: cookies.data?.id,
        scoreSum: scoreSum,
        answer: answer,
      })
      alert("정답입니다!!!")
      history.push({
        pathname: '/End',
        state: {
          answer: answer,
          scoreSum: scoreSum,
        },
        nickname: cookies.data?.nickname
      })
    }
  }, [life])

  const generateAnswer = useCallback(() => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const answer = []
    for (let answerIndex = 0; answerIndex < answerLength; answerIndex++) {
      let select = Math.floor(Math.random() * arr.length)
      answer[answerIndex] = arr.splice(select, 1)[0]
    }

    return answer.join('')
  }, [])

  const decreaseLife = useCallback(() => {
    setLife(life - 1)
  }, [life])

  const resetLifeTime = useCallback(() => {
    setLifetimeSeconds(maxLifeTimeSeconds)
  }, [])

  const addRoundHistory = useCallback((result) => {
    setRoundHistories(roundHistories.concat(result))
  }, [roundHistories])

  const setScore = useCallback((strike, ball, out) => {
    setStrike(strike)
    setBall(ball)
    setOut(out)
  }, [])

  const getScore = (guess, answer) => {
    let strike = 0, ball = 0, out = 0

    for (let answerIndex = 0; answerIndex < answer.length; answerIndex++) {
      if (answer[answerIndex] === guess[answerIndex]) {
        strike += 1
      }
      else if (guess.includes(answer[answerIndex])) {
        ball += 1
      }
      else {
        out += 1
      }
    }

    return { strike, ball, out }
  }

  return (
    <div className="container flex-row">
      <div className="game-section container">
        <Dashboard
          life={life}
          lifetimeSeconds={lifetimeSeconds}
        />
        <UserPanel
          answer={answer}
          level={level}
          getScore={getScore}
          setScore={setScore}
          decreaseLife={decreaseLife}
          resetLifeTime={resetLifeTime}
          addRoundHistory={addRoundHistory}
        />
        <ScoredBoard strike={strike} ball={ball} out={out} level={level} />
      </div>
      <div className="info-list">
        <div className='info-header'>
          <div className='hed-round'>회차</div>
          <div className='hed-trial'>입력</div>
          <div className='hed-result'>결과</div>
        </div>
        <RoundInfoList rounds={roundHistories} />
      </div>
    </div>
  )
}

export default PlayGround