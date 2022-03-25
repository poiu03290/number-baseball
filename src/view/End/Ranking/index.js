import React from 'react'
import CloseImage from '../../../assets/close.png'

const Ranking = (props) => {

    const { rankingModalClose, scoreArray } = props
    
    return (
        <div>
            <div>
                <div className="back-ground">
                    <div className="modal">
                        <div className='modal-header'>
                            <h1>모든 플레이어의 순위표</h1>
                            <button onClick={rankingModalClose}><img src={CloseImage} alt="로그인 닫기" className='img-close'/></button>
                        </div>
                        {scoreArray.map((score, index) => 
                        <div className='map-line' key={index}>
                            <span className='map-ranking'>{index + 1}위</span>
                            <span className='map-name'>{score.user_nickname}님</span>
                            <span className='map-score'>{score.score}점</span>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ranking