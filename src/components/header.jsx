import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import Data from "../service/data.json";

import * as ACTION from "../redux/article";

const Header = () => {
    // utilisateur pour la connexion
    const [user, setUser] = useState({
        prenom: '',
        pwd: ''
    })
    
    // check si un utilisateur est co
    const [Check, setCheck] = useState(false)

    // check si on a autre chose que le header de chargé
    const [isLoaded, setIsLoaded] = useState(false)

    // récupère le nom utilisateur pour qu'il persiste entre les pages
    const [localUser, setLocalUser] = useState('');

    const handleChange = (event) => {
        /**
         * @event.target
         * Contient notre balise input de ce fait on peut s'en 
         * servir pour récupérer un attribut spécifique.
         * On déstructure e.target pour récupérer l'attribut
         * name ainsi que sa value. 
         * @Destructuration
         * Permet directement de déclarer une variable 
         * et de lui assigner la valeur d'une propriété d'un objet.
         */
        const { name, value } = event.target
        
        /**
         * @Spread (...)
         * Permet de créer une copie superficielle de notre objet
         */
        setUser(prevUser => ({...prevUser, [name]: value }))
      }
    
        // entrée: évènement
        // ne retourne rien et gèrera l'enregistrement du login password
      const handleSubmit = (event) => {
        event.preventDefault()
        /* 
          c'est ici qu'on peut envoyer les informations pour la bdd, store, api etc
          On peut faire une ou des conditions pour vérifier par 
          exemple si le mot de passe contient bien 9 caractère au minimum etc.
        */
        if(user.prenom.length >= 3 && user.pwd.length >= 9 ){
            setCheck(true)
            localStorage.setItem(
                "user",
                JSON.stringify(user.prenom)
            );
            localStorage.setItem(
                "login",
                JSON.stringify(true)
            );
            if (!isLoaded) {
                saveStateToLocalStorage();
                setIsLoaded(true)
                localStorage.setItem(
                    "loaded",
                    JSON.stringify(true)
                );
            }
            window.location.href = "/home";
        }else{
            setCheck(false)
        }
      }

    const store = useSelector(state => state.article.data) // On utilise useSelector pour récupérer les données du store

    const dispatch = useDispatch();

    // récupère les données de Data
    useEffect(() => {
        dispatch(ACTION.FETCH_START())
        try{
            dispatch(ACTION.FETCH_SUCCESS(Data))
        }catch(err){
            dispatch(ACTION.FETCH_FAILURE(err.message))
        }
    }, [])

    // sauvegarde les données du roster dans le local storage
    const saveStateToLocalStorage = () => {
        localStorage.setItem(
            "roster",
            JSON.stringify(store)
        );
    };
    
    // permet de checker l'état de la page
    // utilisé au début de la création de la page
    const getStateFromLocalStorage = () => {
        useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser) {
            setLocalUser(localUser);
        }
        }, []);
        useEffect(() => {
        const Check = JSON.parse(localStorage.getItem('login'));
        if (Check) {
            setCheck(Check);
        }
        }, []);
        useEffect(() => {
        const isLoaded = JSON.parse(localStorage.getItem('loaded'));
        if (isLoaded) {
            setIsLoaded(isLoaded);
        }
        }, []);
    };

    // permet d'aller au hub du jeu où on a accès à toutes les options
    const selectChar = () => {
        if (!isLoaded) {
            saveStateToLocalStorage();
            setIsLoaded(true)
            localStorage.setItem(
                "loaded",
                JSON.stringify(true)
            );
        }
        window.location.href = "/home";
    }

    return(
        <>
            <header>
                {
                getStateFromLocalStorage()
                }
                {
                Check ?
                    <p>{localUser}</p>
                :
                    <form onSubmit={handleSubmit} >
                    <label htmlFor="prenom">Utilisateur : </label>
                    <input 
                    type="text" 
                    id="prenom" 
                    name="prenom"  
                    placeholder="pseudo" 
                    onChange={handleChange}  
                    />
                    <label htmlFor="pwd">Mot de passe : </label>
                    <input 
                        type="password" 
                        id="pwd" 
                        name="pwd"  
                        placeholder="mot de passe" 
                        onChange={handleChange}
                    />
                    <p></p>
                    <button>Valider</button>
                    </form>
                }
                {
                Check ? 
                    <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/c/c2/Summoners_War_Logo.png/1200px-Summoners_War_Logo.png?20180419151936" height="200px" onClick={() => selectChar()}></img>
                :
                    <p></p>
                }
            </header>
            <section>
                <Outlet />
            </section>
        </>
    )
}

export default Header;