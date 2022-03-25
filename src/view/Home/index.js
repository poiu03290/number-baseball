import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import './index.css'
import { useCookies } from 'react-cookie';
import axios from 'axios'
import ValidationForm from '../../components/loginValidationForm'

const Home = () => {
    
    const history = useHistory()
    const [cookies, setCookie, removeCookie] = useCookies(['data']);
    const [inputStatus, setInputStatus] = useState('')
    const [code, setCode] = useState(0)
    const [profile, setProfile] = useState({
        id: '',
        password: '',
        nickname: cookies.data?.nickname
    })

    const setGlobalCookie = (id, nickname) => {
        setCookie('data', {id, nickname}, {maxAge:'43200000'}, {path:'/'});
    }
    
    const setLevelOfDifficult = useCallback((radioBtnName) => {
        if (!inputStatus) {
            alert('난이도를 설정해주세요!')
            return
        }
        history.push({
            pathname: '/play-ground',
            level: radioBtnName,
        })
    }, [inputStatus])

    const handleClickRadioButton = (radioBtnName) => {
        setInputStatus(radioBtnName)
    }

    const onGameStartButtonClick = useCallback(() => {
        axios.post('http://localhost:65100/ticket', {id: cookies.data.id, nickname: cookies.data.nickname})
        setLevelOfDifficult(inputStatus)
    }, [inputStatus])

    const onJoinMemberButtonClick = useCallback(() => {
        history.push('/JoinMembership')
    }, [])

    const onlogoutButtonClick = useCallback(() => {
        if (window.confirm("정말 로그아웃을 하시겠습니까?")) {
            removeCookie('data')
          }
    }, [])

    const goGameStart = useCallback(() => {
        history.go(0)
    }, [])

    const onLoginClick = useCallback(async () => {
        await axios.post('http://localhost:65100/auth', profile).then((response) => {
            alert('로그인을 성공하셨습니다.')
            setGlobalCookie(`${response.data.id}`, `${response.data.nickname}`) 
            goGameStart()
        }).catch((error) => {
            const {code, message} = error.response.data
            if(code === 3) {
                setCode(code)
            }
            if(code === 4) {
                setCode(code)
            }
        })
    }, [profile])

    return (
        <div className="container">
            {
                !cookies.data ? (
                <div>
                    <div className='login-container rounded-lg ... shadow-inner ...'>
                        <div className='game-title'>
                            <h1>Number Baseball!</h1>
                        </div>
                        <div className='login-wrap'>
                            <div className="login-id-form">
                                <ValidationForm
                                    id='login-id-input'
                                    className='login-input border-solid border border-gray-400 font-sans ... rounded-sm ... '
                                    placeholder='아이디를 입력해 주세요.'
                                    maxLength='15'
                                    value={profile.id}
                                    validations={[
                                        () => ({
                                            result: code === 3,
                                            errorMessage: '아이디를 다시 입력해주세요.'
                                        })
                                    ]}
                                    onChange={(event) => {setProfile({...profile, id: event.target.value})}}
                                    />
                            </div>
                            <div className='login-pw-form'>
                                <ValidationForm
                                    id='login-password-input'
                                    className='login-input border-solid border border-gray-400 font-sans ... rounded-sm ...' 
                                    type='password'
                                    placeholder='비밀번호를 입력해 주세요.'
                                    maxLength='30'
                                    value={profile.password}
                                    validations={[
                                        () => ({
                                            result: code === 4,
                                            errorMessage: '아이디나 비밀번호를 다시 입력해주세요.'
                                        })
                                    ]}
                                    onChange={(event) => {setProfile({...profile, password: event.target.value})}}
                                    />
                            </div>
                            <button className='login-btn rounded-3xl font-sans ... bg-blue-600 text-base ...' onClick={onLoginClick}>로그인</button>
                        </div>
                        <button
                            className='join-btn text-gray-400 underline ...'
                            onClick={onJoinMemberButtonClick}>
                            회원가입 하기
                        </button>
                    </div>
                </div>
                ) : (
                    <div>
                        <div className='game-start-container rounded-lg ...'>
                            <h1 className='title font-sans ... text-3xl ... font-semibold ...'>
                                {cookies.data?.nickname}의
                                <div> 
                                    Number BaseBall!
                                </div>
                            </h1>
                            <button
                                className="game-start-button  rounded-3xl font-sans ... bg-blue-600 text-base ..."
                                onClick={onGameStartButtonClick}>
                                게임 시작
                            </button>
                            <div className='cont-level'> 
                                <label htmlFor="easy" className='cont-radio'>쉬움
                                    <input type="radio" 
                                        onClick={() => handleClickRadioButton(3)} 
                                        className='level'
                                        name="q1-btnradio"
                                        id="easy" />
                                    <span className='checkmark'></span>
                                </label>
                                <label htmlFor="medium" className='cont-radio'>보통
                                    <input type="radio"
                                        onClick={() => handleClickRadioButton(4)}
                                        className='level'
                                        name="q1-btnradio" 
                                        id="medium" />
                                    <span className='checkmark'></span>
                                </label>
                                <label htmlFor="difficult" className='cont-radio'>어려움
                                    <input type="radio"
                                        onClick={() => handleClickRadioButton(5)}
                                        className='level'
                                        name="q1-btnradio" 
                                        id="difficult" />
                                    <span className='checkmark'></span>
                                </label> 
                            </div>
                            <button
                                className='logout-button text-gray-400 underline ...'
                                onClick={onlogoutButtonClick}>
                                로그아웃
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Home