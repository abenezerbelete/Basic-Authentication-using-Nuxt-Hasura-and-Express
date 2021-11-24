// check if the user is authenticated
export default function ( { redirect } ) {
  if (window.localStorage.getItem('accessToken')){
      console.log(" It's alright")
  }
  else{
    alert('You are not authenticated, Please First Login here.')
    redirect('/auth/login')
  }
}