import React, { useState, useEffect} from 'react';
import './phonebook.css';
import Movies from './Movies'

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
        lastname: "Swanson",
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
    }, [value, localStorageKey]);
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
function useLocalStorage(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
      try {
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        // If error also return initialValue
        console.log(error);
        return initialValue;
      }
    });
  
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = value => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    };
  
    return [storedValue, setValue];
  }
  

const App = () => {
    const getEntries = () => {
        try {
            const oldRows = JSON.parse(localStorage.getItem("alex"));
            if (oldRows) {
                console.log("TRY GETTING ENTRIES")
                return oldRows;
            }
          } catch (e){
              console.table(e)
              console.log("Catch GETTING ENTRIES")
            return phonebookData;
          }
    }
    const [phonebookEntries,setPhonebookEntries]  = React.useState(getEntries());
    const [tempFirstname,setTempFirstname]  = React.useState('');
    const [tempLastname,setTempLastname]  = React.useState('');
    const [tempPhonenumber,setTempPhonenumber]  = React.useState('');
    const [sortBy,setSortBy]  = React.useState('firstname');
    const [count,setCount]  = React.useState(0);
    const [desc, setDesc] = React.useState(false); // added
    

    const readEntries = () => {
        try {
            const oldRows = JSON.parse(localStorage.getItem("alex"));
            if (oldRows) {
                setPhonebookEntries(phonebookEntries)
                savePhonebook();
                console.log("TRY READING ENTRIES")
                return oldRows;
            }
          } catch (e){
              console.table(e)
              console.log("Catch READING ENTRIES")
            return phonebookData;
          }
    }
    const savePhonebook = () => {
        localStorage.setItem('alex', JSON.stringify(phonebookEntries))
    }
    const addEntry = (event) => {
        if (phonebookEntries){ setPhonebookEntries(prevState => ([ ...prevState, { 
            id: getID(),
            firstname: tempFirstname,
            lastname: tempLastname,
            phonenumber: tempPhonenumber
            }]))
        }  
        else {
            setPhonebookEntries([{
                id: getID(),
                firstname: tempFirstname,
                lastname: tempLastname,
                phonenumber: tempPhonenumber
    
            }])
                
        }
    }

    
    
        
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
        if (phonebookEntries){ setPhonebookEntries(prevState => {
        const newEntries = [...prevState];
        newEntries.sort((a, b) => (b[field] < a[field] ? 1 : -1));
        if (desc) newEntries.reverse();

        return newEntries;
        });
    }

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
        console.log("UseEffect: READING ENTRIES")
        readEntries();
        
    },[])
    React.useEffect(() => {
        console.log("UseEffect: STORING ENTRIES")
        localStorage.setItem('alex', JSON.stringify(phonebookEntries))
    },[phonebookEntries])

    React.useEffect(() => {
        sortEntries(sortBy, desc);
        console.log("useEFFECT 1")
        }, [sortBy, sortEntries, desc]);

    
    return (
        <div className="App">
            <Movies/>
            {/* <div className="container">
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
                        
                         {phonebookEntries ? phonebookEntries.length ? phonebookEntries.map(item => <Phonebook onDelete={deleteEntry} key={item.id} item={item} />) : <p>Ingen oppføringer</p> : null} 
                        
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
                            <button type="button" className="btn btn-primary" name="btnLesInn"  onClick={readEntries} >
                            Les inn </button>    
                        </form>
                    </div>
                </div>
            </div> */}
            
            
        </div>
    );

}

function useJournal() {
    const [entries, setEntries] = useState([]);
  
    const getEntriesFromStorage = () => JSON.parse(
      window.localStorage.getItem('journalEntries')
    );
    const setEntriesToStorage = items => 
    window.localStorage.setItem('journalEntries', JSON.stringify(items));
    useEffect(() => {
      const entriesFromStorage = getEntriesFromStorage();
      if(entriesFromStorage) {
        setEntries(entriesFromStorage);
      }
    }, []);
  
    const storeEntry = (entry) => {
      const newEntries = [entry, ...entries];
      setEntries(newEntries);
      setEntriesToStorage(newEntries);
    }
  
    const removeEntry = (index) => {
      const newEntries = [...entries.slice(0, index), ...entries.slice(index+1)];
      setEntries(newEntries);
      setEntriesToStorage(newEntries);
    }
  
    return [entries, storeEntry, removeEntry];
  }

export default App;
