import { useContext } from 'react'
import { Redirect, Route } from 'react-router'
import { UserContext } from '../../Context/Auth/UserContextProvider'

export default function ProtectedRoute(props) {
    const { user } = useContext(UserContext)
    if (user) {
        return (<Route exact path={props.path}>{props.children}</Route>)
    } else {
        return (<Redirect to={props.redirectTo}></Redirect>)
    }
}
