import { createContext, useState } from "react";

export const Context = createContext();

const ContextProvider = (props) => {
    const [query, setquery] = useState("");
    const [details, setdetails] = useState({});
    const [banner, setbanner] = useState("");
    const [episodes, setepisodes] = useState({});
    const [seasons, setseasons] = useState({});
    const [cast, setcast] = useState({});
    const [poster, setposter] = useState("");
    const [ShowIndex, setShowIndex] = useState([]);
    const [SignUpOpen, setSignUpOpen] = useState(false);


    const getDetails = async (id) => {
        setdetails({});
        setbanner("");
        setepisodes({});
        setseasons({});
        setcast({});

        let data = await fetch(`https://api.tvmaze.com/shows/${id}`);
        let response = await data.json();
        setdetails(response);

        let imageData = await fetch(`https://api.tvmaze.com/shows/${id}/images`);
        let images = await imageData.json();


        for (const image of images) {
            if (image.type === "background") {
                setbanner(image.resolutions.original.url);
                break;
            }
        }
        for (const image of images) {
            if (image.type === "poster") {
                setposter(image.resolutions.medium.url);
                break;
            }
        }

        let episodeData = await fetch(`https://api.tvmaze.com/shows/${id}/episodes`);
        let episodeResponse = await episodeData.json();
        setepisodes(episodeResponse);

        let seasonData = await fetch(`https://api.tvmaze.com/shows/${id}/seasons`);
        let seasonResponse = await seasonData.json();
        setseasons(seasonResponse);

        let castData = await fetch(`https://api.tvmaze.com/shows/${id}/cast`);
        let castResponse = await castData.json();
        setcast(castResponse);

    }

    const getShowsIndex = async () => {
        const randomNumber = Math.floor(Math.random() * (315 - 1 + 1)) + 1;
        let indexData = await fetch(`https://api.tvmaze.com/shows?page=${randomNumber}`);
        let indexResponse = await indexData.json();
        let sortedResponse = indexResponse.sort((a, b) => b.rating.average - a.rating.average);
        setShowIndex(sortedResponse);
    }

    

    const contextValue = {
        details,
        banner,
        poster,
        episodes,
        seasons,
        cast,
        getDetails,
        query,
        setquery,
        getShowsIndex,
        ShowIndex,
        SignUpOpen,
        setSignUpOpen,
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;