import React, {Component} from "react"


export const PhonebookItem = (props, klasse) => {
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

export default PhonebookItem