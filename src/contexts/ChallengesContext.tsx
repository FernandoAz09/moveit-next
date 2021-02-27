import { createContext, ReactNode, useEffect, useState } from 'react'
import challenges from '../../challenges.json'

interface Challenge {
    type: 'body' | 'eye'
    description: string
    amount: number
}

interface ChallengesContextData {
    level: number
    currentExperience: number  
    challengesCompleted: number
    experienceToNextLevel: number
    activeChallenge: Challenge 
    levelUp: () => void 
    startNewChallenge: () => void
    resetChallenge: () => void
    completeChallenge: () => void
}

interface ChallengesProviderProps {
    children: ReactNode
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider({ children } : ChallengesProviderProps) {
    const [level, setLevel] = useState(1)
    const [currentExperience, setCurrentExperience] = useState(0)
    const [challengesCompleted, setChallengesCompleted] = useState(0)

    const [activeChallenge, setActiveChallenge] = useState(null)

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2) // potenciação -- calculo de RPG pra levelUP

    // Array vazio no segundo parametro o UseEffect a função executa uma unica vez assim que o componente for exibido em tela

    useEffect(() => {
        Notification.requestPermission()
    }, []) 

    function levelUp() {
      setLevel(level + 1)
    }

    function startNewChallenge() {
        const randonChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randonChallengeIndex]

        setActiveChallenge(challenge)

        new Audio('./public/notification.mp3').play()

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio🎉', {
                body: `Valendo ${challenge.amount} xp!`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null)
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return
        }

        const { amount } = activeChallenge

        let finalExperience = currentExperience + amount

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel
            levelUp()
        }

        setCurrentExperience(finalExperience)
        setActiveChallenge(null)
        setChallengesCompleted(challengesCompleted + 1)
    }

    return (
        <ChallengesContext.Provider 
            value={{
                level, 
                currentExperience, 
                challengesCompleted, 
                levelUp, 
                startNewChallenge,
                resetChallenge,
                activeChallenge,
                experienceToNextLevel,
                completeChallenge,
            }}
        >
            { children }
        </ChallengesContext.Provider>
    )
}
