import { createContext, useReducer } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null
};

function reducer(state,action){
  switch(action.type){
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
      return { user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return { user:null, token:null };
    default: return state;
  }
}

export function AuthProvider({ children }){
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email,password) => {
    const { data } = await axios.post(`${API_URL}/api/auth/login`,{ email,password });
    dispatch({ type:'LOGIN', payload:{ user:data, token:data.token } });
  };
  const register = async (name,email,contact,password) => {
    const { data } = await axios.post(`${API_URL}/api/auth/register`,{ name,email,contact,password });
    dispatch({ type:'LOGIN', payload:{ user:data, token:data.token } });
  };
  const logout = () => dispatch({ type:'LOGOUT' });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
