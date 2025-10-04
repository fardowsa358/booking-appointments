// import React, { useState } from "react";

// const Login = ({ onLogin }) => {
//   const [username,setUsername]=useState("");
//   const [password,setPassword]=useState("");

//   const handleSubmit=(e)=>{
//     e.preventDefault();
//     if(username==="admin" && password==="password"){
//       onLogin();
//     } else {
//       alert("Invalid credentials. Try admin/password");
//     }
//   }

//   return (
//     <div className="login-container">
//       <div className="login-form">
//         <div className="login-header">
//           <h2>MediCare Hospital</h2>
//           <p>Sign in to your account</p>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Username</label>
//             <input className="form-control" type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter your username" required/>
//           </div>
//           <div className="form-group">
//             <label>Password</label>
//             <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required/>
//           </div>
//           <button className="login-btn">Sign In</button>
//         </form>
//         <div className="login-footer">
//           <p>Don't have an account? <a href="#">Contact Administrator</a></p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Login;
