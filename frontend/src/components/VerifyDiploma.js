import React, { useState } from "react";
 
 const VerifyDiploma = ({ contract }) => {
   const [hash, setHash] = useState("");
   const [status, setStatus] = useState(null);
 
   const verify = async () => {
     const result = await contract.verifyDiploma(hash);
     setStatus(result);
   };
 
   return (
     <div>
       <h2>Verify Diploma</h2>
       <input type="text" placeholder="Hash" onChange={(e) => setHash(e.target.value)} />
       <button onClick={verify}>Verify</button>
       {status !== null && <p>{status ? "Valid" : "Invalid"}</p>}
     </div>
   );
 };
 
 export default VerifyDiploma;