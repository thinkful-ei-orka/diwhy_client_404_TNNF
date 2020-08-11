import React, { Component } from 'react'
import AuthApiService from '../Services/auth-api-service'
import TokenService from '../Services/token-service'
import IdleService from '../Services/idle-service'
// import CategoryService from '../Services/category-api-service'

const AppContext = React.createContext({
  user: {},
  error: null,
  searchTerm: '',
  thread: {},
  categories: [],
  threads: [],
  comments: [],
  postings: [],
  setCategories: () => {},
  setError: () => {},
  clearError: () => {},
  setUser: () => {},
  processLogin: () => {},
  processLogout: () => {},
})

export default AppContext

export class AppProvider extends Component {
  constructor(props) {
    super(props)
    const state = { user: {}, error: null, threads: [], postings: [], }

    const jwtPayload = TokenService.parseAuthToken()

    if (jwtPayload)
      state.user = {
        userId: jwtPayload.userId,
        email: jwtPayload.email,
        user_name: jwtPayload.sub,
      }

    this.state = state;
    IdleService.setIdleCallback(this.logoutBecauseIdle)
  }

  componentDidMount() {
    if (TokenService.hasAuthToken()) {
      IdleService.regiserIdleTimerResets()
      TokenService.queueCallbackBeforeExpiry(() => {
        this.fetchRefreshToken()
      })
    }
  }

  componentWillUnmount() {
    IdleService.unRegisterIdleResets()
    TokenService.clearCallbackBeforeExpiry()
  }

  setError = error => {
    console.error(error)
    this.setState({ error })
  }

  clearError = () => {
    this.setState({ error: null })
  }

  setUser = user => {
    this.setState({ user })
  }

  setCategories = categories => {
    console.log(this.state)
    this.setState({ categories })
  }

  setThreads = threads => {
    console.log(this.state)
    this.setState({ threads })
  }

  processLogin = authToken => {
    TokenService.saveAuthToken(authToken)
    const jwtPayload = TokenService.parseAuthToken()
    this.setUser({
      userId: jwtPayload.userId,
      email: jwtPayload.email,
      user_name: jwtPayload.sub,
    })
    IdleService.regiserIdleTimerResets()
    TokenService.queueCallbackBeforeExpiry(() => {
      this.fetchRefreshToken()
    })
  }

  processLogout = () => {
    TokenService.clearAuthToken()
    TokenService.clearCallbackBeforeExpiry()
    IdleService.unRegisterIdleResets()
    this.setUser({})
  }

  logoutBecauseIdle = () => {
    TokenService.clearAuthToken()
    TokenService.clearCallbackBeforeExpiry()
    IdleService.unRegisterIdleResets()
    this.setUser({ idle: true })
  }

  fetchRefreshToken = () => {
    AuthApiService.refreshToken()
      .then(res => {
        TokenService.saveAuthToken(res.authToken)
        TokenService.queueCallbackBeforeExpiry(() => {
          this.fetchRefreshToken()
        })
      })
      .catch(err => {
        this.setError(err)
      })
  }

  render() {
    const value = {
      ...this.state,
      setError: this.setError,
      clearError: this.clearError,
      setUser: this.setUser,
      processLogin: this.processLogin,
      processLogout: this.processLogout,
      setCategories: this.setCategories
    }
    return (
      <AppContext.Provider value={value}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}