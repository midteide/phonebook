import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Popover from 'react-bootstrap/Popover'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import './movie.scss'
import Popup from "reactjs-popup";
import Modal from 'react-responsive-modal';
 


const Movie = ({movie}) => {
    //console.log("props:", props)
    const currentMovie = {};
    const [thisMovie, setThisMovie] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState(null)
    const [open, setOpen] = React.useState(false);
    
    
    React.useEffect(() => {
        console.log("Movie UseEffect Fetch:")
        fetch('https://www.omdbapi.com/?i=' + movie.imdbID + '&plot=full' + '&apikey=b5afa506')
          .then(response => response.json())
          .then(jsonResponse => {
            if (jsonResponse.Response === "True") {
                setThisMovie(jsonResponse)
                setLoading(false);
                console.log("Hei: ", jsonResponse)
            } else { setErrorMessage(jsonResponse.error)
                
            }
      })}, []);

      const popover = (
        <Popover id="popover-basic">
          <Popover.Title as="h3">Tittel: {thisMovie.Title}</Popover.Title>
          {/* <Popover.Content> */}
                    <Row>
                        <Col>
                            <Image src={movie.Poster} alt={movie.Title} rounded />
                        </Col>
                        <Col>
                        <p>Actors: {thisMovie.Actors}</p>
                        <p>Genre: {thisMovie.Genre}</p>
                        <p>Awards: {thisMovie.Awards}</p>
                        <p>Director: {thisMovie.Director}</p>
                        <p>Writer: {thisMovie.Writer}</p>
                        <p>Year of release: {thisMovie.Year}</p>
                        <p>Contry: {thisMovie.Country}</p>
                        <p>Rating: {thisMovie.imdbRating} /10 ({thisMovie.imdbVotes} stemmer)</p>
                        <p>Actors: {thisMovie.Actors}</p>
                        <p>Runtime: {thisMovie.Runtime}</p>
                        <p>Plot: {thisMovie.Plot}</p>
                        <Button href={"https://www.imdb.com/title/" + thisMovie.imdbID}>Open IMDB page</Button>
                        
                        </Col>
                    </Row>
          {/* </Popover.Content> */}
        </Popover>
      );

    return (
        //<div className="movie">
        <Col xs={12} sm={6} md={4} lg={3} xl={2}>
            <Card>
                <div className="img-container">
                    <Image src={movie.Poster} alt={movie.Title} onClick={() => setOpen(true)} rounded/>
                </div>
                <Card.Body>
                    <Card.Title>{movie.Title} ({thisMovie.Genre})</Card.Title>
                    <Card.Text>
                        {thisMovie.Plot}
                    </Card.Text>
                    <Card.Text>
                        Rating (IMDB): {thisMovie.imdbRating}/ 10
                    </Card.Text>
            
                </Card.Body>
                <button className="mx-2" onClick={() => setOpen(true)}>More info</button>
                {/* <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                    <Button variant="success">More info</Button>
                </OverlayTrigger> */}
                {/* <Popup
                className="hei"
                    trigger={<button className="button"> Open Modal </button>}
                    modal
                    closeOnDocumentClick
                    
                > */}
                
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
                        <p><strong>Rating:</strong> {thisMovie.imdbRating} /10 ({thisMovie.imdbVotes} votes)</p>
                        <p><strong>Actors:</strong> {thisMovie.Actors}</p>
                        <p><strong>Runtime:</strong> {thisMovie.Runtime}</p>
                        <p><strong>Plot:</strong> {thisMovie.Plot}</p>
                        
                        <Button href={"https://www.imdb.com/title/" + thisMovie.imdbID}>Open IMDB page</Button>
                        
                        </Col>
                    </Row>
                    </Modal>
                {/* </Popup> */}
            </Card>
        </Col>    
                /* <div className="col-6">
                    <h3>Tittel: {movie.Title}</h3>
                    <p>Karakter: {movie.imdbRating} /10 ({movie.imdbVotes} stemmer)</p>
                    <p>Sjanger: {movie.Genre}</p>
                    <p>Sammendrag: {movie.Plot}</p>
                    <button type="button" className="btn-sm btn-danger" > Fjern</button>
                </div> */
                /* <img class="card-img-top" alt="" src={movie.Poster}/> */
            
        //</div>
    )
    
} 

export default Movie