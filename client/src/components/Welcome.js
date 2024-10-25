import React, { useContext, useState } from 'react'
import '../css/Welcome.css'
import CardTemplate from './CardTemplate'
import SignUp from './SignUp';
import { DbContext } from '../context/DbContext';


function Welcome() {
    const { authenticated } = useContext(DbContext)
    const [signUpOpened, setsignUpOpened] = useState(false);
    const [loginOpened, setloginOpened] = useState(false);

    const signUpClosed = () => {
        setsignUpOpened(false);
        setloginOpened(false);
    }
    const openLogin = () => {
        setloginOpened(!loginOpened);
    }
    return (
        <div className='welcome'>
            <SignUp isOpen={signUpOpened} onClose={signUpClosed} loginOpened={loginOpened} openLogin={openLogin} />
            <div className="heading">
                <h2>The Next Generation Movies/TV Shows Platform</h2>
            </div>
            <div className="paragraph">
                <h5>Track, share and discover your favourite Movies/TV Shows with Movie List</h5>
            </div>


            <div className="welcome-cards">


                <CardTemplate
                    heading={"Discover your obsession"}
                    description={`What are your highest rated genres or most watched voice actors? Follow your watching habits over time with in-depth statistics.`}
                    image={"bi bi-clipboard2-data-fill"}
                />

                <CardTemplate
                    heading={"Bring Movie List anywhere"}
                    description={`Keep track of your progress on-the-go with one of many Movie List apps across iOS, Android, macOS, and Windows.`}
                    image={"bi bi-phone-fill"}
                />

                <CardTemplate
                    heading={"Join the conversation"}
                    description={`Share your thoughts with our thriving community, make friends, socialize, and receive recommendations.`}
                    image={"bi bi-chat-dots-fill"}
                />

                <CardTemplate
                    heading={"Tweak it to your liking"}
                    description={`Customize your scoring system, title format, color scheme, and much more! Also, we have a dark mode.`}
                    image={"bi bi-palette-fill"}
                />


            </div>

            {!authenticated && (
                <div className='join-btn' onClick={() => setsignUpOpened(true)}>
                    <span>Join Now</span>
                    <div className="circle"><i className="bi bi-chevron-right arrow"></i></div>
                </div>
            )}
        </div>
    )
}

export default Welcome