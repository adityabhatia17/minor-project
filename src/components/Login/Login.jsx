import { useToast } from '@chakra-ui/react';
import { Typography } from '@mui/material';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogo } from '../../assets/svg';
import { auth, db, provider } from '../../firebase';
import './login.css';
import styles from './login.module.css';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const createUserDocument = async (user) => {
    setLoading(true);
    if (!user) {
      console.log('error');
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      try {
        await setDoc(userRef, {
          name: displayName ? displayName : name,
          email,
          photoURL: photoURL ? photoURL : '',
          createdAt,
        });
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        setLoading(false);
      } catch (error) {
        // toast.error(error.message);
        console.error('Error creating user document: ', error);
        setLoading(false);
      }
    }
  };

  const signUpWithEmail = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = result.user;
      await createUserDocument(user);
      // toast.success('Successfully Signed Up!');
      setLoading(false);
      navigate(`/home`);
    } catch (error) {
      //   toast.error(error.message);
      console.error(
        'Error signing up with email and password: ',
        error.message,
      );
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      // You can show a toast or other UI elements to inform the user to check their email.
      // toast.success('Password reset email sent!');
      alert('Password reset email sent on ' + email);
      setLoading(false);
    } catch (error) {
      // Handle error.
      console.error('Error sending password reset email: ', error.message);
      // toast.error(error.message);
      setLoading(false);
    }
  };

  const signInWithEmail = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      navigate(`/home`);
      //   toast.success("Logged In Successfully!");
      setLoading(false);
    } catch (error) {
      //   toast.error(error.message);
      console.error(
        'Error signing in with email and password: ',
        error.message,
      );
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createUserDocument(user);
      //   toast.success("User Authenticated Successfully!");
      setLoading(false);
      navigate(`/home`);
    } catch (error) {
      setLoading(false);
      //   toast.error(error.message);
      console.error('Error signing in with Google: ', error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className={styles.topHeadingFlex}>
          <div className={styles.verticalLine}></div>
          <div className={styles.topHeading}>
            <Typography
              variant="h5"
              style={{ fontWeight: 'bold', color: '#2D4048' }}
            >
              ResumeBuilder.
            </Typography>
          </div>
        </div>
        <div className="bottom-content-flex">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 className="heading">Build Your Resume</h1>

            <h1 className="heading">in Seconds.</h1>
          </div>
          {/* <div>
            <Button variant="contained">Github</Button>
          </div> */}
        </div>
      </div>
      <div className="right-side">
        <div className="right-side-container">
          {flag ? (
            <div>
              <div className="login-header">
                <h1 style={{ marginBottom: '-1px' }}>Sign In</h1>
                <h3>Sign In to your account</h3>
                <div className="social-login">
                  <div className="social-button">
                    <button className="google" onClick={signInWithGoogle}>
                      <div class="google-icon">
                        <GoogleLogo />
                      </div>
                      <div>Sign in with Google</div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="login-card">
                <form onSubmit={signInWithEmail}>
                  <label htmlFor="username">Email Address</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <div
                    style={{ color: '#346BD4', cursor: 'pointer' }}
                    onClick={resetPassword}
                  >
                    Forgot Password?
                  </div>

                  <button
                    type="submit"
                    style={{
                      backgroundColor: 'black',
                      color: 'white',
                      marginTop: '20px',
                    }}
                  >
                    Sign In
                  </button>
                  <div
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      marginTop: '10px',
                    }}
                    onClick={() => setFlag(!flag)}
                  >
                    Not a user?{' '}
                    <span style={{ color: '#346BD4' }}>Create an Account</span>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div>
              <div className="signup-header">
                <h1 style={{ marginBottom: '-1px' }}>Register your account</h1>
                <h3>Sign up </h3>
                <div className="social-login">
                  <div className="social-button">
                    <button className="google" onClick={signInWithGoogle}>
                      <div class="google-icon">
                        <GoogleLogo />
                      </div>
                      <div>Sign Up with Google</div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="signup-card">
                <form onSubmit={signUpWithEmail}>
                  <label htmlFor="username">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <label htmlFor="username">Email Address</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <label htmlFor="password">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <button
                    type="submit"
                    style={{
                      backgroundColor: 'black',
                      color: 'white',
                      marginTop: '20px',
                    }}
                  >
                    Register
                  </button>
                  <div
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      marginTop: '10px',
                    }}
                    onClick={() => setFlag(!flag)}
                  >
                    Already a user?{' '}
                    <span style={{ color: '#346BD4' }}>Login</span>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
