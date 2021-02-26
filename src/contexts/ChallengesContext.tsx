import { createContext, ReactNode, useState } from 'react'
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

    function levelUp() {
      setLevel(level + 1)
    }

    function startNewChallenge() {
        const randonChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randonChallengeIndex]

        setActiveChallenge(challenge)
    }

    function resetChallenge() {
        setActiveChallenge(null)
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
            }}
        >
            { children }
        </ChallengesContext.Provider>
    )
}

// Uso dos Contextos no React = Pode ter informações dentro do contexto e funções que poderão atualizar essas informações