import axios from 'axios'
import React, { useCallback, useState, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import ValidationForm from '../../components/joinValidationForm'
import './index.css'

const JoinMembership = () => {

    const history = useHistory()
    const [profile, setProfile] = useState({
        id: '',
        password: '',
        repassword: '',
        nickname: ''
    })
    const [code, setCode] = useState(0)

    const validateRepassword = useMemo(() => {
        return profile.password && profile.password.length > 0
            && profile.password === profile.repassword ? 
            { 
                result: true, 
                errorMessage: '패스워드 확인 완료.'
            } : 
            undefined
    }, [profile.password, profile.repassword])

    const onJoinMembershipClick = useCallback(() => {
        axios.post('http://localhost:65100/join', profile)
        .then(() => {
            alert("회원가입이 완료되었습니다.")
            history.push('/')
        })
        .catch((error) => {
            const { code } = error.response.data
            if (code === 1){
                setCode(code)
            }
            if (code === 2){
                setCode(code)
            }
        })
    }, [profile])

    return (
        <div className='container' style={{ background: 'whitesmoke' }}>
            <div className='join-membership-form' style={{ background: 'white' }}>
                <h1 className='header'>
                    회원가입
                </h1>
                <div className='input-form'>
                    <div className='id-form'>
                        <label htmlFor='join-input-id'>
                            아이디
                        </label>
                        <ValidationForm 
                            id='join-input-id'
                            className='input border-solid border border-gray-500 font-sans ... rounded-sm ...'
                            placeholder='아이디 입력'
                            maxLength='15'
                            value={profile.id}
                            error={code === 1 ? { result: false, errorMessage: '아이디가 중복되었습니다.'} : undefined}
                            validations={
                                [
                                    (value) => {
                                        return { 
                                            result: value && value.length >= 5,
                                            errorMessage: '아이디를 5자이상 입력해주세요.'
                                        }
                                    }
                                ]
                            }
                            onChange={(event) => {setProfile({...profile, id: event.target.value})}}
                        />
                    </div>
                    <div className='pw-form'>
                        <label htmlFor='join-input-pw'>
                            비밀번호
                        </label>
                        <ValidationForm 
                            id='join-input-pw'
                            className='input border-solid border border-gray-500 font-sans ... rounded-sm ...'
                            placeholder='비밀번호 입력(6~20자)'
                            type='password'
                            maxLength='20'
                            value={profile.password}
                            validations={
                                [
                                    (value) => {
                                        return {
                                            result: value && value.length >= 6,
                                            errorMessage: '패스워드를 6자이상 입력해주세요.'
                                        }
                                    }
                                ]
                            }
                            onChange={(event) => {setProfile({...profile, password: event.target.value})}}
                        />
                        <ValidationForm 
                            id='repassword'
                            className='input border-solid border border-gray-500 font-sans ... rounded-sm ... mt-2 ...'
                            placeholder='비밀번호 재확인'
                            type='password'
                            maxLength='20'
                            value={profile.repassword}
                            error={validateRepassword}
                            validations={[]}
                            onChange={(event) => {setProfile({...profile, repassword: event.target.value})}}
                        />
                    </div>
                    <div className='nn-form'>
                        <label htmlFor='join-input-nn'>
                            닉네임
                        </label>
                        <ValidationForm
                            id = 'join-input-nn'
                            className='input border-solid border border-gray-500 font-sans ... rounded-sm ...'
                            placeholder='닉네임 입력(2~8자)'
                            maxLength='8'
                            value={profile.nickname}
                            error={code === 2 ? { result: false, errorMessage: '닉네임이 중복되었습니다.'} : undefined}
                            validations={[
                                (value) => ({
                                    result: value && value.length >= 2,
                                    errorMessage: '닉네임을 2자 이상 입력해주세요.',
                                    properMessage: '올바른 닉네임입니다.'
                                })
                            ]}
                            onChange={(event) => {setProfile({...profile, nickname: event.target.value})}}
                        />
                    </div> 
                </div>
                <button className='button' onClick={onJoinMembershipClick}> 가입하기</button>
            </div>
        </div>
    )
}

export default JoinMembership