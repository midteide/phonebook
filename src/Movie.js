import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'
import './movie.scss'
import Modal from 'react-responsive-modal';
 


const Movie = ({movie, suggestion, clickFunction}) => {
    //console.log("props:", props)
    const currentMovie = {};
    const [thisMovie, setThisMovie] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState(null)
    const [open, setOpen] = React.useState(false);
    const apiKey = process.env.REACT_APP_OMDB_KEY
    const apiUrl = "https://cors-anywhere.herokuapp.com/https://www.omdbapi.com/"
    const apirSearch = "?i="
    
    
    React.useEffect(() => {
        if (movie.imdbID !== 'undefined') { 
            fetch(apiUrl + apirSearch + movie.imdbID + '&plot=full' + apiKey)
          .then(response => response.json())
          .then(jsonResponse => {
            if (jsonResponse.Response === "True") {
                setThisMovie(jsonResponse)
                setLoading(false);
                console.log("Movie: OK: ", jsonResponse)
            } else { 
                console.log("Movie: Error: " , jsonResponse.error)
                setErrorMessage(jsonResponse.error)
                
            }
        }
      )}}, [apiKey,movie.imdbID]);

     
    return (
        //<div className="movie">
        <Col className="cardStyle" xs={12} sm={6} md={4} lg={3} xl={2}>
            <Card>
                {(suggestion) && 
                    <>
                        <Button id="getSuggestionButton" onClick={clickFunction}   >Next suggestion </Button>
                    </>
                }
                <div className="img-container">
                    <Image src={movie.Poster} alt={movie.Title} onClick={() => setOpen(true)} rounded/>
                </div>
                <Card.Body>
                    <Card.Title>{movie.Title} ({thisMovie.Genre})</Card.Title>
                    <Card.Text>
                        {movie.Plot}
                    </Card.Text>
                    <Card.Text>
                        Rating (IMDB): {thisMovie.imdbRating} / 10
                    </Card.Text>
            
                </Card.Body>
                <button className="mx-2" onClick={() => setOpen(true)}>More info</button>
                
                <Modal open={open} onClose={() => setOpen(false)} center>
                <Row>
                        <Col xs={12} md={6}>
                            <Image className="popup-img mb-4" src={movie.Poster} alt={movie.Title}  rounded />
                        </Col>
                        <Col>
                        <p><strong>Actors:</strong> {thisMovie.Actors}</p>
                        <p><strong>Genre:</strong> {thisMovie.Genre}</p>
                        <p><strong>Awards:</strong> {thisMovie.Awards}</p>
                        <p><strong>Director:</strong> {thisMovie.Director}</p>
                        <p><strong>Year of release:</strong> {thisMovie.Year}</p>
                        <p><strong>Contry:</strong> {thisMovie.Country}</p>
                        <p><strong>Rating:</strong> {thisMovie.imdbRating} / 10 ({thisMovie.imdbVotes} votes)</p>
                        <p><strong>Actors:</strong> {thisMovie.Actors}</p>
                        <p><strong>Runtime:</strong> {thisMovie.Runtime}</p>
                        <p><strong>Plot:</strong> {thisMovie.Plot}</p>
                        
                        <Button href={"https://www.imdb.com/title/" + thisMovie.imdbID}>Open IMDB page</Button>
                        
                        </Col>
                    </Row>
                    </Modal>
            </Card>
        </Col>    
    )
    
} 

export default Movie