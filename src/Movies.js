import React from 'react'
import Movie from './Movie'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import ProgressBar from 'react-bootstrap/ProgressBar'

const STOPPED = 0;
const INITIAL_FETCH_COMPLETE = 1;
const DETAIL_FETCH_COMPLETE = 2;
const INITIAL_FETCH_STARTED = 3;
const DETAIL_FETCH_STARTED = 4;
const RANDOM_MOVIE_READY = 5;
const NUMBER_OF_PAGES_TO_LOAD = 2;
const SEARCH_TERM_ENTERED = 6;


 const Movies = () => {
    const apiUrl = "https://cors-anywhere.herokuapp.com/https://www.omdbapi.com/"
    const apiKey = process.env.REACT_APP_OMDB_KEY
    const moviesOnly = '&type=movie'
    const [movies, setMovies] = React.useState([]);
    const [randomMovieMovies, setRandomMovieMovies] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [randomMovieLoading, setRandomMovieLoading] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState(null)
    const [searchTerm, setSearchTerm] = React.useState('')
    const [highestRankedMovie, setHighestRankedMovie] = React.useState(null)
    const [fetchStatus, setFetchStatus] = React.useState(STOPPED)
    const [loadPercentage, setLoadPercentage] = React.useState(0)
    const [loadPercentage2, setLoadPercentage2] = React.useState(0)
    const [randomNum, setRandomNum] = React.useState(0)
    const getRandomNumber = () => {
        let tempNum =randomNum;
        while (randomNum === tempNum) tempNum = Math.round(0 + Math.random() * (10 - 0))
        setRandomNum(tempNum)
        return tempNum;

    }
        // SEARCH EFFECT
      React.useEffect(() => {
            
            if ((fetchStatus === SEARCH_TERM_ENTERED) && (searchTerm !== "")){
                getMovieSuggestion(); 
        fetch(apiUrl + "?s=" + searchTerm + moviesOnly + apiKey)
          .then(response => response.json())
          .then(jsonResponse => {
            if (jsonResponse.Response === "True") {
                jsonResponse.Search ?  setMovies(jsonResponse.Search) :  setMovies(jsonResponse)
                setLoading(false);
                let temp = [jsonResponse.Search];
                temp.forEach(m => {
                    //console.log("???????? ",m)
                })
            } else { 
                console.log("error ", apiUrl + searchTerm + apiKey)
                console.log(jsonResponse.error)
                setErrorMessage(jsonResponse.error)
                
            }
        })}}, [searchTerm, fetchStatus]);
      
      const getMovieSuggestion = async () => {
        console.log("getMovieSuggestion, searchTerm: ",searchTerm)
        setFetchStatus(INITIAL_FETCH_STARTED)
        setLoadPercentage(0);
        setLoadPercentage2(0);
        setRandomMovieLoading(true)
        
        // FETCHING ALL MOVIES
        var tempArray = [];
        for(var i=1;i<=NUMBER_OF_PAGES_TO_LOAD;i++){
            await fetch(apiUrl + "?s=" +searchTerm  + '&page=' + i + apiKey)
            .then(response => response.json())
            // eslint-disable-next-line no-loop-func
            .then(jsonResponse => {
                if (jsonResponse.Response === "True") {
                    tempArray = [...tempArray,...jsonResponse.Search];
                    setRandomMovieMovies(tempArray)
                    setLoadPercentage( parseFloat(i*100/NUMBER_OF_PAGES_TO_LOAD).toFixed(1)) 
                    if (i===NUMBER_OF_PAGES_TO_LOAD) setFetchStatus(INITIAL_FETCH_COMPLETE)
                } else { 
                    console.log("error ", apiUrl + searchTerm + apiKey)
                    console.log(jsonResponse.error)
                    setErrorMessage(jsonResponse.error)
                }
            }).catch ((error => {console.log("Error: ", error)}))
        }
        
        // FETCHING A MORE DETAILED OBJECT OF EACH MOVIE
        setFetchStatus(DETAIL_FETCH_STARTED)
        var tempArray2 = []
        for (var i=0;i<tempArray.length;i++){
            await fetch(apiUrl + "?i=" + tempArray[i].imdbID + apiKey)
            .then(response => response.json())
            // eslint-disable-next-line no-loop-func
            .then(jsonResponse => {
                if (jsonResponse.Response === "True") tempArray2 = [...tempArray2,jsonResponse]
                else setErrorMessage(jsonResponse.error)
            }) // JSONRESPONSE
            setLoadPercentage2( parseFloat(i*100/tempArray.length).toFixed(1)) 
        }
        setFetchStatus(DETAIL_FETCH_COMPLETE)

        // DECIDE WHICH MOVIE TO RECOMMEND (RANDOMIZED TOP 10 RATED)
        const item = tempArray2[0];
        if (item && item.imdbRating){
            let randomNumber = getRandomNumber();
            tempArray2.sort((a, b) => (b["imdbRating"] < a["imdbRating"] ? 1 : -1));
            tempArray2.reverse();
            await setHighestRankedMovie(tempArray2[randomNumber])
        }
        setRandomMovieMovies(tempArray2)
    }
    
    React.useEffect(() => {
        var item = highestRankedMovie
        if (item && item.imdbRating) setFetchStatus(RANDOM_MOVIE_READY)
    },[highestRankedMovie])

    const handleSubmit = async (event) => {
        event.preventDefault(); // Hindrer at siden bare oppdaterer seg når kanppen trykkes
        
            console.log(event.target.searchInput.value)
            await setSearchTerm(event.target.searchInput.value)
            await setFetchStatus(SEARCH_TERM_ENTERED)
    }
    const clickHandler = () => {
        setHighestRankedMovie(randomMovieMovies[getRandomNumber()])
     }
    return (
        <div>
            <Row>
                <div id="topSpace">
                    <h5 className="mainTitle">Discover your new favorite movie!</h5><br/>
                    <img className="mainIcon" src="http://www.iconarchive.com/download/i64529/jamespeng/movie/database.ico" alt=""/>
                </div>
            </Row>
            <Row>
                <Col>

                    <Form onSubmit={handleSubmit}>
                    
                        {/* <Form.Group controlId="searchField"> */}
                        <Form.Group>
                            <Form.Control 
                                id="fakebox"
                                placeholder="Search (i.e. 'War')" 
                                autoComplete="off"
                                tabIndex="-1"
                                type="text"
                                name="searchInput"
                                />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>

            <Row>
                <Col>
                    {(fetchStatus === STOPPED) ? 
                        <Button id="getSuggestionButton" onClick={getMovieSuggestion} >Get movie suggestion</Button>
                        :
                        (fetchStatus === RANDOM_MOVIE_READY) ? null :
                         <Button id="getSuggestionButton" variant="primary" disabled>
                            <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            />
                            Loading...
                      </Button>
                    }
                    {(fetchStatus === RANDOM_MOVIE_READY) && 
                    <>
                        <Movie movie={highestRankedMovie} clickFunction={clickHandler} suggestion={true} key={highestRankedMovie.imdbID}/>
                        
                    </>
                    }
                     
                    {fetchStatus === INITIAL_FETCH_STARTED ? <p>Searching through movies ({loadPercentage}%)...</p>:null}
                    {fetchStatus === DETAIL_FETCH_STARTED ? <p>Fetching movie data ({loadPercentage2}%)...</p>:<p></p>}
                    {((fetchStatus === INITIAL_FETCH_STARTED) || (fetchStatus === DETAIL_FETCH_STARTED)) &&
                    <>
                        <div>
                            <ProgressBar animated striped variant="success" now={loadPercentage} key={1} />
                            <ProgressBar animated striped variant="danger" now={loadPercentage2} key={2} />
                        </div>
                    </>
                    }
                </Col>
            </Row>
                                    

            
            <Row>
                <Col >
                {(fetchStatus === STOPPED) ? null : <h1 className="resultsText">Other results:</h1>}
                </Col>
            </Row>
            <Row>
                
                    {movies ? movies.length ? movies.map(movie => <Movie movie={movie} key={movie.imdbID} />) : null : null } 
                


            </Row>
            {/* <p> Movies: {movies ? true ? <Movie item={movies} key={movies.id} /> : "Empty":null} </p> */}
            {/* {phonebookEntries ? phonebookEntries.length ? phonebookEntries.map(item => <Phonebook onDelete={deleteEntry} key={item.id} item={item} />) : <p>Ingen oppføringer</p> : null}  */}
            {/* <button type="button" onClick={() => {
             return   movies ? movies.length ? console.log(movies.map(item => <Movie item={item} key={item.id} />)) : "Empty":null
            
            }}    >asd</button>        */}
        </div>
    )
}

export default Movies