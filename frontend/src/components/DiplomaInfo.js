 import React, { useState } from "react";
 
 const DiplomaInfo = ({ contract }) => {
   const [hash, setHash] = useState("");
 
   const getInfo = async () => {
    const [name, time] = await contract.getDiploma(hash);
    const timestamp = Number(time); // Приводим BigInt → Number
    console.log(name, timestamp);
    alert(`University: ${name}, Registered: ${new Date(timestamp * 1000).toLocaleString()}`);
  };
  
 
   return (
     <div>
       <h2>Diploma Info</h2>
       <input type="text" placeholder="Hash" onChange={(e) => setHash(e.target.value)} />
       <button onClick={getInfo}>Get Info</button>
     </div>
   );
 };
 
 export default DiplomaInfo;