const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const port = 65100

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const { connection } = require('./mysql')


app.get('/', (request, response) => {
    response.send('hello, world!')
})

app.get('/user', (request, response) => {
    connection.query('SELECT * FROM user', (error, results) => {
        if (error) {
            response.status(500).json(error)
            return
        }
        response.status(200).json(results)
    })
})

// 회원가입
app.post('/join', (request, response) => {
    const { id, password, nickname } = request.body

    connection.query(
        `select * from user where user_id='${id}'`,
        (error, results) => {
            if (results.length >= 1) {
                response.status(403).json({
                    code: 1,
                    message: '중복된 아이디'
                })
                return
            }
            connection.query(
                `SELECT * FROM user WHERE nickname='${nickname}'`,
                (error, results) => {
                    if (results.length >= 1) {
                        response.status(403).json({
                            code: 2,
                            message: '중복된 닉네임'
                        })
                        return
                    }
                    connection.query(
                        `INSERT INTO user (user_id, password, nickname) 
                        VALUES ("${id}", SHA2("${password}", 512), "${nickname}")`,
                        (error, results) => {
                            if (error) {
                                console.log(error)
                                response.status(403).json({
                                    message: '서비스 처리 불가'
                                })
                                return
                            }
                            response.status(200).json(results)
                        })
                }
            )
        }
    )
})

// 로그인
app.post('/auth', (request, response) => {
    
    const { id, password } = request.body
    
    connection.query(`SELECT * FROM user WHERE user_id="${id}" and password=SHA2("${password}", 512)`, 
        (error, results) => {
            if (error) {
                response.status(500).json({
                    message: '서비스 처리 불가'
                })  
                return
            }
            if (results <= 0){
                response.status(403).json({
                    code: 4,
                    message: '아이디를 다시 확인해주세요.'
                })
                return
            }
        response.status(200).json(results[0])
    })
})

// 티켓 발행
app.post('/ticket', (request, response) => {
    const { id, nickname } = request.body
    connection.query(
        `INSERT INTO 
            game_round (user_id, user_nickname) 
        VALUES ("${id}", "${nickname}")
        `,
        (error, results) => {
            if (error) {
                response.status(500).json({
                    message: error
                })
                return
            }
            response.status(200).json(results)
        })   
})

// 티켓에 업데이트
app.post('/gameEnd', (request, response) => {
    const { id, scoreSum, answer } = request.body
    connection.query(
        `UPDATE 
            game_round
        SET 
            termniated_at = NOW(),
            score = ${scoreSum},
            answer = ${answer}
        WHERE 1 = 1
        AND user_id = ${id}
        ORDER BY created_at DESC
        LIMIT 1
        `,
        (error, results) => {
            if (error) {
                response.status(500).json({
                    message: error
                })
                return
            }
            response.status(200).json(results)
        })   
})

// 게임히스토리
app.post('/game', (request, response) => {
    const { id, answer, guess } = request.body;
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
      const { strike, ball, out } = getScore(guess, answer)

    connection.query(
        `
        SELECT
            id FROM game_round 
        WHERE user_id="${id}"
        ORDER BY created_at DESC LIMIT 1
        `,
        (error, result) => {
            if (error) {
                console.log(error)
                return
            }
            connection.query(
                `INSERT INTO game_history (gameticket_id, user_id, guess, strike, ball, out_count) 
                VALUES ('${result[0].id}', '${id}', '${guess}', '${strike}', '${ball}', '${out}')`,
                (error, result) => {
                    if(error) {
                        console.log(error)
                        return
                    }
                }
            )
        }
    )
})

// 명예의전당
app.post('/rank', (request, response) => {
    connection.query(
        `SELECT distinct user_nickname, score 
        FROM game_round 
        WHERE 1 = 1 
        and score = score ORDER BY score DESC`,
        (error, results) => {
            if (error) {
                response.status(500).json({
                    message: '서비스 처리 불가'
                })
                return
            }
            response.status(200).json(results) 
        }
    )
})

// 게임히스토리 모달창에 데이터 보내기
app.post('/gameHistory', (request, response) => {
    const { id } = request.body;
    connection.query(
        `SELECT
            id FROM game_round 
        WHERE user_id="${id}"
        ORDER BY created_at DESC LIMIT 1`,
        (error, result) => {
            if(error) {
                console.log(error)
                return
            }
            connection.query(
                `
                SELECT guess, strike, ball FROM game_history
                WHERE 1 = 1
                AND gameticket_id = "${result[0].id}"
                ORDER BY id ASC
                `,
                (error, result) => {
                    if(error) {
                        console.log(error)
                        return
                    }
                    response.status(200).json(result)
                }
            )
        }
    )
})

// 히스토리 모달창에 뿌려줄 플레이시간
app.post('/playTime', (request, response) => {
    const { id } = request.body;
    connection.query(
        `SELECT RUN_TIME FROM (SELECT *, TIME_TO_SEC(TIMEDIFF(termniated_at, created_at)) AS RUN_TIME
        FROM game_round) AS GAME_TICKET_WITH_RUN_TIME WHERE 1 = 1 AND user_id = "${id}" ORDER BY created_at DESC LIMIT 1`,
        (error, result) => {
            if (error) {
                console.log(error)
                return
            }
            response.status(200).json(result)
        }
    )
})

app.listen(port, () => {
    console.log(`example service app listenling at http://localhost:${port}`)
})
