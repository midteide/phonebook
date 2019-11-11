import React from 'react'
import Movie from './Movie'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import CardDeck from 'react-bootstrap/CardDeck'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'


 const Movies = () => {
    //const apiUrl = 'http://www.omdbapi.com/?i=tt0137523&apikey=b5afa506';
    //const apiUrl = "http://www.omdbapi.com/?apikey=[b5afa506]&"
    const apiUrl = "https://www.omdbapi.com/?s="
    const apiKey = "&apikey=b5afa506"
    const moviesOnly = '&type=movie'
    const [movies, setMovies] = React.useState([]);
    const [randomMovieMovies, setRandomMovieMovies] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [randomMovieLoading, setRandomMovieLoading] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState(null)
    const [searchTerm, setSearchTerm] = React.useState('world')
    const [randomMovieReady, setRandomMovieReady] = React.useState(false)
    const [highestRankedMovie, setHighestRankedMovie] = React.useState({})


      React.useEffect(() => {
        console.log("MovieSS222 UseEffect Fetch searchTerm: ", searchTerm)
        //fetch(apiUrl + searchTerm + apiKey)
        
        fetch(apiUrl + searchTerm + moviesOnly + apiKey)
          .then(response => response.json())
          .then(jsonResponse => {
            if (jsonResponse.Response === "True") {
                jsonResponse.Search ?  setMovies(jsonResponse.Search) :  setMovies(jsonResponse)
                setLoading(false);
                console.log("Hei: ", jsonResponse)
            } else { 
                console.log("error ", apiUrl + searchTerm + apiKey)
                console.log(jsonResponse.error)
                setErrorMessage(jsonResponse.error)
                
            }
      })}, [searchTerm]);
      
      const getMovieSuggestion = () => {
        console.log("getMovieSuggestion")
        setRandomMovieLoading(true)
        //setRandomMovieMovies([]);
        var tempArray = [];
        for(var i=1;i<=100;i++){
            console.log("forloop")
            //fetch(apiUrl + searchTerm  + moviesOnly + '&page=' + i+ apiKey)
            fetch(apiUrl + searchTerm  + '&page=' + i + apiKey)
            .then(response => response.json())
            // eslint-disable-next-line no-loop-func
            .then(jsonResponse => {
                if (jsonResponse.Response === "True") {
                    setRandomMovieMovies([...tempArray,jsonResponse.Search])
                    tempArray = [...tempArray,...jsonResponse.Search];
                    
                    //console.log("Temparray: ", tempArray)
                } else { 
                    console.log("error ", apiUrl + searchTerm + apiKey)
                    console.log(jsonResponse.error)
                    setErrorMessage(jsonResponse.error)
                    
                }
            })
        }
        
        setRandomMovieMovies(tempArray)
        //setRandomMovieLoading(false);
       
        //return <Movie movie={highestRankedMovie} key={highestRankedMovie.imdbID}/>
      } 

      React.useEffect (() => {
          console.log("randomMovieMovies.lenth: ", randomMovieMovies.length)
          //if(randomMovieMovies[0] != 'undefined') {
              //console.log("Undefined")
        if (!randomMovieMovies.hasOwnProperty("imdbRating") && randomMovieMovies.length > 940 ) {
            console.log("iside IF")
            setRandomMovieLoading(false)
            var randomMovieMoviesTemp = []
            randomMovieMovies.forEach((movie, i) => {
                console.log(movie.imdbRating)
                //fetch('https://www.omdbapi.com/?i=' + movie.imdbID + '&plot=full' + '&apikey=b5afa506')
                fetch('https://www.omdbapi.com/?i=' + movie.imdbID + '&apikey=b5afa506')
            .then(response => response.json())
            .then(jsonResponse => {
                if (jsonResponse.Response === "True") {
                    randomMovieMoviesTemp = [...randomMovieMoviesTemp,jsonResponse]
                    
                    //console.log("Hei: ", jsonResponse)
                } else { setErrorMessage(jsonResponse.error)
                    
                }
                
                
            })
            
           })
           setRandomMovieMovies(randomMovieMoviesTemp)
           setRandomMovieLoading(false)
        } //console.log("RandomMovies: ", randomMovieMovies)
      }, [randomMovieMovies,randomMovieLoading])

      React.useEffect (() => {
        var highestRank = 0;
        if (randomMovieMovies.hasOwnProperty("imdbRating") && !randomMovieLoading){
            setLoading(false);
            randomMovieMovies.forEach((movie, i) => {
                if (movie.imdbRating > highestRank) {
                    setHighestRankedMovie(movie) 
                    highestRank = movie.imdbRating
                    console.log(movie)
                } else console.log(movie.imdbRating)
            })
            setRandomMovieReady(true)
            console.log("READY")
        }
    }, [randomMovieMovies, randomMovieLoading])

    return (
        <div>
            
            {/* {loading && !errorMessage ? (
                <span>loading...</span>
                ) : errorMessage ? (
                <div className="errorMessage">{errorMessage}</div>
            ) : (
                movies.map((movie, index) => (
                <Movie key={`${index}-${movie.Title}`} movie={movie} />
                ))
            )} */}
            <Row>
                <Col>
                    <Form>
                        <Form.Group controlId="searchField">
                            <Form.Control 
                                type="text" 
                                placeholder="Search" 
                                onChange={(input) => {
                                    console.log(input.target.value)
                                    setSearchTerm(input.target.value)
                                }}

                                />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button onClick={getMovieSuggestion} >Get movie suggestion</Button>
                    {randomMovieReady && <Movie movie={highestRankedMovie} key={highestRankedMovie.imdbID}/>}
                    <Button onClick={() => {
                        console.log(randomMovieMovies)
                    }}>Print array</Button>
                {/* <Button className="mx-2" onClick={ () => {
                    var a = [1,2,3]
                    var b = [4,5,6]
                    var c = [...a,...b]
                    console.log(c)
                }}>More info</Button> */}

                </Col>
            </Row>
                                    

            
            <Row>
                <Col >
                    <h1 className="overskrift">Movies:</h1>
                </Col>
            </Row>
            <Row>
                
                    {/* {movies ? movies.length ? movies.map(movie => <Movie movie={movie} key={movie.imdbID} />) : <Col>No results.</Col> : null }  */}
                


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