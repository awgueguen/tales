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
 import { addContact, checkContactExists} from "@services/contacts/contacts.services";
 
 const AddFriends = ({ input, handleChange, contactList, add }) => {
   let { authTokens } = useContext(AuthContext);
 
  //  const URL = "http://127.0.0.1:8000/api/contacts/add/";
   const [error, setError] = useState();
   const [valid, setValid] = useState();
   const [contactExist, setContactExist] = useState(false)
   const [rerenderForced, setRerenderForced] = useState(0)
   const message = {
     alreadyFriends: "You are already friends with this user",
     notFound: "User can not be found",
     error: "An error has occured",
   };
 
   /* lifecycle ------------------------------------------------------------- */
   useEffect(() => {
     setError("");
     setValid("");
   }, [input]);
   /* methods --------------------------------------------------------------- */
 
   const compareFriends = () => {
     const friends = contactList;
     return friends?.some(({ username }) => username.toLowerCase() === input.toLowerCase());
   };
 
   useEffect(()=> {
    console.log("fetch to check");
    if (rerenderForced === 0) return;
     checkContactExists(authTokens.access, input)
       .then((response) => {
         console.log(response, "contactCheck")
         setContactExist(response.statusTest !== "Not Found")
       })
       .catch((error) => console.log(error));
       //eslint-disable-next-line
   }, [authTokens.access, rerenderForced, setRerenderForced])
   
   // const checkContactExistence = async () => {
   //   // const request = await axios({
   //   //   method: "GET",
   //   //   url: `${URL}?receiver=${input}`,
   //   //   headers: { Authorization: "Bearer " + authTokens.access },
   //   // }).catch((error) => error.response);
   //   // console.log('friendrequest response', request)
   //   // return request.statusText !== "Not Found";
   //   checkContactExists(authTokens.access, input)
   //     .then((response) => {
   //       console.log(response, "contactCheck")
   //       setContactExist(response.statusTest !== "Not Found")
   //     })
   //     .catch((error) => console.log(error));
   // };
 
   const addFriendToContact = async (input) => {
     // const request = await axios({
     //   method: "POST",
     //   url: URL,
     //   headers: { Authorization: "Bearer " + authTokens.access },
     //   data: { receiver: input },
     // }).catch((error) => error);
 
     // return request.statusText === "Created";
     console.log('try to add');
     let hello;
     addContact(authTokens.access, {"receiver": input})
       .then((response) => {
         console.log(response, "contactadd")
         hello = response.statusText === "Created"
       })
       .catch((error) => console.log(error));
     return hello;
   };
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     setRerenderForced(rerenderForced + 1)
     if (add) {
       // let contact_exist = await checkContactExistence();
       let contact_in_list = compareFriends();
       if (contactExist && !contact_in_list) {
         const request = await addFriendToContact(input);
         if (request) {
           setValid("Invitiation sent !");
         } else {
           setError(message.error);
         }
       } else if (compareFriends(input) === true) {
         setError(message.alreadyFriends);
       } else {
         setError(message.notFound);
       }
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
             <span className={`icon__add-friend ${error ? "error" : valid ? "valid" : ""}`}></span>
           </li>
           <span className={valid || error ? "contacts__add-label" : ""}>{valid ? valid : error}</span>
         </ul>
       )}
     </>
   );
 };
 
 export default AddFriends;
 