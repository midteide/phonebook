import React from 'react';
import './phonebook.css';


const phonebookData = [
    {
        id: 1,
        firstname: "Roald",
        lastname: "Midteide",
        phonenumber: "41214624"
    },
    {
        id: 2,
        firstname: "Grete",
        lastname: "Midteide",
        phonenumber: "5124532"
    },
    {
        id: 3,
        firstname: "Alexander",
        lastname: "Midteide",
        phonenumber: "93065250"
    },
    {
        id: 4,
        firstname: "Cecilie",
        lastname: "Midteide",
        phonenumber: "41242324"
    },
    {
        id: 5,
        firstname: "Camilla",
        lastname: "Midteide",
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
    console.log("props:", props)
    
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
   

    const deleteEntry = (itemId) => {
        console.log("FARDI",itemId)
        const items = phonebookEntries.filter(item => item.id !== itemId);
        setPhonebookEntries(items);
        // setState(prevState => {
        //     const entries = prevState.phonebookEntries.filter(entry => entry.id !== entryToDelete);
        //     return { entries };
        // });
        console.log("MORDI", phonebookEntries)

    }
    //const sortEntries = () =>{
    function sortEntries2() {
        //const entries = phonebookEntries;
        //setCount(count + 1)
        const newEntries = [...phonebookEntries]
        switch (sortBy){
            case "firstname":
                    //newEntries =  newEntries.sort((a, b) => a.firstname > b.firstname ? 1: -1 || a.lastname > b.lastname ? 1: -1 );
                newEntries.sort((a, b) => a.firstname > b.firstname ? 1: -1 );
                break;
            case "lastname":
                newEntries.sort((a, b) => a.lastname > b.lastname ? 1: -1);
                console.log("ASDOIOIJASOD")
                //newEntries =  newEntries.sort((a, b) => a.lastname > b.lastname ? 1: -1 || a.firstname > b.firstname ? 1: -1);
                break;
            case "id":
                newEntries.sort((a, b) => a.id > b.id ? 1: -1);
                break;
            case "phonenumber":
                newEntries.sort((a, b) => a.phonenumber > b.phonenumber ? 1: -1);
                break;
             case "firstnameRev":
                    //newEntries =  newEntries.sort((a, b) => a.firstname < b.firstname ? 1: -1 || a.lastname < b.lastname ? 1: -1 );
                    newEntries.sort((a, b) => a.firstname < b.firstname ? 1: -1 );
                    console.log("FIRSTNAMEREVSWITCH")
                    break;
            case "lastnameRev":
                    //newEntries =  newEntries.sort((a, b) => a.lastname < b.lastname ? 1: -1 || a.firstname < b.firstname ? 1: -1);                
                    newEntries.sort((a, b) => a.lastname < b.lastname ? 1: -1 );                
                break;
            case "idRev":
                newEntries.sort((a, b) => a.id < b.id ? 1: -1);
                break;
            case "phonenumberRev":
                newEntries.sort((a, b) => a.phonenumber < b.phonenumber ? 1: -1);
                break;
            default:
                break;

        }
        setPhonebookEntries(newEntries);
        console.table(phonebookEntries)
        
            //sortEntries();
    }


    const sortEntries = (field, desc) => {
        const newEntries = [...phonebookEntries];
        newEntries.sort((a, b) => b[field] - a[field]);
        
        if (desc) newEntries.reverse();
        
        setPhonebookEntries(newEntries);
      }


    const getID = () => {
        const { library } = phonebookEntries;
        var tempState = phonebookEntries;
        var value=0;
        tempState.forEach( (person) => {
            console.log("PERSON", person)
            if (person.id > value) value=person.id;
        })
        return ++value;
    }

    React.useEffect(() => {
        //console.log("USEEFFECT SORTBY: ", sortBy, " Count: ", count)
        sortEntries()
    },[sortBy, sortEntries])

    function handleClick(e) {
        console.log(e.target.value)
        let temp = '';
        if (sortBy === e.target.value) {
            temp = e.target.value + "Rev";
            console.log("TOGGGGGGGGLE " + sortBy + ' ' + temp);
        } else {
            temp = e.target.value;
            console.log("asdasdsa " + sortBy + ' ' );
        }
       setSortBy(temp); 
    }

    
    React.useEffect(() => {
        setCount(prevCount => prevCount + 1);
    }, [phonebookEntries, setCount])

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
                            <input name="InputFirstname" type="text" placeholder="Fornavn" onChange={(e) => {
                                setTempFirstname(e.target.value)
                            }} required />
                            <input name="InputLastname" type="text" placeholder="Etternavn" onChange={(e) => {
                                setTempLastname(e.target.value)
                            }} required />
                            <input name="InputPhonenumber" type="number" placeholder="Mobilnr" onChange={(e) => {
                                setTempPhonenumber(e.target.value)
                            }} required />
                            <br/>
                            <button type="button" className="btn btn-primary" name="btnAddPerson"  placeholder="Legg til" onClick={props => {
                                console.log("tempFirstname: ", tempFirstname)
                                console.log("tempLast: ", tempLastname)
                                console.log("tempPhonenr: ", tempPhonenumber)
                                console.log("KLIKK", props)
                                let tempID = getID();
                                setPhonebookEntries({phonebookEntries: [...phonebookEntries, {
                                    id: tempID,
                                    firstname: tempFirstname,
                                    lastname: tempLastname,
                                    phonenumber: tempPhonenumber
                                }]})
                                console.log(phonebookEntries)
                            }} >Legg til </button>
                        </form>
                    </div>
                </div>
            </div>
            
            
        </div>
    );

}


export default App;
