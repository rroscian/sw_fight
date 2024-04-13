import { useEffect, useState } from "react";

// COMPONENT

// ACTIONS

import React from "react";


const Add = () => {
  
  // stocke le roster de personnages disponibles
  const [currentRoster, setCurrentRoster] = useState([]);

  // sera exécutée au début du chargement de la page pour récupérer dans currentRoster le roster de personnages disponibles
  const getStateFromLocalStorage = () => {
      useEffect(() => {
      const currentRoster = JSON.parse(localStorage.getItem('roster'));
      if (currentRoster) {
          setCurrentRoster(currentRoster);
      }
      }, []);
  };

  // stocke le nouveau personnage qui sera ajouté
  const [newCharacter, setNewCharacter] = useState([]);

  // gère l'ajout d'un nouveau personnage à la soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault()
    /* 
      c'est ici qu'on peut envoyer les informations pour la bdd, store, api etc
      On peut faire une ou des conditions pour vérifier par 
      exemple si le mot de passe contient bien 9 caractère au minimum etc.
    */

    // on définit un nouveau personnage et on récupère les valeurs de l'event défini
    const myNewCharacter = {
      id: currentRoster.length+1,
      nom: event.target.nom.value,
      image: event.target.image.value,
      categorie: event.target.categorie.value,
      type: event.target.type.value,
      vie: event.target.vie.value,
      force: event.target.force.value,
      defense: event.target.defense.value,
      vitesse: event.target.vitesse.value,
      techniques: [
        event.target.tech1.value,
        event.target.tech2.value,
        event.target.tech3.value,
        event.target.tech4.value
      ],
      passif: event.target.passif.value
    }

    // console.log(myNewCharacter);

    // on ajoute le nouveau personnage à la pool de personnages
    setCurrentRoster(currentRoster.push(myNewCharacter));
    // on stocke le nouveau roster dans le localStorage
    localStorage.setItem(
        "roster",
        JSON.stringify(currentRoster)
    );
    window.location.href = "/home";
  }

  // actualisera le contenu des champs du personnage quand un champ est actualisé
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
    setNewCharacter(prevNewCharacter => ({...prevNewCharacter, [name]: value }))
  }

  return (
    <div>
      {
      getStateFromLocalStorage()
      }
      <h1>Ajouter un personnage</h1>
      <form onSubmit={handleSubmit} >
        {/* Nom */}
        <div>
          <label htmlFor="nom">Nom : </label>
          <input 
          type="text" 
          id="nom" 
          name="nom"  
          placeholder="Nom" 
          onChange={handleChange}  
          />
        </div>
        {/* Icône */}
        <div>
          <label htmlFor="image">Lien de l'icône : </label>
          <input 
          type="text" 
          id="image" 
          name="image"  
          placeholder="Lien de l'icône" 
          onChange={handleChange}  
          />
        </div>
        {/* Classe */}
        <div>
          <label htmlFor="categorie">Catégorie : </label>
          <select name="categorie" id="categorie" onChange={handleChange} >
            <option value="Aucune">Aucune</option>
            <option value="Attaque">Attaque</option>
            <option value="Defense">Défense</option>
            <option value="Support">Support</option>
            <option value="Cleric">Cleric</option>
            <option value="Tank">Tank</option> 
          </select>
        </div>
        {/* Type */}
        <div>
          <label htmlFor="type">Type : </label>
          <select name="type" id="type" onChange={handleChange} >
            <option value="Aucune">Aucune</option>
            <option value="fire">Feu</option>
            <option value="water">Eau</option>
            <option value="wind">Vent</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option> 
          </select>
        </div>
        {/* PV */}
        <div>
          <label htmlFor="vie">Points de Vie : </label>
          <input 
          type="number" 
          id="vie" 
          name="vie"  
          placeholder="Points de Vie" 
          onChange={handleChange}  
          />
        </div>
        {/* attaque */}
        <div>
          <label htmlFor="force">Attaque : </label>
          <input 
          type="number" 
          id="force" 
          name="force"  
          placeholder="Attaque" 
          onChange={handleChange}  
          />
        </div>
        {/* défense */}
        <div>
          <label htmlFor="defense">Défense : </label>
          <input 
          type="number" 
          id="defense" 
          name="defense"  
          placeholder="Défense" 
          onChange={handleChange}  
          />
        </div>
        {/* vitesse */}
        <div>
          <label htmlFor="vitesse">Vitesse : </label>
          <input 
          type="number" 
          id="vitesse" 
          name="vitesse"  
          placeholder="Vitesse" 
          onChange={handleChange}  
          />
        </div>
        {/* techniques */}
        <div>
          <label htmlFor="tech1">Technique 1 : </label>
          <input 
          type="text" 
          id="tech1" 
          name="tech1"  
          placeholder="Technique 1" 
          onChange={handleChange}  
          />
          <label htmlFor="tech2">   Technique 2 : </label>
          <input 
          type="text" 
          id="tech2" 
          name="tech2"  
          placeholder="Technique 2" 
          onChange={handleChange}  
          />
          <label htmlFor="tech3">   Technique 3 : </label>
          <input 
          type="text" 
          id="tech3" 
          name="tech3"  
          placeholder="Technique 3" 
          onChange={handleChange}  
          />
          <label htmlFor="tech4">   Technique 4 : </label>
          <input 
          type="text" 
          id="tech4" 
          name="tech4"  
          placeholder="Technique 4" 
          onChange={handleChange}  
          />
        </div>
        {/* talent */}
        <div>
          <label htmlFor="passif">Passif : </label>
          <input 
          type="text" 
          id="passif" 
          name="passif"  
          placeholder="Passif" 
          onChange={handleChange}  
          />
        </div>
        <br />
      <button>Ajouter</button>
      </form>
    </div>
  )
}

export default Add;