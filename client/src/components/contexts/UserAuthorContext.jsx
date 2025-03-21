import {createContext,useEffect,useState} from 'react'
export const userAuthorContextObj = createContext();

function UserAuthorContext({children}) {
  let [currentUser,setCurrentUser] = useState({
    role:'',
    firstName : '',
    lastName : '',
    email:'',
    profileImageUrl:''
  })

  useEffect(()=>{
    const userInLocalStorage = JSON.parse(localStorage.getItem('currentUser'));
    if(userInLocalStorage){
      setCurrentUser(userInLocalStorage)
    }
  },[])

  return (
    <userAuthorContextObj.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </userAuthorContextObj.Provider>
  )
}

export default UserAuthorContext