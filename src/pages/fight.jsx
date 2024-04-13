import { useEffect, useState } from "react";

// COMPONENT



// ACTIONS
import React from "react";

const Fight = () => {
  // sera exécutée au début du chargement de la page pour récupérer dans currentRoster le roster de personnages disponibles
  let myRoster = [];
  let [nextActive, setNextActive] = useState(-1);

  let [userHP, setUserHP] = useState(0);
  let [oppoHP, setOppoHP] = useState(0);

  let [userTP, setUserTP] = useState(0);
  let [oppoTP, setOppoTP] = useState(0);

  let [attackString, setAttackString] = useState('');
  let [addedString, setAddedString] = useState('');
  let [attackTalentString, setAttackTalentString] = useState('');
  let [defenseTalentString, setDefenseTalentString] = useState('');

  // constantes du battle engine
  let critRate = 16; // taux de critiques: 1/16
  let skillMultiplier = 5; // skill multiplier, valeur qui sera multipliée par l'ID de l'attaque
  let estCritique = 0 // stocke si le coup est critique au calcul
  let typeEffectiveness = 2;
  let rollValue = 60; // nombre de rolls différents disponibles lors du calcul de dégâts
  // constantes des classes
  // attaque
  let attaqueBoost = 20; // %age de boost de la classe
  let attaqueNerf = 10; // %age de nerf de la classe
  // défense
  let defenseBoost = 20; // %age de boost de la classe
  let defenseNerf = 10; // %age de nerf de la classe
  // cleric
  let clericHeal = 4; // ratio de heal lors de l'attaque
  let clericRegen = 10; // %age de heal des dégâts subis en fin de tour
  // tank
  let tankCounter = 15; // %age de renvoi des dégâts subis

  // contiendra la chaine du type
  let iconString = 'https://summonerswarskyarena.info/wp-content/themes/swsa/assets/img/';

  function getStateFromLocalStorage() {
    //initialiser le roster qui combattra, le perso du joueur à l'id 0 et le perso du bot à l'id 1 
    myRoster = JSON.parse(localStorage.getItem('battleRoster'));
    // initialiser les PVs des combattants 
    if (userHP == 0 && oppoHP == 0) {
      setUserHP(myRoster[0].vie);
      setOppoHP(myRoster[1].vie);
      setUserTP(10);
      setOppoTP(10);
    }
  };

  // regarde qui agit en premier dans le combat
  // TODO: check le cas du dernier élément
  function calcSpeed(user, target) {
    setNextActive(1);
    if(user.vitesse > target.vitesse) {
      setNextActive(0);
    }
  }

  // fonction qui s'occupe de gérer toutes les composantes de la battle phase
  // TODO: effets des classes
  // TODO: checker le KO
  function handleBattlePhase(user, target, atkID, battlerID) {
    setNextActive(battlerID);
    typeEffectiveness = checkTypeEffectiveness(user.type, target.type)
    var damage = calcDamage(user, target, atkID);
    if (nextActive == 0) {
      if (oppoTP < 10) {
        setOppoTP(oppoTP+1)
      }
      if (oppoHP - damage <= 0) {
        damage = oppoHP
        setOppoHP(0);
      } else {
        setOppoHP(oppoHP - damage);
      }
      if (user.categorie == "Cleric") {
        var heal = calcHeal(damage)
        if (userHP + heal > user.vie) {
          heal = user.vie - userHP
          setUserHP(user.vie)
        } else {
          setUserHP(userHP+heal)
        }
      }
      if (target.categorie == "Tank") {
        var counter = calcTank(damage)
        if (userHP - counter < 0) {
          counter = userHP
          setUserHP(0)
        } else {
          setUserHP(userHP-counter)
        }
      }
    } else {
      if (userTP < 10) {
        setUserTP(userTP+1)
      }
      if (userHP - damage <= 0) {
        damage = userHP
        setUserHP(0);
      } else {
        setUserHP(userHP - damage);
      }
      if (user.categorie == "Cleric") {
        var heal = calcHeal(damage)
        if (oppoHP + heal > user.vie) {
          heal = target.vie - userHP
          setOppoHP(target.vie)
        } else {
          setOppoHP(oppoHP+heal)
        }
      }
      if (target.categorie == "Tank") {
        var counter = calcTank(damage)
        if (oppoHP - counter < 0) {
          counter = oppoHP
          setOppoHP(0)
        } else {
          setOppoHP(oppoHP-counter)
        }
      }
    }
    if (nextActive == 0) {
      setAttackTalentString(processAttackTalentString(attackTalentString, damage, user, target, userHP))
    } else {
      setAttackTalentString(processAttackTalentString(attackTalentString, damage, user, target, oppoHP))
    }
    setAddedString(preprocessAddedString(addedString))
    setAttackString(preprocessAttackString(user, target, attackString, damage, atkID))
    setDefenseTalentString(processDefenseTalentString(defenseTalentString, damage, target, user))
  }

  // prépare la battle phase alliée
  function prepareAllyBattlePhase(user, target, atkID, battlerID) {
    var myTP = calcTech(atkID);
    if (myTP == 1) {
      setAttackTalentString('')
      setAttackString('');
      setDefenseTalentString('')
      handleBattlePhase(user, target, atkID, battlerID)
    }
  }

  // prépare la battle phase ennemie
  function prepareEnemyBattlePhase(user, target, id) {
    setAttackTalentString('')
    setAttackString('');
    setDefenseTalentString('')
    var oppoMove = oppoTP+1
    while (oppoMove > oppoTP) {
      oppoMove = 1+Math.floor(Math.random()*4)
      var tpCost = oppoMove -1
    }
    setOppoTP(oppoTP-tpCost)
    handleBattlePhase(user, target, oppoMove, id)
  }

  // retourne 1 si le coup est critique, 0 sinon
  function isCriticalHit(crit) {
    return (Math.floor((1+ Math.random()*crit)/crit))
  }

  // gère la table des types
  function checkTypeEffectiveness(type1, type2) {
    typeEffectiveness = 2
    if (type1 == "fire") {
      if (type2 == "wind") {
        typeEffectiveness = 3 // super effective
      } else if (type2 == "water") {
        typeEffectiveness = 1 // not very effective
      }
    }
    else if (type1 == "water") {
      if (type2 == "fire") {
        typeEffectiveness = 3 // super effective
      } else if (type2 == "wind") {
        typeEffectiveness = 1 // not very effective
      }
    }
    else if (type1 == "wind") {
      if (type2 == "water") {
        typeEffectiveness = 3 // super effective
      } else if (type2 == "fire") {
        typeEffectiveness = 1 // not very effective
      }
    }
    else if (type1 == "light") {
      if (type2 == "dark") {
        typeEffectiveness = 3 // super effective
      } else if (type2 == "light") {
        typeEffectiveness = 1 // not very effective
      }
    } else {
      if (type2 == "light") {
        typeEffectiveness = 3 // super effective
      } else if (type2 == "dark") {
        typeEffectiveness = 1 // not very effective
      }
    }
    return typeEffectiveness
  }

  // calcule la variance de dégâts lors du calcul
  function calcVariance(roll) {
    return (70 + Math.floor(Math.random()* (roll+1)));

  }

  // calcule le multiplicateur d'une compétence en fonction de son ID
  function calcSkillMultiplier(multiplier, id) {
    return multiplier*id
  }

  // calcule le boost offensif de l'attaque
  function tabulateOffensiveMultiplier(user, target) {
    var boostsOffensifs = 0;
    if (user.categorie == "Attaque") {
      boostsOffensifs += attaqueBoost;
    } else if (user.categorie == "Defense") {
      boostsOffensifs -= defenseNerf;
    } else if (user.categorie == "Support") {
      if (calcDiffSpeed(user, target) == 0) {
        boostsOffensifs += tabulateSpeedMultiplier(myRoster[0], myRoster[1])
      }
    }
    return (100+boostsOffensifs)/100
  }

  // calcule la réuction défensive sur l'attaque
  function tabulateDefensiveMultiplier(user, target) {
    var boostsDefensifs = 0;
    if (target.categorie == "Defense") {
      boostsDefensifs += defenseBoost;
    } else if (target.categorie == "Attaque") {
      boostsDefensifs -= attaqueNerf;
    } else if (target.categorie == "Support") {
      if (calcDiffSpeed(user, target) == 0) {
        boostsDefensifs += tabulateSpeedMultiplier(user, target)
      }
    }
    return (100+boostsDefensifs)/100
  }

  // calcule le différentiel de vitesse entre deux combattants
  function calcDiffSpeed(user, target) {
    var isUserFasterThanTarget = 0;
    (user.vitesse > target.vitesse) ?
      isUserFasterThanTarget = 1 : isUserFasterThanTarget = 0
    return isUserFasterThanTarget
  }

  // calcule et renvoie valeur finale du mulitplicateur de la classe support
  function tabulateSpeedMultiplier(user, target) {
    return 4*(Math.abs(user.vitesse - target.vitesse));
  }

  // s'occupe de la formule de calcul des dégâts
  function calcDamage(user, target, id) {
    // structure de dégâts totalement pas inspirée de Summoners War à travers ce lien (si)
    // lien: https://summonerswar.fandom.com/wiki/Guide:Skill_damage
    var userDamage = 1+Math.floor(user.force*(typeEffectiveness/2)*calcSkillMultiplier(skillMultiplier, id)*tabulateOffensiveMultiplier(user, target)*1.5)
    var targetReduction = 1000/(1140+3.5*target.defense*tabulateDefensiveMultiplier(user, target))
    estCritique = isCriticalHit(critRate); // permettra de multiplier par 1.5 les dégâts
    var critDmg = 1+estCritique*1/2
    var finalDamage = critDmg*userDamage*targetReduction*(calcVariance(rollValue)/100)
    return Math.floor(finalDamage);
  }

  // calcule la vie régénérée par les clerics
  function calcHeal(damage){
    return Math.floor(damage/4)
  }

  // calcule les dégâts renvoyés par les tanks
  function calcTank(damage){
    return Math.floor((tankCounter*damage)/100)
  }

  // calcule les PT consommés par les techniques
  function calcTech(atkID){
    var tpCost = atkID-1
    if (userTP < tpCost) {
      setAttackString('Pas assez de PT !')
      return 0
    } else {
      setUserTP(userTP-tpCost);
      return 1
    }
  }

  // permet de formater la chaine de caractères pour les crits et les types
  function preprocessAddedString(string) {
    var critString = ""
    var effectString = ""
    if (estCritique == 1) {
      critString = "Coup Critique !"
    }
    if (typeEffectiveness == 3) {
      effectString = " C'est super efficace !"
    } else if (typeEffectiveness == 1) {
      effectString = " Ce n'est pas très efficace !"
    }
    string = critString + effectString
    return string
  }

  // permet de formater la chaine de caractères pour l'attaque
  function preprocessAttackString(user, target, string, damage, id){
    string = user.techniques[id-1] + ' de ' + user.nom + ' inflige ' + damage + ' dégâts à ' + target.nom + ' !'
    return string
  }

  // concatène la chaîne liée aux talents offensifs
  function processAttackTalentString(string, damage, user, target, userHP) {
    string = ''
    if (user.categorie == "Attaque") {
      string = user.passif + ' renforce les dégâts de l\'attaque !'
    } else if (user.categorie == "Support") {
      if ( calcDiffSpeed(user, target) == 1 ) {
        string = user.nom + ' est plus rapide ! Les dégâts ont été augmentés de ' + tabulateSpeedMultiplier(myRoster[0], myRoster[1]) + '% grâce à ' + user.passif + ' !' 
      }
    } else if (user.categorie == "Cleric" && userHP != user.vie) {
      string = user.passif + ' de ' + user.nom + ' lui permet de soigner ' + Math.floor(damage/clericHeal) + ' PV.'
    }
    return string
  }
  
  // concatène la chaîne liée aux talents défensifs
  function processDefenseTalentString(string, damage, target, user) {
    string = ''
    if (target.categorie == "Defense") {
      string = target.passif + ' réduit les dégâts de l\'attaque !'
    } else if (target.categorie == "Tank") {
      string = target.passif + ' de ' + target.nom + ' lui permet de renvoyer ' + Math.floor((tankCounter*damage)/100) + ' dégâts.'
    } else if (target.categorie == "Support") {
      if ( calcDiffSpeed(target, user) == 0 ) {
        string = target.nom + ' est plus lent ! Les dégâts ont été réduits de ' + tabulateSpeedMultiplier(myRoster[0], myRoster[1]) + '% grâce à ' + target.passif + ' !' 
      }
    }
    return string
  }

  // retourner dans le menu home
  function returnToHome() {
    window.location.href = "/home";
  }

  // Composant s'occupant de gérer l'affichage dynamique des messages en combat en fonction du contexte
  function PrintBattleMessages() {
    if (userHP == 0) {
      return (
        <div>
          <p>{attackTalentString}</p>
          <p>{addedString}</p>
          <p>{attackString}</p>
          <p>{defenseTalentString}</p>
          <p>{myRoster[0].nom} est hors-combat. {myRoster[1].nom} est vainqueur !</p>
          <button onClick={() => returnToHome()}>Retourner au menu</button>
        </div>
      )
    } else if (oppoHP == 0) {
      return (
        <div>
          <p>{attackTalentString}</p>
          <p>{addedString}</p>
          <p>{attackString}</p>
          <p>{defenseTalentString}</p>
          <p>{myRoster[1].nom} est hors-combat. {myRoster[0].nom} est vainqueur !</p>
          <button onClick={() => returnToHome()}>Retourner au menu</button>
        </div>
      )
    } else if (userHP == 0 && oppoHP == 0) {
      return (
        <div>
          <p>{attackTalentString}</p>
          <p>{addedString}</p>
          <p>{attackString}</p>
          <p>{defenseTalentString}</p>
          <p>Les dex combattants sont hors-combat. C'est un match nul !</p>
          <button onClick={() => returnToHome()}>Retourner au menu</button>
        </div>
      )
    }
    if (nextActive == -1) {
      return (
        <div>
          <button onClick={() => calcSpeed(myRoster[0], myRoster[1])}>Que le combat commence !</button>
        </div>
      )
    } else if (nextActive == 0) {
      return (
        <div>
          <p>{attackTalentString}</p>
          <p>{addedString}</p>
          <p>{attackString}</p>
          <p>{defenseTalentString}</p>
          <button class="card-container" onClick={() => prepareAllyBattlePhase(myRoster[0], myRoster[1], 1, 1)}>{myRoster[0].techniques[0]}</button><button class="card-container" onClick={() => prepareAllyBattlePhase(myRoster[0], myRoster[1], 2, 1)}>{myRoster[0].techniques[1]}</button><button class="card-container" onClick={() => prepareAllyBattlePhase(myRoster[0], myRoster[1], 3, 1)}>{myRoster[0].techniques[2]}</button><button class="card-container" onClick={() => prepareAllyBattlePhase(myRoster[0], myRoster[1], 4, 1)}>{myRoster[0].techniques[3]}</button>
        </div>
      )
    } else if (nextActive == 1 ) {
      return (
        <div>
          <p>{attackTalentString}</p>
          <p>{addedString}</p>
          <p>{attackString}</p>
          <p>{defenseTalentString}</p>
          <button onClick={() => prepareEnemyBattlePhase(myRoster[1], myRoster[0], 0)}>L'adversaire attaque !</button>
        </div>
      )
    }
  }

  return (
    <div>
      {
        getStateFromLocalStorage()
      }
      <h1>Fight</h1>
      <div class="container">
        <div class="card-fighting">
          <table class="fighting">
            <thead>
              <tr>
                  <th>{myRoster[0].nom} <img src={iconString+myRoster[0].type+"-large.png"} width="16px"></img></th>
              </tr>
            </thead>
            <br />
            <tr>
              <img src={myRoster[0].image} width="100px" height="100px"></img>
            </tr>
            <br />
            <tr>
              <th>PV: {userHP} / {myRoster[0].vie}</th>
            </tr>
            <progress id="health1" value={userHP} max={myRoster[0].vie}></progress>
            <tr>
              <th>PT: {userTP} / 10</th>
            </tr>
            <progress id="mana1" value={userTP} max={10}></progress>
          </table>
        </div>
        <div class="card-fighting">
          <img src="https://comicvine.gamespot.com/a/uploads/original/11136/111361078/6676820-vs.png" width="100px" height="100px"></img>
        </div>
        <div class="card-fighting">
          <table class="fighting">
            <thead>
              <tr>
                  <th>{myRoster[1].nom} <img src={iconString+myRoster[1].type+"-large.png"} width="16px"></img></th>
              </tr>
            </thead>
            <br />
            <tr>
              <img src={myRoster[1].image} width="100px" height="100px"></img>
            </tr>
            <br />
            <tr>
              <th>PV: {oppoHP} / {myRoster[1].vie}</th>
            </tr>
            <progress id="health2" value={oppoHP} max={myRoster[1].vie}></progress>
            <tr>
              <th>PT: {oppoTP} / 10</th>
            </tr>
            <progress id="mana2" value={oppoTP} max={10}></progress>
          </table>
        </div>
      </div>
      <div>
        <PrintBattleMessages />
      </div>
    </div>
  )
}

export default Fight;