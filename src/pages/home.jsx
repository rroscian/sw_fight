import React, { useEffect, useState } from "react";
const path = '../service/data.json';
// COMPONENT

// ACTIONS


// entrée: valeur à exclure, valeur plafond
// sortie: valeur générée
// génère une valeur aléatoire de 0 à la valeur plafond excluant une valeur spécifique
function randExclusiveInt(exc, max) {
    var a = exc;
    while ( a === exc ) {
        a = Math.floor(Math.random() * max);
    }
    return a;
}

const Home = () => {

    // contiendra le roster pendant la génération de la page
    let storeApp = [];

    // contiendra le roster enregistré dans le localStorage
    const [currentRoster, setCurrentRoster] = useState([]);
    const [battleRoster, setBattleRoster] = useState([]);

    // contiendra la chaine du type
    let iconString = 'https://summonerswarskyarena.info/wp-content/themes/swsa/assets/img/';

  // sera exécutée au début du chargement de la page pour récupérer dans currentRoster le roster de personnages disponibles
    const getStateFromLocalStorage = () => {
        useEffect(() => {
        const currentRoster = JSON.parse(localStorage.getItem('roster'));
        if (currentRoster) {
            setCurrentRoster(currentRoster);
        }
        }, []);
    };
    
    // redirige vers la page d'ajouts
    const addCharacter = () => {
        window.location.href = "./add";
    }

    // stocke l'ID du combattant sélectionné
    // génère aléatoirement un ID non égal à l'ID du combattant et le stocke dans le localStorage
    const prepareFight = (id) => {
        id -=1; // On soustrait l'id de 1 pour accéder à l'array du localStorage à l'avenir
        //console.log(id);
        setBattleRoster(battleRoster.push(currentRoster[id]));
        const otherID = randExclusiveInt(id, currentRoster.length);
        setBattleRoster(battleRoster.push(currentRoster[otherID]));
        //console.log(otherID);
        localStorage.setItem(
            'battleRoster',
            JSON.stringify(battleRoster)
        );
        console.log(battleRoster)
        console.log(battleRoster[0]);
        console.log(battleRoster[1]);
        window.location.href = "./fight";
    }

    return(
        <div>
            {
            getStateFromLocalStorage()
            }
            <h1>Sélection des personnages</h1>
            <button align="center" onClick={() => addCharacter()}>
                Ajouter un nouveau personnage
            </button>
            <p></p>
            <div class="container">
                {Array.isArray(currentRoster) ? storeApp = currentRoster.map((item) => {
                    return(
                        <div>
                            <div class="card-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th colSpan={4}>{item.nom} <img src={iconString+item.type+"-large.png"} width="16px"></img></th>
                                        </tr>
                                        <tr>
                                            <th colSpan={4}>Catégorie: {item.categorie}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={4}><img src={item.image} alt="photo du combattant" align="center"></img></td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3}>Points de vie</td><td>{item.vie}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3}>Attaque</td><td>{item.force}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3}>Défense</td><td>{item.defense}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3}>Vitesse</td><td>{item.vitesse}</td>
                                        </tr>
                                        <tr>
                                            <th colSpan={4}>Techniques Spéciales</th>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>{item.techniques[0]}</td><td colSpan={2}>{item.techniques[1]}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>{item.techniques[2]}</td><td colSpan={2}>{item.techniques[3]}</td>
                                        </tr>
                                        <tr>
                                            <th colSpan={4}>Passif</th>
                                        </tr>
                                        <tr>
                                            <td colSpan={4}>{item.passif}</td>
                                        </tr>
                                        {/* {<td colSpan={3} align="center">{item.techniques.map((element) => <td class="techniques">{element}<br /></td>)}</td>} */}
                                    </tbody>
                                </table>
                            </div>
                            <button key={item.id} align="center" onClick={() => prepareFight(item.id)}>
                                Sélectionner {item.nom}
                            </button>
                        </div>
                    )
                }
                ) : [] }
            </div>
        </div>
    );
}

export default Home;