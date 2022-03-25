import React, { useState, useMemo } from 'react'
import './index.css'

const ValidationForm = ({
    value,
    error,
    validations = [],
    containerStyle = {},
    ...props
    }) => {  
        
    const [errorMessage, setErrorMessage] = useState('')

    const isValid = useMemo(() => { 
        if (
            error
            && error.errorMessage !== undefined
            && error.result !== undefined
        ) {
            setErrorMessage(error.errorMessage)
            return error.result
        }

        for (const validation of validations){
            const { result, errorMessage } = validation(value)
            if(!result) {
                setErrorMessage(errorMessage)
                return result
            }
        }

        setErrorMessage('')
        return true
    }, [validations])

    return (
        <div className='id-container' style={containerStyle}>
           <input value={value} {...props}/>
           <span>{
               isValid ? 
               <span className='proper-message'>{errorMessage}</span> :
               <span className='error-message'>{errorMessage}</span> 
           }</span>
        </div> 
    )
}

export default ValidationForm