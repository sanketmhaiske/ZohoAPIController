import React, { useState, useEffect } from 'react';
import axios from 'axios'
import styled from 'styled-components'
import { AiOutlineDelete } from 'react-icons/ai'
import { MdOutlineUpdate } from 'react-icons/md'
import './App.css';



const ZohoLeadsRecords = styled.div`
 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  
`
const ZohoPostRecords = styled.div`
 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  
`
const th = {
  background: '#353434fa',
  color: 'white',
  margin: '5px',
  border: '2px solid',
  padding: '4px',
  textAlign: 'center',
  verticalAlign: 'middle',
}
const td = {
  background: 'gray',
  color: 'white',
  textAlign: 'center',
  verticalAlign: 'middle',
  width: '10rem',
  border: '2px solid',
  padding: '4px',
}

const input = {
  display: 'flex',
  padding: '5px',
  margin: '5px 0',
  outline: 'none',
}
const select = {
  display: 'flex',
  padding: '5px',
  margin: '5px 0',
}
const button = {
  padding: '5px',
  background: 'black',
  color: 'white',
  margin: '10px 0',
  cursor: 'pointer',
}

function App() {

  const [records, setRecords] = useState([])

  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [country, setCountry] = useState('')
  const [leadStatus, setLeadStatus] = useState('')



  useEffect(() => {
    axios.get('http://localhost:8000/leads')
      .then(data => {
        setRecords(data.data.result)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  console.log(records)

  const submit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/postleads', {
      Company: company,
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      Country: country,
      LeadStatus: leadStatus
    }).then(data => {
      alert('success')
      console.log(data)
    }).catch(error => {
      alert('error')
      console.log(error)
    })

  }

  // Remove record 

  const remove = (id) => {
    axios.post('http://localhost:8000/remove_leads', {
      id: id
    })
      .then(res => {
        alert('success')
        window.location.reload();
      })
      .catch(error => {
        alert('error')
        console.log(error)
      })
  }

  // Update Record 
  const update = (id) => {
    axios.post('http://localhost:8000/update_leads', {
      id: id
    })
      .then(res => {
        alert('success')
        window.location.reload();
      })
      .catch(error => {
        alert('error')
        console.log(error)
      })
  }

  return (
    <>
      <ZohoLeadsRecords>
        <h2>Zoho Records(Leads)</h2>
        <span>Created by : Sanket Mhaiske</span>
        <div style={{ margin: '2rem 0' }}>
          <tr>
            <th style={th}>Owner</th>
            <th style={th}>Website</th>
            <th style={th}>Twitter</th>
            <th style={th}>Skype</th>
            <th style={th}>Company</th>
            <th style={th}>Country</th>
            <th style={th}>Actions</th>
          </tr>
          {
            records && records.map(val => (
              <React.Fragment key={Math.random()}>
                <tr>
                  <td style={td}>{val.Owner.name}</td>
                  <td style={td}>{val.Website}</td>
                  <td style={td}>{val.Twitter}</td>
                  <td style={td}>{val.Skype_ID}</td>
                  <td style={td}>{val.Company}</td>
                  <td style={td}>{val.Country}</td>
                  <td style={td}>
                    <AiOutlineDelete onClick={() => remove(val.id)} style={{color:'white'}}/>
                    <MdOutlineUpdate onClick={() => update(val.id)} style={{color:'white', margin:'0 10px'}}/>
                  </td>
                </tr>
              </React.Fragment>
            ))
          }
        </div>
      </ZohoLeadsRecords>
      <ZohoPostRecords>
        <h2>Zoho Post Record</h2>
        <form onSubmit={(e) => submit(e)} style={{ display: 'flex', flexDirection: 'column', width: '20rem', marginBottom: '2rem' }}>
          <input style={input} type='text' placeholder='Company' onChange={(e) => setCompany(e.target.value)} />
          <input style={input} type='text' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
          <input style={input} type='text' placeholder='First Name' onChange={(e) => setFirstName(e.target.value)} />
          <input style={input} type='text' placeholder='Last Name' onChange={(e) => setLastName(e.target.value)} />
          <input style={input} type='text' placeholder='Country' onChange={(e) => setCountry(e.target.value)} />
          <input style={input} type='text' placeholder='Lead Status' onChange={(e) => setLeadStatus(e.target.value)} />
          <button style={button} type='submit'>Proceed</button>
        </form>


      </ZohoPostRecords>
    </>
  );
}

export default App;
