import { configureStore } from '@reduxjs/toolkit';
import Article from './article';

/*
ConfigureStore permet de créer le store plus simplement contrairement aux versions précédentes de Redux.

Cette méthode prend en paramètre un objet avec une propriété reducer qui prend en valeur le reducer principal de l'application.

La fonction ConfigureStore se connecte automatiquement à l'extension Redux DevTools.
*/

export default configureStore({
    reducer: {
        article: Article
    }
});