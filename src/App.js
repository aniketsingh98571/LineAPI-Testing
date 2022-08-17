import './App.css';
import liff from "@line/liff"
import { useEffect, useState } from "react"
import axios from "axios"
function App() {
  const [login, setlogin] = useState(false)
  const [data, setdata] = useState()
  useEffect(() => {
    const url = window.location;
    const code = new URLSearchParams(url.search).get('code');
    console.log(code)

    liff.init({
      liffId: process.env.REACT_APP_LIFF_ID, // Use own liffId
    }).then(() => {

      if (liff.isLoggedIn()) {
        //set login is temporary for this app testing like for showing user details and displaying logout button
        //it will be removed during frontend integration.
        setlogin(true)

        //setdata is a temporary state function for storing and displaying line data of user on UI.
        setdata(liff.getDecodedIDToken())

        //in this step we are using liff.getDecodedIDToken function for getting user data and storing them in data variable.
        const data = liff.getDecodedIDToken()

        //since liff.getDecodedIDToken returns some unnecessary data that is not needed for backend, so here we are extracting
        //only useful info
        const encodingData = { name: data.name, picture: data.picture, email: data.email }

        //checking if email id is empty or not, if empty then displaying alert box and redirecting the user to USER Register Page
        if (!encodingData.email) {
          alert("Please register on our platform since you do not have email id setted up")
          //line for redirecting user to user register page goes here.
        }
        else {
          //check if user if registered on our platform
          //function for checking user register:- if user is not register send the data to backend else logged in the user.
          //function for checking,logging in goes here
          //most probably the functions we will define outside and return the data and boolens when called call here to check and register.
          
          //calling here check register with email of user
         const CheckRegister= CheckRegisterFunction(encodingData.email)
         if(CheckRegister===false){
            RegisterUserFunction(encodingData)
         }
         else{
          //calling the login function where we are setting the tokens and customer details
          LoginFunction(CheckRegister)
         }
       }


      }
    })


  }, [])
  const CheckRegisterFunction= async(email)=>{
      console.log(email)
      //login or register check api goes here
     await axios.get("url",email).then((res)=>{
        if(res.user_exists)
            return res.data
        else
            return false //if user does not exist
      })
  }
  const RegisterUserFunction=async(data)=>{
      console.log(data)
     const phoneNumber= prompt("Please enter your mobile number")
     const NewData={ name: data.name, picture: data.picture, email: data.email,phone:phoneNumber}
      await axios.post("url",NewData).then((res)=>{
        if(res.data.success){
          //calling the login function where we are setting the tokens and customer details
          LoginFunction(res.data)
        }
      })
  }
  const LoginFunction=()=>{
    //store the token and customer details same logic after normal login
  }
  const Login = () => {
    console.log("login")
    liff.init({
      liffId: process.env.REACT_APP_LIFF_ID, // Use own liffId
    }).then(() => {
      console.log("success")
      if (!liff.isLoggedIn()) {
        liff.login()

      }
      else {
        console.log("logged in ")
      }
    })
  }
  const CheckLogin = () => {
    liff.init({ liffId: process.env.REACT_APP_LIFF_ID }).then(() => {
      if (liff.isLoggedIn()) {
        console.log("Logged in")
      }
      else
        console.log("Not logged In")
      console.log("Hi Not")
    })
  }
  const logout = () => {
    liff.init({
      liffId: process.env.REACT_APP_LIFF_ID, // Use own liffId
    }).then(() => {
      console.log("success")
      if (!liff.isLoggedIn()) {
        liff.login()

      }
      else {
        const url = window.location;
        const code1 = new URLSearchParams(url.search);
        code1.delete('code')

        liff.logout()
        window.location.reload()
      }
    })
  }
  return (
    <div className="App">
      <div className="ButtonClass">
        <button type="button" onClick={Login} style={{ background: "green", color: "white", width: "20%" }}>{login ? "connected" : "login"}</button>
        {login ? <button type="button" style={{ background: "green", color: "white", width: "20%" }} onClick={logout}>logout</button> : null}
      </div>
      <>
        {

          data ?
            <div className="DataContainer">
              <img src={data.picture} style={{ width: "100px", height: "auto" }} />
              <p>{data.name}</p>
              <p>{data.email}</p>
              <p></p>
            </div> : null
        }
        <div className="ButtonContainer">
          <button type='button' onClick={CheckLogin}>Check Login</button>
        </div>
      </>

    </div>
  );
}

export default App;
