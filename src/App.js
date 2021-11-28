//in this project need for facebook sign in method by firebase.
import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);
function App() {

  const [newUser, setNewUser]=useState(false);
const [user, setUser]=useState({
  isSignedIn: false,
  newUser: false,
  name: '',
  email:'',
  password: '',
  photo:'',
  error:'',
  success:false,
})

  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn=()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res=>{
      const {displayName, photoURL, email}=res.user;
      const signedInUser={
        isSignedIn:true,
        name: displayName,
        email:email,
        photo: photoURL
      }
      setUser(signedInUser);
    })
    .catch(err=>{
      console.log(err);
      console.log(err.message);
    })
  }
  const handlefbSignIn= ()=> {
    firebase.auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;
    console.log('fb user after sign in',user);
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
  }

  const handleSignOut= () => {
    firebase.auth().signOut()
    .then (res=> {
      const signedOutUser={
        isSignedIn:false,
        name:"",
        photo: "" ,
        email: "",
      }
      setUser(signedOutUser);
    })
    .catch(err=>{

    })
  }
  const handleChange =(e) =>{
    
   let isFormValid=true;
    if (e.target.name==='email'){
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
      
    }
    if(e.target.name ==='password'){
      const isPasswordValid = e.target.value.length > 6 ;
      const passwordHasNumber=/\d{1}/.test(e.target.value);
      isFormValid= isPasswordValid && passwordHasNumber;
      
    }
    if(isFormValid){
      const newUserInfo={...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit=(e)=>{
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(res => {
    const newUserInfo ={...user};
    newUserInfo.error = '';
    newUserInfo.success=true;
    setUser(newUserInfo);
    updateUserName(user.name);
    // ...
  })
  .catch((error) => {
    const newUserInfo ={...user};
    newUserInfo.error = error.message;
    newUserInfo.success=false;
    setUser(newUserInfo);
    // ..
  });

    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(res => {
    const newUserInfo ={...user};
    newUserInfo.error = '';
    newUserInfo.success=true;
    setUser(newUserInfo);
    console.log("sign in info" , user.res);
    // ...
  })
  .catch(function(error) {
    const newUserInfo ={...user};
    newUserInfo.error = error.message;
    newUserInfo.success=false;
    setUser(newUserInfo);
  });
    }

    e.preventDefault();
  }
  const updateUserName = name =>{
    const user = firebase.auth().currentUser;

user.updateProfile({
  displayName: name
  
}).then(() => {
  // Update successful
  console.log('update user name successfully');
}).catch((error) => {
  // An error occurred
  console.log(error);
});  
  }
  return (
    <div className="App">
      
    {
      user.isSignedIn?<button onBlur={handleSignOut}>Sign out</button>:
      <button onBlur={handleSignIn}>Sign in</button>
    }
    <br />
    <button onClick={handlefbSignIn}> Sign in using Facebook</button>
    {
      user.isSignedIn && <div>
        <p>Welcome, {user.name}</p>
        <p>Your email: {user.email}</p>
        <img src={user.photo} alt="" />
      </div>
    }
    <h1> Our own authentication</h1>
    <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" />
    <label htmlFor="newUser" >New user sign up</label>
    
    <p style={{color:'red'}}> {user.error}</p>
    {user.success && <p style={{color:'green'}}> user {newUser? 'created' : 'Logged In'} successfully</p>}

    <form action=""  onSubmit={handleSubmit} >

      {newUser && <input type="text" onBlur={handleChange} name="name" placeholder='Write your name' />}
        <br />
      <input type="text" onBlur={handleChange} name="email" placeholder='Write your email' required />
      <br />
      <input type="password" onBlur={handleChange} name="password" placeholder='Password' required />
      <br />
      <input type="submit" value={newUser? 'Sign up' : 'Sign In'} />
    </form>
    </div>
  );
}

export default App;