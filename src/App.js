import React from 'react';
import './phonebook.css';


const phonebookData = [
    {
        id: 1,
        firstname: "Roald",
        lastname: "Johnsen",
        phonenumber: "41214624"
    },
    {
        id: 2,
        firstname: "Grete",
        lastname: "Swanosn",
        phonenumber: "5124532"
    },
    {
        id: 3,
        firstname: "Alexander",
        lastname: "Smith",
        phonenumber: "93065250"
    },
    {
        id: 4,
        firstname: "Cecilie",
        lastname: "Tyler",
        phonenumber: "41242324"
    },
    {
        id: 5,
        firstname: "Camilla",
        lastname: "Pitt",
        phonenumber: "9342423"
    }
]

const useStateWithLocalStorage = localStorageKey => {
    const [value, setValue] = React.useState(
      localStorage.getItem(localStorageKey) || ''
    );
  
    React.useEffect(() => {
      localStorage.setItem(localStorageKey, value);
    }, [value]);
  
    return [value, setValue];
  };

export const Phonebook = (props, klasse) => {
    //console.log("props:", props)
    
    return (
        <div>
            <h3>Person ID: {props.item.id}</h3>
            <p>Fornavn: {props.item.firstname}</p>
            <p>Etternavn: {props.item.lastname}</p>
            <p>Mobilnr.: {props.item.phonenumber}</p>
            <button type="button" className="btn-sm btn-danger" onClick={() => props.onDelete(props.item.id)}> Fjern</button>
            <hr/>
        </div>
    )
    
} 

  
const App = () => {
    //const [phonebookEntries, tempFirstname, tempLastname, tempPhonenumber, sortBy]  = useStateWithLocalStorage('phoneBookLocalStorage');
    const [phonebookEntries,setPhonebookEntries]  = React.useState(phonebookData);
    const [tempFirstname,setTempFirstname]  = React.useState('');
    const [tempLastname,setTempLastname]  = React.useState('');
    const [tempPhonenumber,setTempPhonenumber]  = React.useState('');
    const [sortBy,setSortBy]  = React.useState('firstname');
    const [count,setCount]  = React.useState(0);
    const [desc, setDesc] = React.useState(false); // added

    const deleteEntry = itemId => {
        // changed
        setPhonebookEntries(prevState =>
          prevState.filter(({ id }) => id !== itemId)
        );
      };
    
      const sortEntries = React.useCallback(
        // changed
        (field, desc) => {
            console.log("field: " + field + " desc: " + desc)
          setPhonebookEntries(prevState => {
            const newEntries = [...prevState];
            //const newEntries = prevState;
            newEntries.sort((a, b) => (b[field] < a[field] ? 1 : -1));
            //newEntries.sort((a, b) => (b[field] > a[field] ? 1 : -1));
    
            if (desc) newEntries.reverse();
    
            return newEntries;
          });
        },
        [setPhonebookEntries]
      );

    const getID = () => {

        var tempState = phonebookEntries;
        var value=0;
        tempState.forEach( (person) => {
            if (person.id > value) value=person.id;
        })
        return ++value;
    }

    React.useEffect(() => {
        // changed
        sortEntries(sortBy, desc);
        //sortEntries("lastname", false);
      }, [sortBy, sortEntries, desc]);


      const handleClick = e => {
        let descending=desc;
        if (sortBy === e.target.value) {
            
            //return setDesc(prevState => !prevState)
            descending=!descending;
        } else descending = false     
        console.log("Sortby: " + sortBy + " e.target.value: " + e.target.value, " DESCENDING: " + descending)
        setSortBy(e.target.value);
        setDesc(descending);
        console.table(phonebookEntries)
        };
    
      React.useEffect(() => {
        // changed
        //setCount(prevCount => prevCount + 1);
        //console.log("Count: " + count)
      }, [phonebookEntries, setCount, count]);
    
      const addEntry = (event) => {
        setPhonebookEntries(prevState => ([ ...prevState, { 
            id: getID(),
        firstname: tempFirstname,
        lastname: tempLastname,
        phonenumber: tempPhonenumber
    }]))
    
}
    return (
        <div className="App">
            <div className="container">
                <div className="row">
                <div className="col-6">
                    <p>Sorter etter: </p>

                    <button type="button" value="firstname" className="btn btn-primary" 
                        onClick={e => handleClick(e)}>Fornavn</button>

                    <button type="button" value="lastname" className="btn btn-primary" 
                        onClick={e => handleClick(e)}>Etternavn</button>

                    <button type="button" value="phonenumber" className="btn btn-primary" 
                        onClick={e => handleClick(e)}>Telefonnummer</button>

                    <button type="button" value="id" className="btn btn-primary" 
                        onClick={e => handleClick(e)}>ID</button>
                    
                    {phonebookEntries.map(item => <Phonebook onDelete={deleteEntry} key={item.id} item={item} />)}
                </div>
                <div className="col-6">
                    <form >
                        <h1>Legg til person:</h1>
                        <input name="inputFirstname" type="text" placeholder="Fornavn" onChange={(e) => {
                            setTempFirstname(e.target.value)
                            }} required />

                        <input name="inputLastname" type="text" placeholder="Etternavn" onChange={(e) => {
                            setTempLastname(e.target.value)
                            }} required />
                        
                        <input name="inputPhonenumber" type="number" placeholder="Mobilnr" onChange={(e) => {
                            setTempPhonenumber(e.target.value)
                            }} required />
                        
                        <br/>
                        <button type="button" className="btn btn-primary" name="btnAddPerson"  placeholder="Legg til" onClick={addEntry} >
                            Legg til </button>
                    </form>
                </div>
            </div>
        </div>
            
            
        </div>
    );

}


export default App;
