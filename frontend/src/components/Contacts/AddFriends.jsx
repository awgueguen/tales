/**
 * TODO -> Lazy loading for contacts existence (if a result does match, store it in matchresult and do not refetch while the search query does not diverge from the matchresult)
 * Think about an other strategy for friend exist ->
 * EITHER fetch all contacts to be able to render a result promptly and even propose when a search is only some characters ahead a db result
 * OR just fetch on every 'add' click directly before adding a friend (maybe review the API structure to do all in one request and return a specific result when no user is match)
 * 
 * HOW IT WORKS NOW -> hack with a state changing on trying to add a friend that triggers a useEffect rerender
 * ISSUE -> When you first click to add a user it doesn't send the invite yet, you have to do it twice
 * 
 * I will rebuild the entire functional part of the component with the solution that we will choose from the proposals above.
 */


 import React, { useContext, useState, useEffect } from "react";
 /* context & components ---------------------------------------------------- */
 import AuthContext from "@context/AuthContext";
//  import axios from "axios";
 /* services ---------------------------------------------------------------- */
 import { addContact} from "@services/contacts/contacts.services";
 
 const AddFriends = ({ input, handleChange, contactList, add, resetInput }) => {
   let { authTokens } = useContext(AuthContext);
 
  //  const URL = "http://127.0.0.1:8000/api/contacts/add/";
   const [message, setMessage] = useState({error:"", valid: ""});
   const errorMessage = {
     alreadyFriends: "You are already friends with this user",
     notFound: "User can not be found",
     unknownError: "An unknown error has occured",
   };
 
   /* lifecycle ------------------------------------------------------------- */
   useEffect(() => {
     setMessage({error:"", valid: ""});
   }, [input]);
   /* methods --------------------------------------------------------------- */
 
   const compareFriends = ( input ) => {
    // TODO -> refaire en comparant aussi nickname etc..
    console.log(input, contactList, "dans compareFriends")
     return contactList?.some(({ username }) => username.toLowerCase() === input.toLowerCase());
   };
 
   const handleSubmit = (e) => {
     e.preventDefault();
     if (add) {
       if (compareFriends(input) ) {
        setMessage({error: errorMessage.alreadyFriends});
        return;
       }
      addContact(authTokens.access, {"receiver": input})
        .then((response) => {
          console.log(response, "contactadd");
          setMessage({error: "", valid: "Invitiation sent !"});
          resetInput();
         })
        .catch((error) => {
          if (error?.response?.data === "UserNotFound") {
            setMessage({valid: "", error: errorMessage.notFound});
          }
          else {
            setMessage({valid: "", error: errorMessage.unknownError});
          console.log(error, 'error dans catch addContact');
        }
        });
     }
   };
 
   return (
     <>
       <form name="contact" onSubmit={handleSubmit}>
         <input type="text" name="username" placeholder="Search, Add.." onChange={handleChange} value={input} />
         <input type="submit" hidden />
       </form>
       {contactList.filter((user) => user.nickname.startsWith(input.toLocaleLowerCase())).length > 0 ? (
         ""
       ) : (
         <ul onClick={handleSubmit}>
           <li className="contacts__add">
             {input.length > 14 ? input.substring(0, 14) + "..." : input}{" "}
             <span className={`icon__add-friend ${message.error ? "error" : message.valid ? "valid" : ""}`}></span>
           </li>
           <span className={message.valid || message.error ? "contacts__add-label" : ""}>{message.valid ? message.valid : message.error}</span>
         </ul>
       )}
     </>
   );
 };
 
 export default AddFriends;
 