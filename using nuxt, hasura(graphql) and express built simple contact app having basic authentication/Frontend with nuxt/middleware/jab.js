// check if the user is accessing signup and login page while authenticated
export default function us ({ redirect }) {
    if (window.localStorage.getItem('accessToken')) {
        alert("Sorry, You can't access while you are authenticated!")
        redirect('/')
    }
    else{
        console.log('anonymous')
    }
}
