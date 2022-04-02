import React, { useCallback, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import axios from 'axios'
import Ranking from './Ranking'
import RoundHistory from './RoundHistory'
import './index.css'

const End = (location) => {
    const history = useHistory()
    const [scoreArray, setScoreArray] = useState([])
    const [historyArray, setHistoryArray] = useState([])
    const [playTime, setplayTime] = useState('')
    const [cookies] = useCookies(['data']);
    const scorePoint = history.location.state.scoreSum
    const answer = history.location.state.answer

    useEffect(() => {
        axios.post('http://localhost:65100/rank')
        .then((response) => {
            setScoreArray(response.data)
        })
        axios.post('http://localhost:65100/playTime', {id: cookies.data.id})
        .then((response) => {
            setplayTime(response.data[0].RUN_TIME)
        })
        axios.post('http://localhost:65100/gameHistory', {id: cookies.data.id})
        .then((response) => {
            setHistoryArray(response.data)
        })
    }, [])

    const onGameResetButtonClick = useCallback(() => {
        if (window.confirm("다시 시작하시겠습니까?")) {
            history.push('/');
          }
    }, [])

    const rankingModalOpen = useCallback(() => {
        document.querySelector('.back-ground').style.display = 'flex';
    }, []);

    const rankingModalClose = useCallback(() => {
        document.querySelector('.back-ground').style.display = 'none';
    }, [])

    const roundModalOpen = useCallback(() => {
        document.querySelector('.front-ground').style.display = 'flex';
    }, []);

    const roundModalClose = useCallback(() => {
        document.querySelector('.front-ground').style.display = 'none';
    }, [])
    

    return (
        <div>
            <RoundHistory roundModalClose={roundModalClose}
                historyArray={historyArray} 
                playTime={playTime} 
                answer={answer}
                scorePoint={scorePoint}
                nickname={cookies.data?.nickname}
                />
            <Ranking rankingModalClose={rankingModalClose} scoreArray={scoreArray}/>
        <div className="container font-sans ...">
            <div className='rank-box'>
                <div className='box-info'>
                    <button onClick={roundModalOpen} className='box-point'>
                        <div className='point font-mono ...'>{scorePoint}</div>
                        <span className='point-info'>{cookies.data?.nickname}님의 점수</span>
                        <span className='box-desc'>이번 라운드의 기록이 궁금하시면<br /> 여기를 눌러주세요!</span>
                    </button>
                    <button onClick={rankingModalOpen} className='box-player-count'>
                        <div className='num-count font-mono ...'>{scoreArray.length}</div>
                        <span className='txt-count'>게임을 완료한<br/> 
                            플레이어의 수
                        </span>
                        <span className='box-desc'>모든 플레이어의 점수가 궁금하시면<br/> 여기를 눌러주세요!</span>
                    </button>
                </div>
                <div className="ranking"> 
                    <h2 className='ranking-hed'>10명을 위한 명예의 전당</h2>
                    {scoreArray.map((score, index) => 
                        <div className='map-line' key={index}>
                        <span className='map-ranking'>{index + 1}위</span>
                        <span className='map-name'>{score.user_nickname}님</span>
                        <span className='map-score'>{score.score}점</span>
                    </div>
                    ).slice(0, 10)}
                </div>
                <button
                    className="game-reset-button  rounded-3xl font-sans ... bg-blue-600 text-base ..."   
                    onClick={onGameResetButtonClick}>
                    다시 시작
                </button>
            </div>
        </div>
    </div>
    )
}

export default End