import React from 'react'
import CloseImage from '../../../assets/close.png'

const RoundHistory = (props) => {
    const { roundModalClose, historyArray, playTime, answer, scorePoint, nickname } = props

    return (
        <div>
            <div>
                <div className="front-ground">
                    <div className="modal">
                        <div className='modal-header'>
                            <h1>{nickname}님의 게임 기록</h1>
                            <button onClick={roundModalClose}><img src={CloseImage} alt="로그인 닫기" className='img-close'/></button>
                        </div>
                        <div className='history-info'>
                            <div>
                                <div>플레이시간 : {playTime}초</div>
                                <div>정답 : {answer}</div>
                                <div>점수 : {scorePoint}점</div>
                            </div>    
                        </div>
                        <div className='history-head flex-row'>
                            <div className='his-head-trial'>시도</div>
                            <div className='his-head-guess'>입력</div>
                            <div className='his-head-strike'>스트라이크</div>
                            <div className='his-head-ball'>볼</div>
                        </div>
                        {historyArray.map((history, index) => 
                        <div className='his-map-line' key={index}>
                            <span className='his-map-trial'>{index + 1}번째</span>
                            <span className='his-map-guess'>{history.guess}</span>
                            <span className='his-map-strike'>{history.strike}</span>
                            <span className='his-map-ball'>{history.ball}</span>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoundHistory