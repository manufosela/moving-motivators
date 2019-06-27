import firebaseApp from './init'
import {useConfig, AppEvents, $} from './utils';


const [getValue, setValue, deleteValue] = useConfig()

const errorMessage = document.createElement('h3')

const handleUserLogin = user => {
    if (user) {
        setValue('user', user)
        AppEvents.dispatchEvent(new CustomEvent('user-logged-in', {
            detail: user
        }))
    } else {
        deleteValue('user')
        AppEvents.dispatchEvent(new CustomEvent('user-logged-out'))
    }
}

const readData = user => {
    const db = firebaseApp.database()
    db.ref(`/users/${user.uid}`).once('value').then(snapshot => {
        const layer = $('.layer-login')
        if (layer.contains(errorMessage))
            layer.removeChild(errorMessage)
        const data = snapshot.val()
        if (data) {
            setValue('movingMotivators', data.data)
            Object.keys(data.data).forEach(el => {
                const source = $(`img[alt="${el}"]`)
                const target = $(`div[id=target${data.data[el]}]`)
                target.appendChild(source)
            })
        }
    }).catch(err => {
        toggleApp()
        console.log(err)
        errorMessage.className = 'user'
        errorMessage.innerText = 'No tienes permisos para iniciar sesión. Sólo usuarios del dominio @kairosds.com'
        $('.layer-login').appendChild(errorMessage)
    })
}

const toggleApp = () => {
    ['.layer-app', '#reset-button'].forEach($el => {
        $($el).classList.toggle('hidden')
    })
}

AppEvents.addEventListener('user-logged-in', event => {
    const user = event.detail
    $('#quickstart-sign-in').textContent = 'Sign out'
    $('#user').textContent = `${user.displayName} (${user.email})`
    readData(user)
    toggleApp()
})

AppEvents.addEventListener('user-logged-out', () => {
    $('#quickstart-sign-in').textContent = 'Sign in with Google'
    $('#user').textContent = ''
    toggleApp()
})

const initApp = () => {
    firebaseApp.auth().onAuthStateChanged(handleUserLogin)
};

window.addEventListener('load', initApp)