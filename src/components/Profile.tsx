import style from '../styles/components/Profile.module.css'

export function Profile() {
    return (
        <div className={style.profileContainer}>
            <img src="https://github.com/fernandoaz09.png" alt="Fernando Azevedo"/>
            <div>
                <strong>Fernando Azevedo</strong>
                <p>
                    <img src="../public/icons/level.svg" alt="level"/>
                    Level 1
                </p>
            </div>
        </div>
    )
}