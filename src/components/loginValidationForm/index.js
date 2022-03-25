import React, { useState, useMemo } from 'react'
import './index.css'

const ValidationForm = ({

    value,
    validations = [],
    ...props

    }) => {

    const [errorMessage, setErrorMessage] = useState('')

    const isValid = useMemo(() => {
        for (const validation of validations){
            const { result, errorMessage } = validation()
            if(!result) {
                setErrorMessage(errorMessage)
                return result
            }
        }
        
        return true
    }, [validations])

    return(
        <div className='login-form-container'>
            <input value={value} {...props}/>
            <span>{
               isValid ? 
               <span className='error-message'>{errorMessage}</span> :
               <span></span>
           }</span>
        </div>
    )
}

export default ValidationForm