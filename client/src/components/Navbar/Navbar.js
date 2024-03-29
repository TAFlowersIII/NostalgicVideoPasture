import React, {useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyles from './styles.js';
import NostalgicVideoPasture from '../../images/nostalgicvideopasture.jpg'
import decode from 'jwt-decode';

const Navbar = () => {

     const classes = useStyles();
     const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
     const dispatch = useDispatch();
     const history = useHistory();
     const location = useLocation();
     
     const logout = () => {
          dispatch({ type: 'LOGOUT' });
          history.push('/');
          setUser(null);
     }

     useEffect(() => {
          const token = user?.token;
          
          if (token) {
               const decodedToken = decode(token);
         
               if (decodedToken.exp * 1000 < new Date().getTime()) logout();
             }

          setUser(JSON.parse(localStorage.getItem('profile')));
     }, [location])

     return(
     <AppBar className={classes.appBar} position="static" color="inherit">
          <Link to='/' className={classes.brandContainer}>
               <Typography className ={classes.heading} variant="h2" align="center">Collective Nostalgia Video Club</Typography>
               <img className = {classes.image} src={NostalgicVideoPasture} alt="Nostalgic Video Pasture" height="60" />
          </Link>
          <Toolbar className={classes.toolbar}>
               {user?.result ? (

                    <div className={classes.profile}>
                         <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
                         <Typography className={classes.name} variant="h6">Hello, {user.result.name}</Typography>
                         <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
                    </div>

               ) : (
                    <Button component={Link} to="/auth" variant="contained" color="primary">Check In</Button>
               )}
          </Toolbar>
      </AppBar>

  );
}



export default Navbar;
