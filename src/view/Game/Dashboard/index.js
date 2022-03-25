import React from 'react'
import TimerImage from '../../../assets/Timer.png'
import HeartImage from '../../../assets/red_heart.png'
import './index.css'

const Dashboard = (props) => {

    const { lifetimeSeconds } = props;

    const containerStyles = {
        height: 20,
        width: '128px',
        backgroundColor: "#e0e0de",
        borderRadius: 50,
      }
    
      const fillerStyles = {
        height: '100%',
        width: `calc(100/60*+${lifetimeSeconds}%)`,
        backgroundColor: "#2563EB",
        borderRadius: 'inherit',
        textAlign: 'right'
      }
    
      const labelStyles = {
        padding: 5,
        color: 'black',
        fontSize: '12px'
      }

    return(
        <div className="dashboard-container">   
            <div>
                <div className="dashboard-item" style={{ padding: 4 }}>
                    <img alt={'타이머 이미지'} className="timer-Image" src={TimerImage} />
                    <div style={containerStyles}>
                        <div style={fillerStyles}>
                            <span style={labelStyles}>00:{lifetimeSeconds < 10 ? `0${lifetimeSeconds}` : lifetimeSeconds}</span>
                        </div>
                    </div>
                </div>
                <div className='progress-bar'>
                    <div className='loading-bar bg-blue-600 ...'></div>
                </div>
            </div>
            <div className="dashboard-item">
                <img alt={'하트 이미지'} className="heart-Image" src={HeartImage} />
                <h2>X {props.life}</h2>
            </div>
        </div>
    )
}

export default Dashboard